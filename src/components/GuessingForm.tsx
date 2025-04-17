
import { useState, useEffect } from "react";
import { Match, Guess, Player } from "../types";
import MatchCard from "./MatchCard";

interface GuessingFormProps {
  matches?: Match[];
  currentPlayerId?: string;
  existingGuesses?: Guess[];
  onSubmit?: (guesses: Omit<Guess, "id" | "points">[]) => void;
  roundClosed?: boolean;
  onSubmitSuccess?: () => void;
}

const GuessingForm = ({
  matches = [],
  currentPlayerId = "",
  existingGuesses = [],
  onSubmit,
  roundClosed = false,
  onSubmitSuccess,
}: GuessingFormProps) => {
  const [guesses, setGuesses] = useState<{ [key: string]: { homeScore: number; awayScore: number } }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Initialize form with existing guesses
    const initialGuesses: { [key: string]: { homeScore: number; awayScore: number } } = {};
    existingGuesses.forEach((guess) => {
      if (guess.playerId === currentPlayerId) {
        initialGuesses[guess.matchId] = {
          homeScore: guess.homeScore,
          awayScore: guess.awayScore,
        };
      }
    });

    setGuesses(initialGuesses);
  }, [existingGuesses, currentPlayerId]);

  useEffect(() => {
    // Check if all matches have guesses
    const allMatchesHaveGuesses = matches.every(
      (match) => guesses[match.id] !== undefined
    );
    setIsFormValid(allMatchesHaveGuesses);
  }, [guesses, matches]);

  const handleGuessChange = (matchId: string, homeScore: number, awayScore: number) => {
    setGuesses((prevGuesses) => ({
      ...prevGuesses,
      [matchId]: { homeScore, awayScore },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedGuesses = matches.map((match) => ({
      matchId: match.id,
      playerId: currentPlayerId,
      homeScore: guesses[match.id]?.homeScore || 0,
      awayScore: guesses[match.id]?.awayScore || 0,
    }));

    if (onSubmit) {
      onSubmit(submittedGuesses);
    }
    
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  const findGuessForMatch = (matchId: string): Guess | undefined => {
    return existingGuesses.find(
      (g) => g.matchId === matchId && g.playerId === currentPlayerId
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((match, index) => (
          <MatchCard
            key={match.id}
            match={match}
            userGuess={findGuessForMatch(match.id)}
            editable={!roundClosed}
            onGuessChange={(home, away) => handleGuessChange(match.id, home, away)}
            className="animate-slide-up"
          />
        ))}
      </div>

      {!roundClosed && (
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-8 py-3 rounded-md font-medium transition-all duration-200 ${
              isFormValid
                ? "bg-goal text-white hover:bg-goal-dark shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Salvar Kichutes
          </button>
        </div>
      )}

      {roundClosed && (
        <div className="text-center mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-yellow-700 dark:text-yellow-300">
            Kichutes encerrados para esta rodada.
          </p>
        </div>
      )}
    </form>
  );
};

export default GuessingForm;
