
import { Card, CardContent } from "@/components/ui/card";
import { MatchHeader } from "./MatchHeader";
import { ScoreInput } from "./ScoreInput";
import { formatDate } from "@/utils/dateFormatter";

interface MatchGuessCardProps {
  match: {
    id: string;
    rodada: number;
    data: string;
    local: string;
    time_casa: { nome: string };
    time_visitante: { nome: string };
  };
  homeScore: number;
  awayScore: number;
  onScoreChange: (matchId: string, type: 'home' | 'away', value: number) => void;
  isDisabled?: boolean;
}

export const MatchGuessCard = ({ 
  match, 
  homeScore, 
  awayScore, 
  onScoreChange,
  isDisabled = false 
}: MatchGuessCardProps) => {
  const handleScoreChange = (type: 'home' | 'away', value: string) => {
    // Converter para número e limitar entre 0 e 20
    const numValue = parseInt(value);
    const validValue = isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), 20);
    onScoreChange(match.id, type, validValue);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <MatchHeader round={match.rodada} date={match.data} />
          
          <div className="flex items-center justify-between">
            <ScoreInput
              teamName={match.time_casa.nome}
              score={homeScore}
              onChange={(value) => handleScoreChange('home', value)}
              isDisabled={isDisabled}
            />
            
            <div className="flex-shrink-0 text-center w-1/5">
              <span className="text-xl font-bold">X</span>
            </div>
            
            <ScoreInput
              teamName={match.time_visitante.nome}
              score={awayScore}
              onChange={(value) => handleScoreChange('away', value)}
              isDisabled={isDisabled}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
