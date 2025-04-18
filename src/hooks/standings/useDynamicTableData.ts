
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface JogadorData {
  id: string;
  nome: string;
  pontos_total: number;
  rodadas: Record<string, number>;
}

export const useDynamicTableData = (
  selectedRodada: string,
  selectedMes: string,
  selectedAno: string
) => {
  const [jogadores, setJogadores] = useState<JogadorData[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch rodadas
  useEffect(() => {
    const fetchRodadas = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) throw error;
        
        const uniqueRodadas = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setRodadas(uniqueRodadas);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        setError("Não foi possível carregar as rodadas");
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas",
          variant: "destructive"
        });
      }
    };

    fetchRodadas();
  }, [toast]);

  // Fetch pontuações
  useEffect(() => {
    const fetchPontuacoes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Buscar todos os jogadores
        const { data: jogadoresData, error: jogadoresError } = await supabase
          .from('jogadores')
          .select('id, nome')
          .order('nome');
        
        if (jogadoresError) throw jogadoresError;
        
        if (!jogadoresData || jogadoresData.length === 0) {
          setJogadores([]);
          setIsLoading(false);
          setError("Nenhum jogador encontrado");
          return;
        }
        
        console.log("Buscando pontuações para jogadores:", jogadoresData.map(j => j.nome).join(", "));
        
        // 2. Buscar pontuações por rodada da tabela pontuacao_rodada
        let query = supabase.from('pontuacao_rodada')
          .select('rodada, jogador_id, pontos');
          
        if (selectedRodada !== "todas") {
          query = query.eq('rodada', parseInt(selectedRodada));
        }
        
        const { data: pontuacoesData, error: pontuacoesError } = await query;
        
        if (pontuacoesError) throw pontuacoesError;
        
        console.log("Pontuações encontradas:", pontuacoesData || []);
        
        // 3. Organizar dados por jogador
        const jogadoresFormatados = jogadoresData.map(jogador => {
          const pontuacoesJogador = pontuacoesData?.filter(p => p.jogador_id === jogador.id) || [];
          const rodadasObj: Record<string, number> = {};
          let pontosTotais = 0;
          
          pontuacoesJogador.forEach(p => {
            const rodadaKey = `r${p.rodada}`;
            const pontos = typeof p.pontos === 'number' ? p.pontos : parseInt(String(p.pontos), 10) || 0;
            rodadasObj[rodadaKey] = pontos;
            pontosTotais += pontos;
          });
          
          // Se não encontrou pontuação nas rodadas, tentar a tabela de kichutes diretamente
          if (pontosTotais === 0) {
            console.log(`Buscando pontos diretamente dos kichutes para ${jogador.nome}`);
          }
          
          return {
            id: jogador.id,
            nome: jogador.nome,
            pontos_total: pontosTotais,
            rodadas: rodadasObj
          };
        });
        
        console.log("Dados formatados dos jogadores:", jogadoresFormatados);
        setJogadores(jogadoresFormatados);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados dos jogadores");
        toast({
          title: "Erro",
          description: "Erro ao carregar dados dos jogadores",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPontuacoes();
  }, [selectedRodada, selectedMes, selectedAno, toast]);

  return { jogadores, rodadas, meses, isLoading, error };
};
