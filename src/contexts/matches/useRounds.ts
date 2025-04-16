
import { useState, useEffect } from "react";
import { Round, Match } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRounds = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  return {
    rounds,
    setRounds,
    isLoading,
    handleAddRound,
    handleDeleteRound
  };
};
