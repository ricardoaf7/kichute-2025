
import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyAnnualReportProps {
  kichutes: any[];
  participants: any[];
  selectedYear: string;
  isMonthly?: boolean;
}

export const MonthlyAnnualReport = ({
  kichutes,
  participants,
  selectedYear,
  isMonthly = true
}: MonthlyAnnualReportProps) => {
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const pointsByPlayerAndMonth = useMemo(() => {
    const points: Record<string, Record<string, number>> = {};
    
    // Initialize points object
    participants.forEach(participant => {
      points[participant.id] = {};
      monthNames.forEach((_, index) => {
        points[participant.id][index + 1] = 0;
      });
    });

    // Calculate points for each month
    kichutes.forEach(kichute => {
      const month = new Date(kichute.partida?.data).getMonth() + 1;
      const year = new Date(kichute.partida?.data).getFullYear().toString();
      
      if (year === selectedYear && kichute.jogador_id) {
        if (!points[kichute.jogador_id]) {
          points[kichute.jogador_id] = {};
        }
        if (!points[kichute.jogador_id][month]) {
          points[kichute.jogador_id][month] = 0;
        }
        points[kichute.jogador_id][month] += kichute.pontos || 0;
      }
    });

    return points;
  }, [kichutes, participants, selectedYear]);

  const totalPointsByPlayer = useMemo(() => {
    const totals: Record<string, number> = {};
    
    Object.entries(pointsByPlayerAndMonth).forEach(([playerId, monthlyPoints]) => {
      totals[playerId] = Object.values(monthlyPoints).reduce((sum, points) => sum + points, 0);
    });
    
    return totals;
  }, [pointsByPlayerAndMonth]);

  // Sort participants by total points
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => 
      (totalPointsByPlayer[b.id] || 0) - (totalPointsByPlayer[a.id] || 0)
    );
  }, [participants, totalPointsByPlayer]);

  const getPositionIcon = (position: number) => {
    if (position === 0) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (position === 1) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (position === 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted print:bg-white">
        <CardTitle className="text-xl">
          {isMonthly ? `Relatório Mensal - ${selectedYear}` : `Relatório Anual - ${selectedYear}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-48">Participante</TableHead>
                {isMonthly && monthNames.map((month, index) => (
                  <TableHead key={month} className="text-center w-24">
                    {month}
                  </TableHead>
                ))}
                <TableHead className="text-center w-32 font-bold">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParticipants.map((participant, index) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {getPositionIcon(index)}
                      {participant.nome}
                    </div>
                  </TableCell>
                  {isMonthly && Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <TableCell key={`${participant.id}-${month}`} className="text-center">
                      {pointsByPlayerAndMonth[participant.id]?.[month] || 0}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">
                    {totalPointsByPlayer[participant.id] || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
