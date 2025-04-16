
import { useToast } from "@/hooks/use-toast";
import { Match, Round } from "@/types";
import { updateMatchResult } from "./utils/supabaseHelpers";

export const useMatchResults = (setRounds: React.Dispatch<React.SetStateAction<Round[]>>) => {
  const { toast } = useToast();

  const handleUpdateResults = async (match: Match, homeScore: number, awayScore: number) => {
    const { success, error } = await updateMatchResult(match.id, homeScore, awayScore);

    if (success) {
      // Update the local state after successful update
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
    } else {
      toast({
        title: "Erro ao atualizar resultado",
        description: error || "Não foi possível atualizar o resultado da partida.",
        variant: "destructive"
      });
    }
  };

  return { handleUpdateResults };
};
