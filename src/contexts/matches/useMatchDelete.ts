
import { useToast } from "@/hooks/use-toast";
import { Round } from "@/types";
import { deleteMatch } from "./utils/supabaseHelpers";

export const useMatchDelete = (setRounds: (rounds: Round[]) => void) => {
  const { toast } = useToast();

  const handleDeleteMatch = async (matchId: string, roundNumber: number) => {
    if (confirm("Tem certeza que deseja excluir esta partida?")) {
      const { success, error } = await deleteMatch(matchId);
      
      if (success) {
        // Update local state after successful deletion
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
      } else {
        toast({
          title: "Erro ao excluir partida",
          description: error || "Não foi possível excluir a partida.",
          variant: "destructive"
        });
      }
    }
  };

  return { handleDeleteMatch };
};
