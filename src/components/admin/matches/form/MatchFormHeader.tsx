
import { Match } from "@/types";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface MatchFormHeaderProps {
  editingMatch: Match | null;
  matchesInRound: number;
}

export const MatchFormHeader = ({ editingMatch, matchesInRound }: MatchFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{editingMatch ? "Editar Partida" : "Nova Partida"}</CardTitle>
      <p className="text-sm text-muted-foreground">
        Jogos cadastrados nesta rodada: {matchesInRound} / 10
      </p>
    </CardHeader>
  );
};
