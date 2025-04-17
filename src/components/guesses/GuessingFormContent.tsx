
import { LoadingMatches } from "./LoadingMatches";
import { MatchesGrid } from "./MatchesGrid";
import { FormControls } from "./FormControls";

interface GuessingFormContentProps {
  isLoading: boolean;
  matches: any[];
  guesses: Array<{
    matchId: string;
    homeScore: number;
    awayScore: number;
  }>;
  isSaving: boolean;
  isRoundClosed: boolean;
  selectedParticipant: string;
  onGuessChange: (matchId: string, type: 'home' | 'away', value: number) => void;
  onSubmit: () => void;
}

export const GuessingFormContent = ({
  isLoading,
  matches,
  guesses,
  isSaving,
  isRoundClosed,
  selectedParticipant,
  onGuessChange,
  onSubmit
}: GuessingFormContentProps) => {
  if (isLoading) {
    return <LoadingMatches />;
  }

  return (
    <div className="space-y-6">
      <MatchesGrid 
        matches={matches} 
        guesses={guesses} 
        onGuessChange={onGuessChange} 
        isDisabled={isSaving || isRoundClosed} 
      />
      
      {!isRoundClosed && (
        <FormControls 
          onSubmit={onSubmit} 
          isSaving={isSaving} 
          hasMatches={guesses.length > 0}
          isValid={guesses.length > 0 && selectedParticipant !== ""} 
        />
      )}
      
      {isRoundClosed && (
        <div className="p-4 text-center bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
          <p className="text-yellow-700 dark:text-yellow-300">
            Kichutes encerrados para esta rodada.
          </p>
        </div>
      )}
    </div>
  );
};
