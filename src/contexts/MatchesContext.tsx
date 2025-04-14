
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Match, Round, Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTeams } from "@/hooks/teams/useTeams";

interface MatchesContextType {
  rounds: Round[];
  selectedRound: number;
  editingMatch: Match | null;
  setRounds: (rounds: Round[]) => void;
  setSelectedRound: (round: number) => void;
  setEditingMatch: (match: Match | null) => void;
  handleAddRound: () => void;
  handleDeleteRound: (roundNumber: number) => void;
  handleEditMatch: (match: Match) => void;
  handleDeleteMatch: (matchId: string, roundNumber: number) => void;
  handleUpdateResults: (match: Match, homeScore: number, awayScore: number) => void;
  handleSubmitMatch: (values: MatchFormValues) => void;
  resetForm: () => void;
}

export interface MatchFormValues {
  round: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  stadium: string;
  city: string;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { teams } = useTeams();

  // Buscar partidas do Supabase
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const { data: matchesData, error } = await supabase
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

        if (error) throw error;

        // Transformar dados do Supabase para o formato do app
        const transformedMatches = matchesData.map((match): Match => ({
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
        const newRounds: Round[] = roundNumbers.map(roundNumber => {
          const roundMatches = transformedMatches.filter(m => m.round === roundNumber);
          return {
            number: roundNumber,
            matches: roundMatches,
            closed: false, // Poderia vir de uma coluna no banco de dados
            deadline: new Date().toISOString()
          };
        });

        setRounds(newRounds);
      } catch (error) {
        console.error('Erro ao carregar partidas:', error);
        toast({
          title: "Erro ao carregar partidas",
          description: "Não foi possível carregar as partidas do banco de dados.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const resetForm = () => {
    setEditingMatch(null);
  };

  const handleAddRound = () => {
    const newRoundNumber = rounds.length > 0 
      ? Math.max(...rounds.map(r => r.number)) + 1 
      : 1;
    
    const newRound: Round = {
      number: newRoundNumber,
      matches: [],
      closed: false,
      deadline: new Date().toISOString(),
    };
    
    setRounds(prev => [...prev, newRound]);
    toast({
      title: "Rodada adicionada",
      description: `Rodada ${newRoundNumber} criada com sucesso.`
    });
  };

  const handleDeleteRound = (roundNumber: number) => {
    if (confirm(`Tem certeza que deseja excluir a Rodada ${roundNumber}?`)) {
      setRounds(prev => prev.filter(r => r.number !== roundNumber));
      toast({
        title: "Rodada excluída",
        description: `Rodada ${roundNumber} foi removida com sucesso.`
      });
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
  };

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

  const handleSubmitMatch = async (values: MatchFormValues) => {
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
      const newRounds: Round[] = roundNumbers.map(roundNumber => {
        const roundMatches = transformedMatches.filter(m => m.round === roundNumber);
        return {
          number: roundNumber,
          matches: roundMatches,
          closed: false,
          deadline: new Date().toISOString()
        };
      });

      setRounds(newRounds);

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      toast({
        title: "Erro ao salvar partida",
        description: "Não foi possível salvar a partida no banco de dados.",
        variant: "destructive"
      });
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

  const value: MatchesContextType = {
    rounds,
    selectedRound,
    editingMatch,
    setRounds,
    setSelectedRound,
    setEditingMatch,
    handleAddRound,
    handleDeleteRound,
    handleEditMatch,
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch,
    resetForm
  };

  return (
    <MatchesContext.Provider value={value}>
      {children}
    </MatchesContext.Provider>
  );
};
