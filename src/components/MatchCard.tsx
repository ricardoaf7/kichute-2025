
import { useState } from "react";
import { Match, Guess } from "../types";
import { calculatePoints, getPointsBadgeClass, getScoringDescription } from "../utils/scoring";

interface MatchCardProps {
  match: Match;
  userGuess?: Guess;
  onGuessChange?: (homeScore: number, awayScore: number) => void;
  editable?: boolean;
  className?: string;
}

const MatchCard = ({
  match,
  userGuess,
  onGuessChange,
  editable = false,
  className = "",
}: MatchCardProps) => {
  const [homeGuess, setHomeGuess] = useState<number>(userGuess?.homeScore || 0);
  const [awayGuess, setAwayGuess] = useState<number>(userGuess?.awayScore || 0);

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setHomeGuess(value);
    if (onGuessChange) {
      onGuessChange(value, awayGuess);
    }
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setAwayGuess(value);
    if (onGuessChange) {
      onGuessChange(homeGuess, value);
    }
  };

  const getPoints = () => {
    if (!match.played || !userGuess) return null;

    return calculatePoints(
      { homeScore: userGuess.homeScore, awayScore: userGuess.awayScore },
      { homeScore: match.homeScore, awayScore: match.awayScore }
    );
  };

  const points = getPoints();
  const isMatchPlayed = match.played && match.homeScore !== null && match.awayScore !== null;
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`gradient-border card-transition ${className}`}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rodada {match.round}</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center">
            <div className="text-right">
              <p className="font-semibold">{match.homeTeam.name}</p>
              <p className="text-sm text-muted-foreground">{match.homeTeam.shortName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 px-4">
            {isMatchPlayed ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{match.homeScore}</span>
                <span className="text-muted-foreground">x</span>
                <span className="text-lg font-bold">{match.awayScore}</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
                Aguardando
              </div>
            )}
          </div>

          <div className="flex flex-1 items-center">
            <div className="text-left">
              <p className="font-semibold">{match.awayTeam.name}</p>
              <p className="text-sm text-muted-foreground">{match.awayTeam.shortName}</p>
            </div>
          </div>
        </div>

        {(userGuess || editable) && (
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Seu palpite:</span>
              {points !== null && (
                <span className={getPointsBadgeClass(points)}>
                  {points} pts
                </span>
              )}
            </div>

            <div className="flex items-center justify-center mt-2 space-x-3">
              {editable ? (
                <>
                  <input
                    type="number"
                    min="0"
                    value={homeGuess}
                    onChange={handleHomeScoreChange}
                    className="w-12 h-10 form-input text-center"
                  />
                  <span className="text-muted-foreground">x</span>
                  <input
                    type="number"
                    min="0"
                    value={awayGuess}
                    onChange={handleAwayScoreChange}
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
        )}
      </div>
    </div>
  );
};

export default MatchCard;
