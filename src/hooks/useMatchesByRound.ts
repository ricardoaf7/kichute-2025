
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMatchesByRound = (selectedRound: string) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("partidas")
          .select(`
            id,
            rodada,
            data,
            local,
            placar_casa,
            placar_visitante,
            time_casa:times!time_casa_id(id, nome, sigla, escudo_url),
            time_visitante:times!time_visitante_id(id, nome, sigla, escudo_url)
          `)
          .eq("rodada", parseInt(selectedRound))
          .order("data");

        if (error) throw error;

        console.log("Partidas encontradas para rodada", selectedRound, ":", data);
        setMatches(data || []);
      } catch (err) {
        console.error("Erro ao carregar partidas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as partidas para esta rodada.",
          variant: "destructive"
        });
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedRound) {
      fetchMatches();
    }
  }, [selectedRound, toast]);

  return { matches, isLoading };
};
