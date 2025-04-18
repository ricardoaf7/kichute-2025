
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { Trophy, Medal, Star } from "lucide-react";
import { getPointsBadgeClass } from "@/utils/scoring";

interface MatchesReportTableProps {
  matches: any[];
  participants: any[];
  kichutes: any[];
}

const getPointsIcon = (points: number) => {
  if (points >= 7) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (points >= 4) return <Medal className="h-4 w-4 text-blue-500" />;
  if (points >= 2) return <Star className="h-4 w-4 text-green-500" />;
  return null;
};

export const MatchesReportTable = ({ matches, participants, kichutes }: MatchesReportTableProps) => {
  // Calculate totals for each participant
  const participantTotals = participants.reduce((acc, participant) => {
    const total = kichutes
      .filter(k => k.jogador_id === participant.id)
      .reduce((sum, k) => sum + (k.pontos || 0), 0);
    acc[participant.id] = total;
    return acc;
  }, {});

  console.log("Totais calculados:", participantTotals);

  return (
    <div className="rounded-lg border shadow-sm">
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
          {matches.map((match) => (
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
              
              {participants.map(participant => {
                const guess = kichutes.find(
                  k => k.partida_id === match.id && k.jogador_id === participant.id
                );
                
                return (
                  <TableCell key={`${match.id}-${participant.id}`} className="text-center">
                    <div className="flex flex-col items-center space-y-1">
                      {guess ? (
                        <>
                          <div className="text-sm font-medium">
                            {guess.palpite_casa} x {guess.palpite_visitante}
                          </div>
                          {guess.pontos !== null && (
                            <div className={getPointsBadgeClass(guess.pontos)}>
                              <span className="flex items-center gap-1">
                                {getPointsIcon(guess.pontos)}
                                <span>{guess.pontos}</span>
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="font-bold">
            <TableCell className="sticky left-0 z-20 bg-muted">Total da Rodada</TableCell>
            <TableCell className="sticky left-[200px] z-20 bg-muted">-</TableCell>
            {participants.map(participant => (
              <TableCell key={`total-${participant.id}`} className="text-center">
                {participantTotals[participant.id] || 0}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
