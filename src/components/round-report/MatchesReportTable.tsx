
import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SCORING_SYSTEM } from "@/utils/mockData";
import { Trophy, Medal, Star } from "lucide-react";

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
  const matchesByRound = useMemo(() => {
    const grouped = matches.reduce((acc, match) => {
      if (!acc[match.rodada]) {
        acc[match.rodada] = [];
      }
      acc[match.rodada].push(match);
      return acc;
    }, {} as Record<number, Match[]>);

    return grouped;
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

  // Obter palpite para um participante e partida específica
  const getKichute = (participantId: string, matchId: string) => {
    return kichutes.find(
      (k) => k.jogador_id === participantId && k.partida_id === matchId
    );
  };

  // Obter ícone baseado na pontuação
  const getPontosIcon = (pontos: number) => {
    if (pontos === SCORING_SYSTEM.exactScore) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (pontos === SCORING_SYSTEM.correctDifferenceOrDraw) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (pontos === SCORING_SYSTEM.correctWinner) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  // Obter classe de cor com base na pontuação
  const getPontosColorClass = (pontos: number) => {
    if (pontos === SCORING_SYSTEM.exactScore) return "text-green-600 font-bold";
    if (pontos === SCORING_SYSTEM.correctDifferenceOrDraw) return "text-blue-600 font-bold";
    if (pontos === SCORING_SYSTEM.correctWinner) return "text-yellow-600 font-bold";
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
                  colSpan={2} 
                  className="font-bold py-1 print:py-0"
                >
                  Rodada {rodada}
                </TableCell>
                {participants.map(participant => (
                  <TableCell 
                    key={`total-${rodada}-${participant.id}`}
                    className="py-1 print:py-0 text-center font-bold"
                  >
                    {totalPointsByRoundAndParticipant[rodada]?.[participant.id] || 0} pts
                  </TableCell>
                ))}
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
                            <span className={cn("font-medium", getPontosColorClass(kichute.pontos))}>
                              {getPontosIcon(kichute.pontos)}
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
