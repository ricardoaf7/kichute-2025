
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ROUNDS, GUESSES, PLAYERS } from "../utils/mockData";
import RoundSelector from "../components/RoundSelector";
import GuessingForm from "../components/GuessingForm";
import { toast } from "../components/ui/use-toast";
import { Guess } from "../types";

const Guesses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roundParam = searchParams.get("round");
  const [currentRound, setCurrentRound] = useState(roundParam ? parseInt(roundParam) : 1);
  const [currentPlayerId, setCurrentPlayerId] = useState(PLAYERS[0].id); // Default to first player
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
        title: "Palpites salvos com sucesso!",
        description: `Seus palpites para a rodada ${currentRound} foram registrados.`,
        variant: "default",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const currentRoundData = ROUNDS.find(r => r.number === currentRound);
  const matches = currentRoundData?.matches || [];
  const isRoundClosed = currentRoundData?.closed || false;

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Palpites</h1>
          <p className="text-muted-foreground mt-2">
            Registre seus palpites para cada rodada do campeonato
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

        <div className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          {matches.length > 0 ? (
            <GuessingForm
              matches={matches}
              currentPlayerId={currentPlayerId}
              existingGuesses={GUESSES}
              onSubmit={handleSubmitGuesses}
              roundClosed={isRoundClosed}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground animate-fadeIn">
              Nenhuma partida encontrada para esta rodada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guesses;
