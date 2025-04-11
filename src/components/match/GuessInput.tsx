
import { calculatePoints, getPointsBadgeClass, getScoringDescription } from "@/utils/scoring";
import { Guess, Match } from "@/types";

interface GuessInputProps {
  match: Match;
  userGuess?: Guess;
  editable: boolean;
  homeGuess: number;
  awayGuess: number;
  onHomeScoreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAwayScoreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GuessInput = ({
  match,
  userGuess,
  editable,
  homeGuess,
  awayGuess,
  onHomeScoreChange,
  onAwayScoreChange
}: GuessInputProps) => {
  const getPoints = () => {
    if (!match.played || !userGuess) return null;
    return calculatePoints(
      { homeScore: userGuess.homeScore, awayScore: userGuess.awayScore },
      { homeScore: match.homeScore, awayScore: match.awayScore }
    );
  };

  const points = getPoints();

  return (
    <div className="border-t pt-3 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Seu kichute:</span>
        {points !== null && (
          <span className={getPointsBadgeClass(points)}>{points} pts</span>
        )}
      </div>

      <div className="flex items-center justify-center mt-2 space-x-3">
        {editable ? (
          <>
            <input
              type="number"
              min="0"
              value={homeGuess}
              onChange={onHomeScoreChange}
              className="w-12 h-10 form-input text-center"
            />
            <span className="text-muted-foreground">x</span>
            <input
              type="number"
              min="0"
              value={awayGuess}
              onChange={onAwayScoreChange}
              className="w-12 h-10 form-input text-center"
            />
          </>
        ) : userGuess ? (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{userGuess.homeScore}</span>
            <span className="text-muted-foreground">x</span>
            <span className="text-lg font-bold">{userGuess.awayScore}</span>
            {points !== null && (
              <span className="text-sm ml-2 text-muted-foreground">
                ({getScoringDescription(points)})
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
