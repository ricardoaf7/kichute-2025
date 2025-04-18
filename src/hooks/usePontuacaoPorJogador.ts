import { useKichuteData } from "@/hooks/useKichuteData";

export const usePontuacaoPorJogador = (rodada: string, jogador: string) => {
  const { kichutes, isLoading, error } = useKichuteData(rodada, jogador);

  const jogadores = Object.entries(
    kichutes.reduce((acc, k) => {
      const nome = k.jogador.nome;
      acc[nome] = (acc[nome] || 0) + k.pontos;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total);

  return {
    jogadores,
    isLoading,
    error,
  };
};
