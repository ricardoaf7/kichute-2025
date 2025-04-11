
import { useState } from "react";
import { Match, Guess } from "../types";
import { TeamDisplay } from "./match/TeamDisplay";
import { ScoreDisplay } from "./match/ScoreDisplay";
import { GuessInput } from "./match/GuessInput";
import { StadiumInfo } from "./match/StadiumInfo";
import { getTeamImagePath } from "../utils/teamImages";

interface MatchCardProps {
  match: Match;
  userGuess?: Guess;
  onGuessChange?: (homeScore: number, awayScore: number) => void;
  editable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MatchCard = ({
  match,
  userGuess,
  onGuessChange,
  editable = false,
  className = "",
  style,
}: MatchCardProps) => {
  const [homeGuess, setHomeGuess] = useState<number>(userGuess?.homeScore || 0);
  const [awayGuess, setAwayGuess] = useState<number>(userGuess?.awayScore || 0);

  const handleHomeScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setHomeGuess(value);
    if (onGuessChange) onGuessChange(value, awayGuess);
  };

  const handleAwayScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setAwayGuess(value);
    if (onGuessChange) onGuessChange(homeGuess, value);
  };

  const isMatchPlayed = match.played && match.homeScore !== null && match.awayScore !== null;
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`gradient-border card-transition ${className}`} style={style}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rodada {match.round}</span>
          <span>{formattedDate}</span>
        </div>

        <StadiumInfo match={match} />

        <div className="flex items-center justify-between">
          <TeamDisplay 
            team={match.homeTeam} 
            alignment="left" 
            getTeamImagePath={getTeamImagePath} 
          />

          <div className="flex items-center space-x-4 px-4">
            <ScoreDisplay 
              homeScore={match.homeScore} 
              awayScore={match.awayScore} 
              isMatchPlayed={isMatchPlayed} 
            />
          </div>

          <TeamDisplay 
            team={match.awayTeam} 
            alignment="right" 
            getTeamImagePath={getTeamImagePath} 
          />
        </div>

        {(userGuess || editable) && (
          <GuessInput
            match={match}
            userGuess={userGuess}
            editable={editable}
            homeGuess={homeGuess}
            awayGuess={awayGuess}
            onHomeScoreChange={handleHomeScoreChange}
            onAwayScoreChange={handleAwayScoreChange}
          />
        )}
      </div>
    </div>
  );
};

export default MatchCard;
