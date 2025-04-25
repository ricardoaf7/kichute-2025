
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Kichute = {
  jogador_id: string;
  jogador_nome: string;
  rodada: string;
  pontos: number;
};

type JogadorAgrupado = {
  id: string;
  nome: string;
  pontos_total: number;
  rodadas: { [rodada: string]: number };
};

export function useDynamicTableDataReal(
  selectedRodada: string,
  selectedMes: string,
  selectedAno: string
) {
  const [jogadores, setJogadores] = useState<JogadorAgrupado[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      let query = supabase.from("kichutes").select(`
        jogador_id,
        jogador_nome,
        rodada,
        pontos
      `);

      if (selectedRodada !== "todas") {
        query = query.eq("rodada", selectedRodada);
      }

      const { data, error } = await query;

      if (error) {
        setError("Erro ao carregar dados dos jogadores");
        setIsLoading(false);
        return;
      }

      const agrupado: Record<string, JogadorAgrupado> = {};

      for (const item of data as Kichute[]) {
        if (!agrupado[item.jogador_id]) {
          agrupado[item.jogador_id] = {
            id: item.jogador_id,
            nome: item.jogador_nome,
            pontos_total: 0,
            rodadas: {},
          };
        }

        agrupado[item.jogador_id].pontos_total += item.pontos;
        agrupado[item.jogador_id].rodadas["r" + item.rodada] = item.pontos;
      }

      const jogadoresArray = Object.values(agrupado);
      
      // Extract unique rodadas and convert them to numbers
      const uniqueRodadas = [...new Set(data.map((item: Kichute) => parseInt(item.rodada)))];
      const sortedRodadas = uniqueRodadas.sort((a, b) => a - b);

      setJogadores(jogadoresArray);
      setRodadas(sortedRodadas);
      setIsLoading(false);
    }

    fetchData();
  }, [selectedRodada, selectedMes, selectedAno]);

  return { jogadores, rodadas, isLoading, error };
}
