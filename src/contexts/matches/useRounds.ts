
import { useState, useEffect } from "react";
import { Round, Match } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { fetchAllMatches } from "./utils/supabaseHelpers";
import { groupMatchesToRounds } from "./utils/matchTransformers";

export const useRounds = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all matches from Supabase
  useEffect(() => {
    const loadMatches = async () => {
      setIsLoading(true);
      
      const { data: matches, error } = await fetchAllMatches();
      
      if (error) {
        toast({
          title: "Erro ao carregar partidas",
          description: error,
          variant: "destructive"
        });
      } else if (matches) {
        // Group matches by round
        const newRounds = groupMatchesToRounds(matches);
        setRounds(newRounds);
      }
      
      setIsLoading(false);
    };

    loadMatches();
  }, [toast]);

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
