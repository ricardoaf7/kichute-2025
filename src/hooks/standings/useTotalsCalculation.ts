
import { JogadorData } from "./useDynamicTableDataReal";

export const useTotalsCalculation = (jogadores: JogadorData[], todasRodadas: string[]) => {
  const calcularTotalPorRodada = () => {
    const totais: Record<string, number> = {};
    todasRodadas.forEach(rodada => {
      totais[rodada] = jogadores.reduce((sum, jogador) => {
        return sum + (jogador.rodadas[rodada] || 0);
      }, 0);
    });
    return totais;
  };
  
  const totalGeral = jogadores.reduce((sum, jogador) => sum + jogador.pontos_total, 0);
  const totaisPorRodada = calcularTotalPorRodada();

  return {
    totaisPorRodada,
    totalGeral
  };
};
