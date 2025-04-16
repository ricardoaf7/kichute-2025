
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Match } from "@/types";
import { MatchFormValues } from "./types";

export const useMatchActions = (setRounds: (rounds: any) => void) => {
  const { toast } = useToast();

  const handleDeleteMatch = async (matchId: string, roundNumber: number) => {
    if (confirm("Tem certeza que deseja excluir esta partida?")) {
      try {
        const { error } = await supabase
          .from('partidas')
          .delete()
          .eq('id', matchId);

        if (error) throw error;
        
        // Atualizar o estado local após exclusão bem-sucedida
        setRounds(prev => 
          prev.map(round => {
            if (round.number === roundNumber) {
              return {
                ...round,
                matches: round.matches.filter(match => match.id !== matchId)
              };
            }
            return round;
          })
        );
        
        toast({
          title: "Partida excluída",
          description: "A partida foi removida com sucesso."
        });
      } catch (error) {
        console.error('Erro ao excluir partida:', error);
        toast({
          title: "Erro ao excluir partida",
          description: "Não foi possível excluir a partida.",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateResults = async (match: Match, homeScore: number, awayScore: number) => {
    try {
      const { error } = await supabase
        .from('partidas')
        .update({
          placar_casa: homeScore,
          placar_visitante: awayScore
        })
        .eq('id', match.id);

      if (error) throw error;

      // Atualizar o estado local após atualização bem-sucedida
      setRounds(prev => 
        prev.map(round => {
          if (round.number === match.round) {
            return {
              ...round,
              matches: round.matches.map(m => 
                m.id === match.id
                  ? {
                      ...m,
                      homeScore,
                      awayScore,
                      played: true
                    }
                  : m
              )
            };
          }
          return round;
        })
      );

      toast({
        title: "Resultado atualizado",
        description: "O resultado da partida foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao atualizar resultado:', error);
      toast({
        title: "Erro ao atualizar resultado",
        description: "Não foi possível atualizar o resultado da partida.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitMatch = async (values: MatchFormValues, editingMatch: Match | null) => {
    try {
      const homeTeamId = values.homeTeam;
      const awayTeamId = values.awayTeam;
      const roundNumber = parseInt(values.round);

      if (homeTeamId === awayTeamId) {
        toast({
          title: "Erro ao salvar partida",
          description: "Os times da casa e visitante não podem ser os mesmos.",
          variant: "destructive"
        });
        return;
      }

      // Formato para o campo 'local' no banco de dados
      const location = values.stadium + (values.city ? `, ${values.city}` : '');
      
      // Preparar dados para inserção ou atualização
      const matchData = {
        rodada: roundNumber,
        data: values.matchDate.toISOString(),
        time_casa_id: homeTeamId,
        time_visitante_id: awayTeamId,
        local: location
      };

      if (editingMatch) {
        // Atualizar partida existente
        const { error } = await supabase
          .from('partidas')
          .update(matchData)
          .eq('id', editingMatch.id);

        if (error) throw error;

        toast({
          title: "Partida atualizada",
          description: "A partida foi atualizada com sucesso."
        });
      } else {
        // Criar nova partida
        const { data, error } = await supabase
          .from('partidas')
          .insert(matchData)
          .select();

        if (error) throw error;

        toast({
          title: "Partida adicionada",
          description: "A partida foi adicionada com sucesso."
        });
      }

      // Recarregar as partidas para atualizar a lista
      const { data: updatedMatches, error: fetchError } = await supabase
        .from('partidas')
        .select(`
          id,
          rodada,
          data,
          local,
          placar_casa,
          placar_visitante,
          time_casa:times!time_casa_id(id, nome, sigla, escudo_url, estadio),
          time_visitante:times!time_visitante_id(id, nome, sigla, escudo_url)
        `)
        .order('rodada')
        .order('data');

      if (fetchError) throw fetchError;

      // Transformar dados do Supabase para o formato do app
      const transformedMatches = updatedMatches.map((match): Match => ({
        id: match.id,
        round: match.rodada,
        homeTeam: {
          id: match.time_casa.id,
          name: match.time_casa.nome,
          shortName: match.time_casa.sigla,
          logoUrl: match.time_casa.escudo_url,
          homeStadium: match.time_casa.estadio,
          city: ''  // Add empty city property to fix TypeScript error
        },
        awayTeam: {
          id: match.time_visitante.id,
          name: match.time_visitante.nome,
          shortName: match.time_visitante.sigla,
          logoUrl: match.time_visitante.escudo_url,
          homeStadium: '',  // Add empty homeStadium property to fix TypeScript error
          city: ''  // Add empty city property to fix TypeScript error
        },
        homeScore: match.placar_casa,
        awayScore: match.placar_visitante,
        date: match.data,
        played: match.placar_casa !== null && match.placar_visitante !== null,
        stadium: match.local ? match.local.split(',')[0].trim() : '',
        city: match.local && match.local.includes(',') 
          ? match.local.split(',').slice(1).join(',').trim() 
          : ''
      }));

      // Agrupar partidas por rodada
      const roundNumbers = [...new Set(transformedMatches.map(m => m.round))];
      const newRounds = roundNumbers.map(roundNumber => {
        const roundMatches = transformedMatches.filter(m => m.round === roundNumber);
        return {
          number: roundNumber,
          matches: roundMatches,
          closed: false,
          deadline: new Date().toISOString()
        };
      });

      setRounds(newRounds);

      return true;
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      toast({
        title: "Erro ao salvar partida",
        description: "Não foi possível salvar a partida no banco de dados.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch
  };
};
