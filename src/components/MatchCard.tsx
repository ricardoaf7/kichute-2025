
import { Match, Guess } from "../types";
import { TeamDisplay } from "./match/TeamDisplay";
import { ResultForm } from "./matches/ResultForm";
import { StadiumInfo } from "./match/StadiumInfo";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  showResultForm?: boolean;
  onResultSaved?: () => void;
  // Add the missing properties from GuessingForm
  userGuess?: Guess;
  editable?: boolean;
  onGuessChange?: (homeScore: number, awayScore: number) => void;
  className?: string;
}

const MatchCard = ({
  match,
  showResultForm = false,
  onResultSaved = () => {},
  // Add the missing properties with default values
  userGuess,
  editable = false,
  onGuessChange,
  className,
}: MatchCardProps) => {
  const isMatchPlayed = match.played && match.homeScore !== null && match.awayScore !== null;
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Handle guess changes if onGuessChange is provided
  const handleHomeScoreChange = (value: number) => {
    if (onGuessChange && editable) {
      onGuessChange(value, userGuess?.awayScore || 0);
    }
  };

  const handleAwayScoreChange = (value: number) => {
    if (onGuessChange && editable) {
      onGuessChange(userGuess?.homeScore || 0, value);
    }
  };

  return (
    <div className={cn("gradient-border card-transition", className)}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rodada {match.round}</span>
          <span>{formattedDate}</span>
        </div>

        <StadiumInfo match={match} />

        <div className="flex items-center justify-between">
          <TeamDisplay team={match.homeTeam} alignment="left" />

          {!showResultForm && !onGuessChange && (
            <div className="flex items-center space-x-4 px-4">
              {isMatchPlayed ? (
                <span className="text-2xl font-bold">
                  {match.homeScore} x {match.awayScore}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Aguardando</span>
              )}
            </div>
          )}

          {/* Show guessing inputs if onGuessChange is provided */}
          {onGuessChange && (
            <div className="flex items-center gap-2 px-2">
              <input
                type="number"
                min="0"
                max="20"
                value={userGuess?.homeScore ?? 0}
                onChange={(e) => handleHomeScoreChange(parseInt(e.target.value) || 0)}
                disabled={!editable}
                className="w-12 text-center border rounded p-1"
              />
              <span className="text-sm font-medium">x</span>
              <input
                type="number"
                min="0"
                max="20"
                value={userGuess?.awayScore ?? 0}
                onChange={(e) => handleAwayScoreChange(parseInt(e.target.value) || 0)}
                disabled={!editable}
                className="w-12 text-center border rounded p-1"
              />
            </div>
          )}

          <TeamDisplay team={match.awayTeam} alignment="right" />
        </div>

        {showResultForm && (
          <ResultForm match={match} onResultSaved={onResultSaved} />
        )}
      </div>
    </div>
  );
};

export default MatchCard;
