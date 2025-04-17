
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Kichute {
  id: string;
  jogador_id: string;
  partida_id: string;
  palpite_casa: number;
  palpite_visitante: number;
  pontos: number;
}

export const useKichutes = (round?: number) => {
  const [kichutes, setKichutes] = useState<Kichute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKichutes = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('kichutes')
          .select(`
            id,
            jogador_id,
            partida_id,
            palpite_casa,
            palpite_visitante,
            pontos
          `);
          
        if (round) {
          // Quando uma rodada é especificada, filtramos palpites para partidas dessa rodada
          const { data: matchesData, error: matchesError } = await supabase
            .from('partidas')
            .select('id')
            .eq('rodada', round);
            
          if (matchesError) throw matchesError;
          
          if (matchesData && matchesData.length > 0) {
            const matchIds = matchesData.map(match => match.id);
            query = query.in('partida_id', matchIds);
          }
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log("Kichutes carregados:", data);
        setKichutes(data || []);
      } catch (err) {
        console.error("Erro ao carregar kichutes:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os palpites.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchKichutes();
  }, [round, toast]);

  return { kichutes, isLoading };
};
