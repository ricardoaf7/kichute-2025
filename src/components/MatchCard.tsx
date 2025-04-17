
import { Match } from "../types";
import { TeamDisplay } from "./match/TeamDisplay";
import { ResultForm } from "./matches/ResultForm";
import { StadiumInfo } from "./match/StadiumInfo";

interface MatchCardProps {
  match: Match;
  showResultForm?: boolean;
  onResultSaved?: () => void;
}

const MatchCard = ({
  match,
  showResultForm = false,
  onResultSaved = () => {},
}: MatchCardProps) => {
  const isMatchPlayed = match.played && match.homeScore !== null && match.awayScore !== null;
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="gradient-border card-transition">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rodada {match.round}</span>
          <span>{formattedDate}</span>
        </div>

        <StadiumInfo match={match} />

        <div className="flex items-center justify-between">
          <TeamDisplay team={match.homeTeam} alignment="left" />

          {!showResultForm && (
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
