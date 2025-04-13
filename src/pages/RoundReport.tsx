
import React, { useState } from "react";
import { useMatches } from "@/contexts/MatchesContext";
import RoundSelector from "@/components/RoundSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScoreDisplay } from "@/components/match/ScoreDisplay";
import { 
  Trophy,
  Medal,
  Star
} from "lucide-react";
import { calculatePoints, getPointsBadgeClass } from "@/utils/scoring";
import { PLAYERS } from "@/utils/mockData";

// Mapeamento de ícones para diferentes pontuações
const getPointsIcon = (points: number) => {
  if (points >= 7) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (points >= 4) return <Medal className="h-4 w-4 text-blue-500" />;
  if (points >= 2) return <Star className="h-4 w-4 text-green-500" />;
  return null;
};

const RoundReport = () => {
  const { rounds, selectedRound, setSelectedRound } = useMatches();
  
  // Encontrar a rodada atual
  const currentRound = rounds.find(r => r.number === selectedRound);
  
  // Obter palpites simulados para cada jogador (em uma aplicação real, viria do banco de dados)
  const getPlayerGuesses = (matchId: string, playerId: string) => {
    // Simular um palpite baseado no ID do jogador e da partida para demonstração
    const hash = (matchId + playerId).split('').reduce((a, b) => (a * 31 + b.charCodeAt(0)) & 0xfffffff, 0);
    return {
      homeScore: (hash % 4),
      awayScore: ((hash >> 2) % 4)
    };
  };
  
  // Calcular pontos para um palpite
  const calculatePlayerPoints = (matchId: string, playerId: string, match: any) => {
    if (!match.played) return null;
    
    const guess = getPlayerGuesses(matchId, playerId);
    return calculatePoints(guess, { 
      homeScore: match.homeScore, 
      awayScore: match.awayScore 
    });
  };
  
  // Calcular pontos totais do jogador na rodada
  const calculateTotalPoints = (playerId: string) => {
    if (!currentRound) return 0;
    
    return currentRound.matches.reduce((total, match) => {
      if (!match.played) return total;
      const points = calculatePlayerPoints(match.id, playerId, match) || 0;
      return total + points;
    }, 0);
  };

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
        
        {currentRound ? (
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle className="text-xl">Comparativo de Palpites - Rodada {selectedRound}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[200px]">Partida</TableHead>
                    <TableHead className="w-[120px]">Resultado</TableHead>
                    {PLAYERS.map(player => (
                      <TableHead key={player.id} className="text-center">
                        {player.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRound.matches.map(match => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">
                        {match.homeTeam.shortName} x {match.awayTeam.shortName}
                      </TableCell>
                      <TableCell>
                        <ScoreDisplay 
                          homeScore={match.homeScore} 
                          awayScore={match.awayScore} 
                          isMatchPlayed={match.played} 
                        />
                      </TableCell>
                      
                      {PLAYERS.map(player => {
                        const guess = getPlayerGuesses(match.id, player.id);
                        const points = calculatePlayerPoints(match.id, player.id, match);
                        
                        return (
                          <TableCell key={player.id} className="text-center">
                            <div className="flex flex-col items-center space-y-1">
                              <div className="text-sm font-medium">
                                {guess.homeScore} x {guess.awayScore}
                              </div>
                              
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
                  
                  {/* Linha de totais */}
                  <TableRow className="bg-muted/30 font-bold">
                    <TableCell colSpan={2} className="text-right">
                      Total de Pontos:
                    </TableCell>
                    
                    {PLAYERS.map(player => {
                      const totalPoints = calculateTotalPoints(player.id);
                      
                      return (
                        <TableCell key={player.id} className="text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <span>{totalPoints}</span>
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
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

export default RoundReport;
