
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ROUNDS, GUESSES, PLAYERS } from "../utils/mockData";
import RoundSelector from "../components/RoundSelector";
import GuessingForm from "../components/GuessingForm";
import { toast } from "../components/ui/use-toast";
import { Guess } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { ScoreDisplay } from "../components/match/ScoreDisplay";
import { calculatePoints, getPointsBadgeClass } from "../utils/scoring";
import { Trophy, Medal, Star } from "lucide-react";

// Mapeamento de ícones para diferentes pontuações
const getPointsIcon = (points: number) => {
  if (points >= 7) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (points >= 4) return <Medal className="h-4 w-4 text-blue-500" />;
  if (points >= 2) return <Star className="h-4 w-4 text-green-500" />;
  return null;
};

const Kichutes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roundParam = searchParams.get("round");
  const [currentRound, setCurrentRound] = useState(roundParam ? parseInt(roundParam) : 1);
  const [currentPlayerId, setCurrentPlayerId] = useState(PLAYERS[0].id); // Default to first player
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAllGuesses, setShowAllGuesses] = useState(false);

  useEffect(() => {
    // Update URL when round changes
    setSearchParams({ round: currentRound.toString() });
  }, [currentRound, setSearchParams]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRoundChange = (round: number) => {
    setCurrentRound(round);
    // Simulate loading between rounds
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 300);
  };

  const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPlayerId(e.target.value);
  };

  const handleSubmitGuesses = (guesses: Omit<Guess, "id" | "points">[]) => {
    // Simulate API call
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Submitted guesses:", guesses);
      
      toast({
        title: "Kichutes salvos com sucesso!",
        description: `Seus kichutes para a rodada ${currentRound} foram registrados.`,
        variant: "default",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const currentRoundData = ROUNDS.find(r => r.number === currentRound);
  const matches = currentRoundData?.matches || [];
  const isRoundClosed = currentRoundData?.closed || false;
  
  // Check if the round deadline has passed
  const isDeadlinePassed = () => {
    if (!currentRoundData) return false;
    
    const now = new Date();
    const deadline = new Date(currentRoundData.deadline);
    return now > deadline;
  };
  
  const isRoundLocked = isRoundClosed || isDeadlinePassed();

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

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Kichutes</h1>
          <p className="text-muted-foreground mt-2">
            Registre seus kichutes para cada rodada do campeonato
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <RoundSelector 
              rounds={ROUNDS} 
              currentRound={currentRound} 
              onRoundChange={handleRoundChange} 
            />

            <div className="flex items-center space-x-3">
              <label htmlFor="player-select" className="text-sm font-medium">
                Jogador:
              </label>
              <select
                id="player-select"
                value={currentPlayerId}
                onChange={handlePlayerChange}
                className="form-input min-w-[180px]"
              >
                {PLAYERS.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isRoundLocked && !isRoundClosed && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
            <p className="text-center font-medium">
              Prazo para kichutes encerrado! Os kichutes para esta rodada não podem mais ser editados.
            </p>
          </div>
        )}

        {isRoundLocked && (
          <div className="mb-6">
            <button
              onClick={() => setShowAllGuesses(true)}
              className="w-full py-3 px-4 bg-goal/10 hover:bg-goal/20 text-goal font-medium rounded-lg transition-colors"
            >
              Ver kichutes de todos os jogadores
            </button>
          </div>
        )}

        <div className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          {matches.length > 0 ? (
            <GuessingForm
              matches={matches}
              currentPlayerId={currentPlayerId}
              existingGuesses={GUESSES}
              onSubmit={handleSubmitGuesses}
              roundClosed={isRoundLocked}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground animate-fadeIn">
              Nenhuma partida encontrada para esta rodada.
            </div>
          )}
        </div>
      </div>

      {/* Modal para exibir os kichutes de todos os jogadores */}
      <Dialog open={showAllGuesses} onOpenChange={setShowAllGuesses}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kichutes de Todos os Jogadores - Rodada {currentRound}</DialogTitle>
          </DialogHeader>
          
          <div className="overflow-x-auto">
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
                {matches.map(match => (
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
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Kichutes;
