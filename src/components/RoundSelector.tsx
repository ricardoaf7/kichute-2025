
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Round } from "../types";

interface RoundSelectorProps {
  rounds: Round[];
  currentRound: number;
  onRoundChange: (round: number) => void;
}

const RoundSelector = ({ rounds, currentRound, onRoundChange }: RoundSelectorProps) => {
  const maxRound = Math.max(...rounds.map(r => r.number));
  const minRound = Math.min(...rounds.map(r => r.number));

  const handlePrevious = () => {
    if (currentRound > minRound) {
      onRoundChange(currentRound - 1);
    }
  };

  const handleNext = () => {
    if (currentRound < maxRound) {
      onRoundChange(currentRound + 1);
    }
  };

  const isFirstRound = currentRound === minRound;
  const isLastRound = currentRound === maxRound;

  const getCurrentRound = (): Round | undefined => {
    return rounds.find(r => r.number === currentRound);
  };

  const currentRoundData = getCurrentRound();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstRound}
          className={`p-2 rounded-md ${
            isFirstRound
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold">Rodada {currentRound}</h2>
          {currentRoundData && (
            <div className="text-sm text-muted-foreground">
              {currentRoundData.closed 
                ? "Palpites encerrados" 
                : `Prazo: ${new Date(currentRoundData.deadline).toLocaleDateString('pt-BR')}`}
            </div>
          )}
        </div>
        <button
          onClick={handleNext}
          disabled={isLastRound}
          className={`p-2 rounded-md ${
            isLastRound
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center space-x-1 overflow-x-auto py-2">
        {rounds.map((round) => (
          <button
            key={round.number}
            onClick={() => onRoundChange(round.number)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
              round.number === currentRound
                ? "bg-primary text-primary-foreground"
                : round.closed
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
            }`}
          >
            {round.number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoundSelector;
