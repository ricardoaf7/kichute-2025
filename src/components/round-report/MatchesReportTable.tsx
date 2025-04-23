
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { Trophy, Medal, Star } from "lucide-react";
import { getPointsBadgeClass } from "@/utils/scoring";
import { calculatePoints } from "@/utils/scoring";
import RoundTotalScore from "./RoundTotalScore";

interface MatchesReportTableProps {
  matches: any[];
  participants: any[];
  kichutes: any[];
}

// Função para calcular os top N indexes de pontuação para anual
function getTopIndexes(pointsArr: number[], count: number = 3) {
  const sorted = [...pointsArr].sort((a, b) => b - a).slice(0, count);
  return sorted.map(score => pointsArr.indexOf(score));
}

// Para relatório: só vencedor (1º) recebe taça na rodada/mês e os 3 recebem na anual.
const getReportIcons = (pointsArr: number[], visualMode: "rodada" | "mes" | "anual") => {
  const max = Math.max(...pointsArr);
  if (visualMode === "anual") {
    // Top 3 recebem troféu, medalha, estrela
    const topIndexes = getTopIndexes(pointsArr, 3);
    return pointsArr.map((p, idx) =>
      idx === topIndexes[0] ? <Trophy className="h-4 w-4 text-yellow-500" />
      : idx === topIndexes[1] ? <Medal className="h-4 w-4 text-blue-500" />
      : idx === topIndexes[2] ? <Star className="h-4 w-4 text-green-500" />
      : null
    );
  } else {
    // Só vencedor: taça
    return pointsArr.map((p, idx) =>
      p === max ? <Trophy className="h-4 w-4 text-yellow-500" /> : null
    );
  }
};

// Para esta tabela, vamos considerar o modo como "rodada" (relatório individual). Poderia fazer heurística para mensal/anual.
export const MatchesReportTable = ({ matches, participants, kichutes }: MatchesReportTableProps) => {
  const validMatches = matches?.filter(match =>
    match && match.time_casa && match.time_visitante &&
    match.time_casa.sigla && match.time_visitante.sigla
  ) || [];

  // Função para calcular pontos do palpite
  const calculateGuessPoints = (guess: any, match: any) => {
    if (!guess || !match) return 0;
    if (match.placar_casa === null || match.placar_visitante === null) return 0;
    return calculatePoints(
      { homeScore: guess.palpite_casa, awayScore: guess.palpite_visitante },
      { homeScore: match.placar_casa, awayScore: match.placar_visitante }
    );
  };

  // Calcular pontos totais de cada participante (para anual ou rodada)
  const totalPointsArr = participants.map(participant => {
    let total = 0;
    validMatches.forEach(match => {
      const guess = kichutes.find(
        k => k.partida_id === match.id && k.jogador_id === participant.id
      );
      total += calculateGuessPoints(guess, match);
    });
    return total;
  });

  // Por padrão, consideramos relatório por rodada: só um vencedor com taça.
  const visualMode: "rodada" | "mes" | "anual" = "rodada";
  const iconsByParticipant = getReportIcons(totalPointsArr, visualMode);

  return (
    <div className="rounded-lg border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-20 bg-muted w-[200px]">Partida</TableHead>
            <TableHead className="sticky left-[200px] z-20 bg-muted">Resultado</TableHead>
            {participants.map(participant => (
              <TableHead key={participant.id} className="text-center min-w-[120px]">
                {participant.nome}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {validMatches.length > 0 ? (
            validMatches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="sticky left-0 z-10 bg-inherit font-medium whitespace-nowrap">
                  {match.time_casa.sigla} x {match.time_visitante.sigla}
                </TableCell>
                <TableCell className="sticky left-[200px] z-10 bg-inherit">
                  <ScoreDisplay
                    homeScore={match.placar_casa}
                    awayScore={match.placar_visitante}
                    isMatchPlayed={match.placar_casa !== null && match.placar_visitante !== null}
                  />
                </TableCell>
                {participants.map((participant, idx) => {
                  const guess = kichutes.find(
                    k => k.partida_id === match.id && k.jogador_id === participant.id
                  );
                  const points = calculateGuessPoints(guess, match);
                  return (
                    <TableCell key={`${match.id}-${participant.id}`} className="text-center">
                      <div className="flex flex-col items-center space-y-1">
                        {guess ? (
                          <>
                            <div className="text-sm font-medium">
                              {guess.palpite_casa} x {guess.palpite_visitante}
                            </div>
                            <div className={getPointsBadgeClass(points)}>
                              <span className="flex items-center gap-1">
                                {/* Adiciona o ícone do relatório para esse participante (ex: taça) apenas na coluna do total */}
                                {iconsByParticipant[idx]}
                                <span>{points}</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={participants.length + 2} className="text-center py-4">
                Nenhuma partida disponível para esta rodada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <RoundTotalScore selectedRound={Number(validMatches[0]?.rodada || 0)} />
        </TableFooter>
      </Table>
    </div>
  );
};
