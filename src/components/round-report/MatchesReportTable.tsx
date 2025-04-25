
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SCORING_SYSTEM } from "@/utils/mockData";
import { getPointsBadgeClass } from "@/utils/scoring";

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

interface Kichute {
  id: string;
  palpite_casa?: number;
  palpite_visitante?: number;
  pontos: number;
  jogador_id: string;
  jogador?: { id: string; nome: string };
  partida_id: string;
}

interface MatchesReportTableProps {
  matches: Match[];
  participants: Participant[];
  kichutes: Kichute[];
  fontSize?: "xs" | "sm" | "base" | "lg";
}

export const MatchesReportTable: React.FC<MatchesReportTableProps> = ({
  matches,
  participants,
  kichutes,
  fontSize = "base"
}) => {
  // Definir classes de tamanho de fonte baseado no prop fontSize
  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg"
  };
  
  const fontClass = fontSizeClasses[fontSize] || "text-sm";

  // Agrupar partidas por rodada
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.rodada]) {
      acc[match.rodada] = [];
    }
    acc[match.rodada].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  // Ordenar rodadas
  const sortedRounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  // Obter palpite para um participante e partida específica
  const getKichute = (participantId: string, matchId: string) => {
    return kichutes.find(
      (k) => k.jogador_id === participantId && k.partida_id === matchId
    );
  };

  // Obter classe de cor com base na pontuação usando a função do utility
  const getPontosColorClass = (pontos: number) => {
    if (pontos === SCORING_SYSTEM.exactScore) return "text-green-500";
    if (pontos === SCORING_SYSTEM.correctDifferenceOrDraw) return "text-blue-500";
    if (pontos === SCORING_SYSTEM.correctWinner) return "text-yellow-500";
    return "text-red-500";
  };

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
              <TableRow className="bg-muted/30">
                <TableCell 
                  colSpan={2 + participants.length} 
                  className="font-bold py-1 print:py-0"
                >
                  Rodada {rodada}
                </TableCell>
              </TableRow>
              {matchesByRound[rodada].map((match) => (
                <TableRow key={match.id} className="border-t border-border/30">
                  <TableCell className="p-2 print:p-1 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{match.time_casa.nome}</span>
                      <span>x</span>
                      <span>{match.time_visitante.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-2 print:p-1 text-center">
                    {match.placar_casa !== undefined && match.placar_visitante !== undefined ? (
                      <span className="font-bold">
                        {match.placar_casa} x {match.placar_visitante}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Não jogado
                      </span>
                    )}
                  </TableCell>
                  {participants.map((participant) => {
                    const kichute = getKichute(participant.id, match.id);
                    return (
                      <TableCell 
                        key={`${match.id}-${participant.id}`} 
                        className="p-2 print:p-1 text-center"
                      >
                        {kichute ? (
                          <div className="flex flex-col items-center justify-center">
                            <span>
                              {kichute.palpite_casa} x {kichute.palpite_visitante}
                            </span>
                            <span className={cn("font-bold", getPontosColorClass(kichute.pontos))}>
                              {kichute.pontos}pts
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground print:text-gray-400">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
