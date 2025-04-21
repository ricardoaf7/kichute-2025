
import { useToast } from "@/hooks/use-toast";
import { Match, Round } from "@/types";
import { MatchFormValues } from "./types";
import { saveMatch, fetchAllMatches } from "./utils/supabaseHelpers";
import { groupMatchesToRounds } from "./utils/matchTransformers";

export const useMatchSubmit = (setRounds: React.Dispatch<React.SetStateAction<Round[]>>) => {
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

      // Obtém a data/hora exatamente como informada pelo usuário
      const matchDate = values.matchDate;

      // Cria uma string ISO com a data e hora local, mas com ajuste para o fuso horário
      // Isso garante que a data/hora exibida será a mesma que foi inserida
      const year = matchDate.getFullYear();
      const month = String(matchDate.getMonth() + 1).padStart(2, '0');
      const day = String(matchDate.getDate()).padStart(2, '0');
      const hours = String(matchDate.getHours()).padStart(2, '0');
      const minutes = String(matchDate.getMinutes()).padStart(2, '0');

      // Formato: YYYY-MM-DDTHH:MM:00-03:00 (para horário de Brasília)
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:00-03:00`;

      console.log('Data formatada para salvar:', formattedDate);

      // Salvar a data/hora no localStorage para reutilização
      localStorage.setItem('lastMatchDateTime', matchDate.toISOString());

      // Preparar dados para inserção ou atualização
      const matchData = {
        rodada: roundNumber,
        data: formattedDate,
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
