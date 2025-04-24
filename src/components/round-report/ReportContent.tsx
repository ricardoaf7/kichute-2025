
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchesReportTable } from "./MatchesReportTable";

interface ReportContentProps {
  matches: any[];
  participants: any[];
  kichutes: any[];
  isLoading: boolean;
  reportTitle: string;
}

export const ReportContent: React.FC<ReportContentProps> = ({
  matches,
  participants,
  kichutes,
  isLoading,
  reportTitle,
}) => {
  const formattedMatches = matches.map(match => ({
    id: match.id,
    rodada: match.rodada,
    time_casa: match.time_casa,
    time_visitante: match.time_visitante,
    placar_casa: match.placar_casa,
    placar_visitante: match.placar_visitante
  }));

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }

  if (formattedMatches.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-muted-foreground">
          Nenhuma partida disponível para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-muted print:bg-white">
        <CardTitle className="text-xl">{reportTitle}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MatchesReportTable
          matches={formattedMatches}
          participants={participants}
          kichutes={kichutes}
          fontSize="sm"
        />
      </CardContent>
    </Card>
  );
};
