
import { useToast } from "@/hooks/use-toast";
import { Match, Round } from "@/types";
import { MatchFormValues } from "./types";
import { saveMatch, fetchAllMatches } from "./utils/supabaseHelpers";
import { groupMatchesToRounds } from "./utils/matchTransformers";

export const useMatchSubmit = (setRounds: (rounds: Round[]) => void) => {
  const { toast } = useToast();

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
        return false;
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

      // Save match to database
      const { success, error } = await saveMatch(
        matchData, 
        editingMatch?.id
      );

      if (!success) {
        throw new Error(error || "Erro ao salvar partida");
      }

      toast({
        title: editingMatch ? "Partida atualizada" : "Partida adicionada",
        description: editingMatch 
          ? "A partida foi atualizada com sucesso." 
          : "A partida foi adicionada com sucesso."
      });

      // Refresh matches from the database
      const { data: matches, error: fetchError } = await fetchAllMatches();
      
      if (fetchError) {
        toast({
          title: "Erro ao atualizar lista",
          description: fetchError,
          variant: "destructive"
        });
        return true; // Return true because the save was successful
      }

      if (matches) {
        // Update rounds with fresh data
        const newRounds = groupMatchesToRounds(matches);
        setRounds(newRounds);
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      toast({
        title: "Erro ao salvar partida",
        description: error instanceof Error 
          ? error.message 
          : "Não foi possível salvar a partida no banco de dados.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { handleSubmitMatch };
};
