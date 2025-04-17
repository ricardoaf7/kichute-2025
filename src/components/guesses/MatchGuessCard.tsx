
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return 'Data inválida';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rodada {match.rodada}</span>
            <span>{formatDate(match.data)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center space-y-2 w-2/5">
              <span className="font-semibold text-center">{match.time_casa.nome}</span>
              <Input
                type="number"
                min="0"
                className="w-16 text-center"
                value={homeScore}
                onChange={(e) => onScoreChange(match.id, 'home', parseInt(e.target.value) || 0)}
                disabled={isDisabled}
              />
            </div>
            
            <div className="flex-shrink-0 text-center w-1/5">
              <span className="text-xl font-bold">X</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2 w-2/5">
              <span className="font-semibold text-center">{match.time_visitante.nome}</span>
              <Input
                type="number"
                min="0"
                className="w-16 text-center"
                value={awayScore}
                onChange={(e) => onScoreChange(match.id, 'away', parseInt(e.target.value) || 0)}
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
