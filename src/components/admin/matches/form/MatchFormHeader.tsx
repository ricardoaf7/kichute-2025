
import { Match } from "@/types";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useMatches } from "@/contexts/matches";
import { Skeleton } from "@/components/ui/skeleton";

interface MatchFormHeaderProps {
  editingMatch: Match | null;
}

export const MatchFormHeader = ({ editingMatch }: MatchFormHeaderProps) => {
  const { rounds, selectedRound, isLoading } = useMatches();
  
  // Encontrar a rodada selecionada e contar o número de partidas
  const currentRound = rounds.find(round => round.number === selectedRound);
  const matchesInRound = currentRound?.matches.length || 0;
  
  return (
    <CardHeader>
      <CardTitle>{editingMatch ? "Editar Partida" : "Nova Partida"}</CardTitle>
      {isLoading ? (
        <div className="w-48">
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Jogos cadastrados nesta rodada: {matchesInRound} / 10
        </p>
      )}
    </CardHeader>
  );
};
