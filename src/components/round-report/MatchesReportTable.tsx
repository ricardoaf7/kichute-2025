
import React, { useMemo } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoundHeader } from "./report-table/RoundHeader";
import { MatchRow } from "./report-table/MatchRow";
import { cn } from "@/lib/utils";

interface Match {
  id: string;
  rodada: number;
  time_casa: { nome: string; sigla: string };
  time_visitante: { nome: string; sigla: string };
  placar_casa?: number;
  placar_visitante?: number;
}

interface Participant {
  id: string;
  nome: string;
}

interface MatchesReportTableProps {
  matches: Match[];
  participants: Participant[];
  kichutes: any[];
  fontSize?: "xs" | "sm" | "base" | "lg";
}

export const MatchesReportTable: React.FC<MatchesReportTableProps> = ({
  matches,
  participants,
  kichutes,
  fontSize = "base"
}) => {
  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg"
  };
  
  const fontClass = fontSizeClasses[fontSize] || "text-sm";

  // Agrupar partidas por rodada
  const matchesByRound = useMemo(() => {
    return matches.reduce((acc, match) => {
      if (!acc[match.rodada]) {
        acc[match.rodada] = [];
      }
      acc[match.rodada].push(match);
      return acc;
    }, {} as Record<number, Match[]>);
  }, [matches]);

  // Ordenar rodadas
  const sortedRounds = useMemo(() => {
    return Object.keys(matchesByRound)
      .map(Number)
      .sort((a, b) => a - b);
  }, [matchesByRound]);

  // Calcular total de pontos por participante por rodada
  const totalPointsByRoundAndParticipant = useMemo(() => {
    const totals: Record<number, Record<string, number>> = {};
    
    kichutes.forEach(kichute => {
      const match = matches.find(m => m.id === kichute.partida_id);
      if (!match) return;
      
      const rodada = match.rodada;
      
      if (!totals[rodada]) {
        totals[rodada] = {};
      }
      
      if (!totals[rodada][kichute.jogador_id]) {
        totals[rodada][kichute.jogador_id] = 0;
      }
      
      totals[rodada][kichute.jogador_id] += kichute.pontos || 0;
    });
    
    return totals;
  }, [kichutes, matches]);

  return (
    <div className={cn("overflow-x-auto", fontClass)}>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-1/6 p-2 print:p-1">Partida</TableHead>
            <TableHead className="w-1/6 p-2 print:p-1 text-center">Resultado</TableHead>
            {participants.map((participant) => (
              <TableHead 
                key={participant.id} 
                className="p-2 print:p-1 text-center whitespace-nowrap"
              >
                {participant.nome}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRounds.map((rodada) => (
            <React.Fragment key={`rodada-${rodada}`}>
              <RoundHeader
                roundNumber={rodada}
                participantPoints={totalPointsByRoundAndParticipant[rodada] || {}}
                participants={participants}
              />
              {matchesByRound[rodada].map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  participants={participants}
                  kichutes={kichutes}
                />
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
