
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
        
        // 2. Buscar pontuações da tabela pontuacao_rodada
        let query = supabase.from('pontuacao_rodada')
          .select('rodada, jogador_id, pontos');
          
        if (selectedRodada !== "todas") {
          query = query.eq('rodada', parseInt(selectedRodada));
        }
        
        const { data: pontuacoesData, error: pontuacoesError } = await query;
        
        if (pontuacoesError) throw pontuacoesError;
        
        console.log("Pontuações encontradas:", pontuacoesData || []);
        
        // 3. Organizar dados por jogador
        const jogadoresFormatados: JogadorData[] = [];
        
        for (const jogador of jogadoresData) {
          // Filtrar pontuações para este jogador
          const pontuacoesJogador = pontuacoesData?.filter(p => p.jogador_id === jogador.id) || [];
          const rodadasObj: Record<string, number> = {};
          let pontosTotais = 0;
          
          // Processar pontuações da tabela pontuacao_rodada
          pontuacoesJogador.forEach(p => {
            const rodadaKey = `r${p.rodada}`;
            const pontos = typeof p.pontos === 'number' ? p.pontos : parseInt(String(p.pontos), 10) || 0;
            rodadasObj[rodadaKey] = pontos;
            pontosTotais += pontos;
          });
          
          // Se não encontrou pontuação na tabela pontuacao_rodada, buscar diretamente na tabela kichutes
          if (pontosTotais === 0) {
            console.log(`Buscando pontos diretamente dos kichutes para ${jogador.nome}`);
            
            // Vamos buscar pontos de kichutes agrupados por rodada
            try {
              const { data: kichutesData, error: kichutesError } = await supabase
                .from('kichutes')
                .select('pontos, partida:partidas(rodada)')
                .eq('jogador_id', jogador.id);
              
              if (kichutesError) throw kichutesError;
              
              if (kichutesData && kichutesData.length > 0) {
                console.log(`Encontrados ${kichutesData.length} kichutes para ${jogador.nome}:`, kichutesData);
                
                // Agrupar pontos por rodada
                const pontosPorRodada: Record<string, number> = {};
                
                kichutesData.forEach(kichute => {
                  if (kichute.partida && kichute.partida.rodada) {
                    const rodada = kichute.partida.rodada;
                    const rodadaKey = `r${rodada}`;
                    const pontos = typeof kichute.pontos === 'number' ? kichute.pontos : parseInt(String(kichute.pontos), 10) || 0;
                    
                    if (!pontosPorRodada[rodadaKey]) {
                      pontosPorRodada[rodadaKey] = 0;
                    }
                    
                    pontosPorRodada[rodadaKey] += pontos;
                    pontosTotais += pontos;
                  }
                });
                
                // Adicionar pontos das rodadas ao objeto de rodadas
                Object.entries(pontosPorRodada).forEach(([rodada, pontos]) => {
                  rodadasObj[rodada] = pontos;
                });
                
                console.log(`Total de pontos calculados para ${jogador.nome}: ${pontosTotais}`);
              }
            } catch (kichutesErr) {
              console.error(`Erro ao buscar kichutes para ${jogador.nome}:`, kichutesErr);
            }
          }
          
          jogadoresFormatados.push({
            id: jogador.id,
            nome: jogador.nome,
            pontos_total: pontosTotais,
            rodadas: rodadasObj
          });
        }
        
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
