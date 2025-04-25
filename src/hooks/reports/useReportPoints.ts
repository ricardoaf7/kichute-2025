
import { useMemo } from "react";
import { calculatePoints } from "@/utils/scoring";
import { SCORING_SYSTEM } from "@/utils/mockData";

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
    console.log('Processing points calculation with:', {
      kichutesCount: kichutes.length,
      participantsCount: participants.length,
      selectedYear,
      isMonthly
    });

    const calculatedPoints: CalculatedPoints[] = participants.map(participant => ({
      playerId: participant.id,
      playerName: participant.nome,
      monthlyPoints: {},
      totalPoints: 0
    }));

    kichutes.forEach(kichute => {
      const matchDate = kichute.partida?.data ? new Date(kichute.partida.data) : null;
      if (!matchDate) return;

      const month = matchDate.getMonth() + 1;
      const year = matchDate.getFullYear().toString();
      
      if (year === selectedYear && kichute.jogador_id) {
        const playerIndex = calculatedPoints.findIndex(p => p.playerId === kichute.jogador_id);
        if (playerIndex === -1) return;

        // Recalculate points using the same logic as other views
        let points = 0;
        if (kichute.partida?.placar_casa !== null && 
            kichute.partida?.placar_visitante !== null &&
            kichute.palpite_casa !== null && 
            kichute.palpite_visitante !== null) {
            
          points = calculatePoints(
            { 
              homeScore: kichute.palpite_casa, 
              awayScore: kichute.palpite_visitante 
            },
            { 
              homeScore: kichute.partida.placar_casa, 
              awayScore: kichute.partida.placar_visitante 
            },
            SCORING_SYSTEM
          );
        }

        if (!calculatedPoints[playerIndex].monthlyPoints[month]) {
          calculatedPoints[playerIndex].monthlyPoints[month] = 0;
        }
        
        calculatedPoints[playerIndex].monthlyPoints[month] += points;
        calculatedPoints[playerIndex].totalPoints += points;

        console.log(`[Monthly Points] ${calculatedPoints[playerIndex].playerName} - Month ${month}:`, {
          palpite: `${kichute.palpite_casa}x${kichute.palpite_visitante}`,
          resultado: `${kichute.partida?.placar_casa}x${kichute.partida?.placar_visitante}`,
          points
        });
      }
    });

    // Sort by total points (descending)
    return calculatedPoints.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [kichutes, participants, selectedYear]);

  return pointsByPlayerAndMonth;
};
