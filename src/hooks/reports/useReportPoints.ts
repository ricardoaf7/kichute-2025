
import { useMemo } from "react";

interface Participant {
  id: string;
  nome: string;
}

interface CalculatedPoints {
  playerId: string;
  playerName: string;
  monthlyPoints: Record<string, number>;
  totalPoints: number;
}

export const useReportPoints = (
  kichutes: any[],
  participants: Participant[],
  selectedYear: string,
  isMonthly: boolean = true
) => {
  const pointsByPlayerAndMonth = useMemo(() => {
    const calculatedPoints: CalculatedPoints[] = participants.map(participant => ({
      playerId: participant.id,
      playerName: participant.nome,
      monthlyPoints: {},
      totalPoints: 0
    }));

    kichutes.forEach(kichute => {
      const month = new Date(kichute.partida?.data).getMonth() + 1;
      const year = new Date(kichute.partida?.data).getFullYear().toString();
      
      if (year === selectedYear && kichute.jogador_id) {
        const playerIndex = calculatedPoints.findIndex(p => p.playerId === kichute.jogador_id);
        if (playerIndex !== -1) {
          if (!calculatedPoints[playerIndex].monthlyPoints[month]) {
            calculatedPoints[playerIndex].monthlyPoints[month] = 0;
          }
          calculatedPoints[playerIndex].monthlyPoints[month] += kichute.pontos || 0;
          calculatedPoints[playerIndex].totalPoints += kichute.pontos || 0;
        }
      }
    });

    // Sort by total points (descending)
    return calculatedPoints.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [kichutes, participants, selectedYear]);

  return pointsByPlayerAndMonth;
};
