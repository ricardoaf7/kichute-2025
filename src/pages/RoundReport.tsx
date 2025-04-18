
import React from "react";
import { useMatches, MatchesProvider } from "@/contexts/MatchesContext";
import RoundSelector from "@/components/RoundSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { Trophy, Medal, Star } from "lucide-react";
import { calculatePoints, getPointsBadgeClass } from "@/utils/scoring";
import RoundTotalScore from "@/components/round-report/RoundTotalScore";
import { useParticipants } from "@/hooks/useParticipants";
import { useKichutes } from "@/hooks/useKichutes";

const getPointsIcon = (points: number) => {
  if (points >= 7) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (points >= 4) return <Medal className="h-4 w-4 text-blue-500" />;
  if (points >= 2) return <Star className="h-4 w-4 text-green-500" />;
  return null;
};

const RoundReportContent = () => {
  const { rounds, selectedRound, setSelectedRound } = useMatches();
  const { participants, isLoading: isLoadingParticipants } = useParticipants();
  const { kichutes, isLoading: isLoadingKichutes } = useKichutes(selectedRound);
  
  const currentRound = rounds.find(r => r.number === selectedRound);
  
  const getPlayerGuess = (matchId: string, playerId: string) => {
    // Buscar o palpite real do jogador para esta partida
    const kichute = kichutes.find(
      k => k.partida_id === matchId && k.jogador_id === playerId
    );
    
    if (kichute) {
      return {
        homeScore: kichute.palpite_casa,
        awayScore: kichute.palpite_visitante
      };
    }
    
    // Se não existir palpite, retorna null
    return null;
  };
  
  const calculatePlayerPoints = (matchId: string, playerId: string, match: any) => {
    if (!match.played) return null;
    
    const guess = getPlayerGuess(matchId, playerId);
    
    // Se não tiver palpite, retorna null
    if (!guess) return null;
    
    return calculatePoints(guess, { 
      homeScore: match.homeScore, 
      awayScore: match.awayScore 
    });
  };

  const isLoading = isLoadingParticipants || isLoadingKichutes;

  console.log("Dados para RoundReport:", {
    selectedRound,
    participantsCount: participants.length,
    kichutesCount: kichutes.length,
    isLoading
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Relatório da Rodada</h1>
        
        <div className="mb-6">
          <RoundSelector 
            rounds={rounds} 
            currentRound={selectedRound} 
            onRoundChange={setSelectedRound} 
          />
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center bg-muted rounded-lg">
            <p className="text-lg text-muted-foreground">Carregando dados...</p>
          </div>
        ) : currentRound ? (
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle className="text-xl">Comparativo de Palpites - Rodada {selectedRound}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[200px] sticky left-0 z-20 bg-muted/50">Partida</TableHead>
                    <TableHead className="w-[120px] sticky left-[200px] z-20 bg-muted/50">Resultado</TableHead>
                    {participants.map(participant => (
                      <TableHead key={participant.id} className="text-center">
                        {participant.nome}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRound?.matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium sticky left-0 z-10 bg-inherit">
                        {match.homeTeam.shortName} x {match.awayTeam.shortName}
                      </TableCell>
                      <TableCell className="sticky left-[200px] z-10 bg-inherit">
                        <ScoreDisplay 
                          homeScore={match.homeScore} 
                          awayScore={match.awayScore} 
                          isMatchPlayed={match.played} 
                        />
                      </TableCell>
                      
                      {participants.map(participant => {
                        const guess = getPlayerGuess(match.id, participant.id);
                        const points = calculatePlayerPoints(match.id, participant.id, match);
                        
                        return (
                          <TableCell key={participant.id} className="text-center">
                            <div className="flex flex-col items-center space-y-1">
                              {guess ? (
                                <div className="text-sm font-medium">
                                  {guess.homeScore} x {guess.awayScore}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">-</div>
                              )}
                              
                              {points !== null && (
                                <div className={getPointsBadgeClass(points)}>
                                  <span className="flex items-center">
                                    {getPointsIcon(points)}
                                    <span className="ml-1">{points}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  
                  {currentRound && <RoundTotalScore selectedRound={currentRound.number} />}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-8 bg-muted rounded-lg">
            <p className="text-lg text-muted-foreground">
              Nenhuma rodada selecionada ou disponível.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RoundReport = () => {
  return (
    <MatchesProvider>
      <RoundReportContent />
    </MatchesProvider>
  );
};

export default RoundReport;
