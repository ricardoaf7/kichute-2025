import { useKichuteData } from "@/hooks/useKichuteData";

export const useDynamicTableDataReal = (
  selectedRodada: string,
  selectedMes: string,
  selectedAno: string
) => {
  const { kichutes, isLoading, error } = useKichuteData(selectedRodada, "todos");

  // Agrupar os pontos por jogador
  const jogadoresMap: Record<string, { nome: string; rodadas: Record<string, number>; pontos_total: number }> = {};

  kichutes.forEach((k) => {
    const jogador = k.jogador.nome;
    const rodada = `r${k.rodada}`;

    if (!jogadoresMap[jogador]) {
      jogadoresMap[jogador] = {
        nome: jogador,
        rodadas: {},
        pontos_total: 0,
      };
    }

    jogadoresMap[jogador].rodadas[rodada] = (jogadoresMap[jogador].rodadas[rodada] || 0) + k.pontos;
    jogadoresMap[jogador].pontos_total += k.pontos;
  });

  const jogadores = Object.values(jogadoresMap);
  const rodadas = Array.from(new Set(kichutes.map((k) => `r${k.rodada}`))).sort();

  return { jogadores, rodadas, isLoading, error };
};
