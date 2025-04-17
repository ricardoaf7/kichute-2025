
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PontuacaoRodada {
  id: string;
  rodada: number;
  jogador: {
    id: string;
    nome: string;
  };
  pontos: number;
}

export const usePontuacaoRodada = (selectedRound?: number) => {
  const [pontuacoes, setPontuacoes] = useState<PontuacaoRodada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPontuacao = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('pontuacao_rodada')
          .select(`
            id,
            rodada,
            pontos,
            jogador:jogadores(id, nome)
          `)
          .order('pontos', { ascending: false });

        if (selectedRound) {
          query = query.eq('rodada', selectedRound);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedData = data.map(item => ({
          id: item.id,
          rodada: item.rodada,
          jogador: item.jogador,
          pontos: item.pontos
        }));

        console.log("Pontuação rodada:", formattedData);
        setPontuacoes(formattedData);
      } catch (err) {
        console.error("Erro ao carregar pontuação:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a pontuação desta rodada.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPontuacao();
  }, [selectedRound, toast]);

  return { pontuacoes, isLoading };
};
