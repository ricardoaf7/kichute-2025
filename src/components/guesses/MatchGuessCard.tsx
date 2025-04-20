
import { Card, CardContent } from "@/components/ui/card";
import { MatchHeader } from "./MatchHeader";
import { ScoreInput } from "./ScoreInput";
import { getTeamImagePath } from "@/utils/teamImages";

interface MatchGuessCardProps {
  match: {
    id: string;
    rodada: number;
    data: string;
    local: string;
    time_casa: { id?: string; nome: string; sigla?: string; escudo_url?: string } | null;
    time_visitante: { id?: string; nome: string; sigla?: string; escudo_url?: string } | null;
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

  // Obter caminhos para os escudos
  const homeTeamShield = match.time_casa?.escudo_url || getTeamImagePath(homeTeamName);
  const awayTeamShield = match.time_visitante?.escudo_url || getTeamImagePath(awayTeamName);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <MatchHeader round={match.rodada} date={match.data} />

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <img
                src={homeTeamShield}
                alt={`Escudo do ${homeTeamName}`}
                className="w-8 h-8 object-contain mb-2"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <ScoreInput
                teamName={homeTeamName}
                score={homeScore}
                onChange={(value) => handleScoreChange("home", value)}
                isDisabled={isDisabled}
              />
            </div>

            <div className="flex-shrink-0 text-center w-1/5">
              <span className="text-xl font-bold">X</span>
            </div>

            <div className="flex flex-col items-center">
              <img
                src={awayTeamShield}
                alt={`Escudo do ${awayTeamName}`}
                className="w-8 h-8 object-contain mb-2"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <ScoreInput
                teamName={awayTeamName}
                score={awayScore}
                onChange={(value) => handleScoreChange("away", value)}
                isDisabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
