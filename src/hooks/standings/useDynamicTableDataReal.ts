
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface JogadorData {
  id: string;
  nome: string;
  pontos_total: number;
  rodadas: Record<string, number>;
}

// Define a stronger type for the kichute response from Supabase
interface KichuteResponse {
  id: string;
  jogador?: {
    id: string;
    nome: string;
  } | null;
  partida_id: string;
  pontos: number | null;
}

export function useDynamicTableDataReal(
  selectedRodada: string,
  selectedMes: string,
  selectedAno: string
) {
  const [jogadores, setJogadores] = useState<JogadorData[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Primeiro, determinar o intervalo de datas baseado no mês/turno selecionado
        let startDate: string | null = null;
        let endDate: string | null = null;

        if (selectedMes !== "todos") {
          // Caso especial para turnos
          if (selectedMes === "01-07-2025") {
            // Primeiro turno (Janeiro a Julho)
            startDate = `${selectedAno}-01-01`;
            endDate = `${selectedAno}-07-31`;
          } else if (selectedMes === "08-12-2025") {
            // Segundo turno (Agosto a Dezembro)
            startDate = `${selectedAno}-08-01`;
            endDate = `${selectedAno}-12-31`;
          } else {
            // Mês específico
            const [mes] = selectedMes.split('-');
            const ultimoDia = new Date(parseInt(selectedAno), parseInt(mes), 0).getDate();
            startDate = `${selectedAno}-${mes}-01`;
            endDate = `${selectedAno}-${mes}-${ultimoDia}`;
          }
        }

        // 2. Construir a query base para partidas
        let query = supabase.from("partidas").select(`
          id,
          rodada,
          data
        `).order('rodada');

        // 3. Aplicar filtros
        if (selectedRodada !== "todas") {
          query = query.eq("rodada", parseInt(selectedRodada));
        }

        if (startDate && endDate) {
          query = query
            .gte("data", startDate)
            .lte("data", endDate);
        }

        const { data: partidas, error: partidasError } = await query;

        if (partidasError) {
          console.error("Erro ao buscar partidas:", partidasError);
          throw new Error("Não foi possível carregar as partidas");
        }

        // 4. Buscar os kichutes relacionados a estas partidas
        const { data: kichutesData, error: kichutesError } = await supabase
          .from("kichutes")
          .select(`
            id,
            jogador:jogadores(id, nome),
            partida_id,
            pontos
          `)
          .in("partida_id", partidas?.map(p => p.id) || []);

        if (kichutesError) {
          console.error("Erro ao buscar kichutes:", kichutesError);
          throw new Error("Não foi possível carregar os palpites");
        }

        // 5. Processar e organizar os dados
        const jogadoresMap: Record<string, JogadorData> = {};

        // Tratar kichutesData como um array de KichuteResponse
        (kichutesData as KichuteResponse[] || []).forEach(kichute => {
          // Verificar se o jogador existe e é um objeto (não um array)
          if (!kichute.jogador || Array.isArray(kichute.jogador)) {
            console.warn("Jogador inválido encontrado:", kichute.jogador);
            return;
          }
          
          const partida = partidas?.find(p => p.id === kichute.partida_id);
          if (!partida) return;

          // Extração segura das propriedades do jogador com type assertion
          const jogadorId = kichute.jogador.id;
          const jogadorNome = kichute.jogador.nome;
          
          if (!jogadorId || !jogadorNome) {
            console.warn("Dados de jogador incompletos:", kichute.jogador);
            return;
          }

          const rodada = `r${partida.rodada}`;
          const pontos = kichute.pontos || 0;

          if (!jogadoresMap[jogadorId]) {
            jogadoresMap[jogadorId] = {
              id: jogadorId,
              nome: jogadorNome,
              pontos_total: 0,
              rodadas: {}
            };
          }

          jogadoresMap[jogadorId].rodadas[rodada] = 
            (jogadoresMap[jogadorId].rodadas[rodada] || 0) + pontos;
          jogadoresMap[jogadorId].pontos_total += pontos;

          console.log(`[Points Update] ${jogadorNome} - Rodada ${rodada}:`, {
            pontos,
            total: jogadoresMap[jogadorId].pontos_total
          });
        });

        const jogadoresArray = Object.values(jogadoresMap);
        
        // 6. Extrair rodadas únicas e ordenar
        const rodasUnicas = [...new Set(partidas?.map(p => p.rodada))]
          .sort((a, b) => a - b);

        console.log('Dados processados:', {
          jogadores: jogadoresArray.length,
          rodadas: rodasUnicas.length,
          filtros: {
            rodada: selectedRodada,
            mes: selectedMes,
            ano: selectedAno,
            periodo: startDate ? `${startDate} até ${endDate}` : 'todos'
          }
        });

        setJogadores(jogadoresArray);
        setRodadas(rodasUnicas);

      } catch (err) {
        console.error("Erro ao processar dados:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [selectedRodada, selectedMes, selectedAno]);

  return { jogadores, rodadas, isLoading, error };
}
