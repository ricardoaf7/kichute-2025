
import { Card, CardContent } from "@/components/ui/card";
import { MatchHeader } from "./MatchHeader";
import { ScoreInput } from "./ScoreInput";

interface MatchGuessCardProps {
  match: {
    id: string;
    rodada: number;
    data: string;
    local: string;
    time_casa: { nome: string } | null;
    time_visitante: { nome: string } | null;
  };
  homeScore: number;
  awayScore: number;
  onScoreChange: (
    matchId: string,
    type: "home" | "away",
    value: number
  ) => void;
  isDisabled?: boolean;
}

export const MatchGuessCard = ({
  match,
  homeScore,
  awayScore,
  onScoreChange,
  isDisabled = false,
}: MatchGuessCardProps) => {
  const handleScoreChange = (type: "home" | "away", value: number) => {
    onScoreChange(match.id, type, value);
  };

  // Fallback para nomes de times caso estejam ausentes
  const homeTeamName = match.time_casa?.nome || "Time da Casa";
  const awayTeamName = match.time_visitante?.nome || "Time Visitante";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <MatchHeader round={match.rodada} date={match.data} />

          <div className="flex items-center justify-between">
            <ScoreInput
              teamName={homeTeamName}
              score={homeScore}
              onChange={(value) => handleScoreChange("home", value)}
              isDisabled={isDisabled}
            />

            <div className="flex-shrink-0 text-center w-1/5">
              <span className="text-xl font-bold">X</span>
            </div>

            <ScoreInput
              teamName={awayTeamName}
              score={awayScore}
              onChange={(value) => handleScoreChange("away", value)}
              isDisabled={isDisabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
