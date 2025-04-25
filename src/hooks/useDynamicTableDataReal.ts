
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { calculatePoints } from "@/utils/scoring";
import { SCORING_SYSTEM } from "@/utils/mockData";

export interface JogadorData {
  id: string;
  nome: string;
  rodadas: Record<string, number>;
  pontos_total: number;
}

export const useDynamicTableDataReal = (
  selectedRodada: string,
  selectedMes: string,
  selectedAno: string
) => {
  const [jogadores, setJogadores] = useState<JogadorData[]>([]);
  const [rodadas, setRodadas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, get all matches for the selected filters
        let partidasQuery = supabase.from("partidas").select(`
          id,
          rodada,
          data,
          placar_casa,
          placar_visitante
        `);
        
        // Apply filters
        if (selectedRodada !== "todas") {
          partidasQuery = partidasQuery.eq("rodada", parseInt(selectedRodada));
        }

        if (selectedMes !== "todos") {
          const [mesInicio, mesFim] = selectedMes === "01-02" 
            ? ["01", "02"] 
            : [selectedMes, selectedMes];
          
          const dataInicio = `${selectedAno}-${mesInicio}-01`;
          const ultimoDia = mesFim === "02" ? "28" : 
                           ["04", "06", "09", "11"].includes(mesFim) ? "30" : "31";
          const dataFim = `${selectedAno}-${mesFim}-${ultimoDia}`;
          
          partidasQuery = partidasQuery
            .gte("data", dataInicio)
            .lte("data", dataFim);
        }

        const { data: partidas, error: partidasError } = await partidasQuery;
        
        if (partidasError) throw partidasError;

        // Now get all kichutes for these matches
        const { data: kichutesData, error: kichutesError } = await supabase
          .from("kichutes")
          .select(`
            id,
            palpite_casa,
            palpite_visitante,
            jogador:jogadores(id, nome),
            partida_id
          `)
          .in("partida_id", partidas?.map(p => p.id) || []);

        if (kichutesError) throw kichutesError;
        
        // Process data and recalculate points
        const jogadoresMap: Record<string, JogadorData> = {};
        
        kichutesData?.forEach(kichute => {
          if (!kichute.jogador) return;
          
          const partida = partidas?.find(p => p.id === kichute.partida_id);
          if (!partida) return;
          
          const jogadorId = kichute.jogador.id;
          const jogadorNome = kichute.jogador.nome;
          const rodada = `r${partida.rodada}`;
          
          if (!jogadoresMap[jogadorId]) {
            jogadoresMap[jogadorId] = {
              id: jogadorId,
              nome: jogadorNome,
              rodadas: {},
              pontos_total: 0
            };
          }
          
          // Recalculate points using the same logic as other views
          let pontos = 0;
          if (partida.placar_casa !== null && partida.placar_visitante !== null &&
              kichute.palpite_casa !== null && kichute.palpite_visitante !== null) {
            pontos = calculatePoints(
              { homeScore: kichute.palpite_casa, awayScore: kichute.palpite_visitante },
              { homeScore: partida.placar_casa, awayScore: partida.placar_visitante },
              SCORING_SYSTEM
            );
          }
          
          jogadoresMap[jogadorId].rodadas[rodada] = 
            (jogadoresMap[jogadorId].rodadas[rodada] || 0) + pontos;
          jogadoresMap[jogadorId].pontos_total += pontos;
          
          console.log(`[Points Calculation] ${jogadorNome} - Rodada ${rodada}:`, {
            palpite: `${kichute.palpite_casa}x${kichute.palpite_visitante}`,
            resultado: `${partida.placar_casa}x${partida.placar_visitante}`,
            pontos: pontos
          });
        });

        const jogadoresArray = Object.values(jogadoresMap);
        const rodasUnicas = [...new Set(partidas?.map(p => `r${p.rodada}`))]
          .sort((a, b) => {
            const numA = parseInt(a.substring(1));
            const numB = parseInt(b.substring(1));
            return numA - numB;
          });

        console.log('Processed data:', {
          jogadores: jogadoresArray,
          rodadas: rodasUnicas
        });

        setJogadores(jogadoresArray);
        setRodadas(rodasUnicas);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedRodada, selectedMes, selectedAno]);

  return { jogadores, rodadas, isLoading, error };
};
