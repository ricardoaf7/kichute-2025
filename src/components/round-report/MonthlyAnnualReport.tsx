
import React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportTableHeader } from "./report-table/ReportTableHeader";
import { PlayerRow } from "./report-table/PlayerRow";
import { useReportPoints } from "@/hooks/reports/useReportPoints";

interface MonthlyAnnualReportProps {
  kichutes: any[];
  participants: any[];
  selectedYear: string;
  isMonthly?: boolean;
}

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const MonthlyAnnualReport = ({
  kichutes,
  participants,
  selectedYear,
  isMonthly = true
}: MonthlyAnnualReportProps) => {
  const sortedPlayerPoints = useReportPoints(kichutes, participants, selectedYear, isMonthly);

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
            <ReportTableHeader monthNames={monthNames} isMonthly={isMonthly} />
            <TableBody>
              {sortedPlayerPoints.map((player, index) => (
                <PlayerRow
                  key={player.playerId}
                  playerName={player.playerName}
                  monthlyPoints={player.monthlyPoints}
                  totalPoints={player.totalPoints}
                  position={index}
                  isMonthly={isMonthly}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
