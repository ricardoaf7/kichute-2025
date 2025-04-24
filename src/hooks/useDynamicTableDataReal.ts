
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [kichutes, setKichutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Primeiro vamos buscar as partidas para determinar quais rodadas pertencem a cada mês
        let partidasQuery = supabase.from("partidas").select("id, rodada, data");
        
        // Aplicar filtro por mês se não estiver em "todos"
        if (selectedMes !== "todos") {
          const [mesInicio, mesFim] = selectedMes === "01-02" 
            ? ["01", "02"] 
            : [selectedMes, selectedMes]; // Para o caso especial "Janeiro/Fevereiro"
          
          // Construir a data inicial e final para o filtro de mês
          const dataInicio = `${selectedAno}-${mesInicio}-01`;
          // Calcular o último dia do mês final
          const ultimoDia = mesFim === "02" ? "28" : 
                           ["04", "06", "09", "11"].includes(mesFim) ? "30" : "31";
          const dataFim = `${selectedAno}-${mesFim}-${ultimoDia}`;
          
          partidasQuery = partidasQuery
            .gte("data", dataInicio)
            .lte("data", dataFim);
        }

        if (selectedRodada !== "todas") {
          // Convert string to number for the rodada comparison
          partidasQuery = partidasQuery.eq("rodada", parseInt(selectedRodada, 10));
        }
        
        // Executar a consulta de partidas
        const { data: partidas, error: partidasError } = await partidasQuery;
        
        if (partidasError) throw partidasError;
        
        // Extrair as rodadas disponíveis no período selecionado
        const rodasDoMes = new Set(partidas?.map(p => p.rodada) || []);
        
        // 2. Agora vamos buscar os kichutes para essas rodadas
        let kichutesData: any[] = [];
        
        if (rodasDoMes.size > 0) {
          const { data: kichutesResult, error: kichutesError } = await supabase
            .from("kichutes")
            .select(`
              id,
              pontos,
              jogador:jogadores(id, nome),
              partida:partidas(rodada)
            `)
            .in("partida.rodada", Array.from(rodasDoMes));
            
          if (kichutesError) throw kichutesError;
          kichutesData = kichutesResult || [];
        }

        setKichutes(kichutesData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedRodada, selectedMes, selectedAno]);

  // Agrupar os pontos por jogador
  const jogadoresMap: Record<string, JogadorData> = {};

  kichutes.forEach((k) => {
    if (!k.jogador || !k.partida) return;
    
    const jogador = k.jogador.nome;
    const jogadorId = k.jogador.id || `jogador-${jogador}`;
    const rodada = `r${k.partida.rodada}`;

    if (!jogadoresMap[jogador]) {
      jogadoresMap[jogador] = {
        id: jogadorId,
        nome: jogador,
        rodadas: {},
        pontos_total: 0,
      };
    }

    jogadoresMap[jogador].rodadas[rodada] = (jogadoresMap[jogador].rodadas[rodada] || 0) + k.pontos;
    jogadoresMap[jogador].pontos_total += k.pontos;
  });

  const jogadores = Object.values(jogadoresMap);
  
  // Obter apenas as rodadas que têm dados
  const rodadas = Array.from(
    new Set(
      kichutes
        .filter(k => k.partida && k.partida.rodada)
        .map(k => `r${k.partida.rodada}`)
    )
  ).sort((a, b) => {
    const numA = parseInt(a.substring(1));
    const numB = parseInt(b.substring(1));
    return numA - numB;
  });

  return { jogadores, rodadas, isLoading, error };
};
