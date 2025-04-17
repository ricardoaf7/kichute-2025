
import { MatchGuessCard } from "./MatchGuessCard";

interface MatchesGridProps {
  matches: Array<{
    id: string;
    rodada: number;
    data: string;
    local: string;
    time_casa: { nome: string };
    time_visitante: { nome: string };
  }>;
  guesses: Array<{
    matchId: string;
    homeScore: number;
    awayScore: number;
  }>;
  onGuessChange: (matchId: string, type: 'home' | 'away', value: number) => void;
  isDisabled: boolean;
}

export const MatchesGrid = ({ matches, guesses, onGuessChange, isDisabled }: MatchesGridProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50">
        Nenhuma partida encontrada para esta rodada.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {matches.map((match) => {
        const guess = guesses.find(g => g.matchId === match.id);
        return (
          <MatchGuessCard
            key={match.id}
            match={match}
            homeScore={guess?.homeScore || 0}
            awayScore={guess?.awayScore || 0}
            onScoreChange={onGuessChange}
            isDisabled={isDisabled}
          />
        );
      })}
    </div>
  );
};
