
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePontuacaoRodada } from "@/hooks/usePontuacaoRodada";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoundScoreTableProps {
  selectedRound?: number;
}

const RoundScoreTable = ({ selectedRound }: RoundScoreTableProps) => {
  const { pontuacoes, isLoading } = usePontuacaoRodada(selectedRound);

  // Definir o índice do vencedor (maior pontuação)
  const getWinnerIndexes = (pontuacoes: any[]) => {
    if (!pontuacoes || pontuacoes.length === 0) return [];
    const max = Math.max(...pontuacoes.map((p) => p.pontos));
    return pontuacoes
      .map((p, idx) => (p.pontos === max ? idx : -1))
      .filter(idx => idx !== -1);
  };

  const winnerIndexes = getWinnerIndexes(pontuacoes);

  const getPontosIcon = (idx: number) => {
    // Só o(s) primeiro(s) da rodada recebem a taça
    if (winnerIndexes.includes(idx)) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    return null;
  };

  const getPontosClass = (idx: number) => {
    if (winnerIndexes.includes(idx)) return "text-yellow-600 dark:text-yellow-400 font-bold";
    return "text-gray-600 dark:text-gray-400";
  };

  if (isLoading) {
    return <div className="text-center p-4">Carregando pontuações...</div>;
  }

  if (!pontuacoes.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Nenhuma pontuação encontrada para esta rodada.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24 text-center">Rodada</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead className="text-center">Pontos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pontuacoes.map((pontuacao, idx) => (
            <TableRow key={pontuacao.id}>
              <TableCell className="text-center">{pontuacao.rodada}</TableCell>
              <TableCell>{pontuacao.jogador.nome}</TableCell>
              <TableCell className={cn("text-center font-medium", getPontosClass(idx))}>
                {getPontosIcon(idx)}
                {pontuacao.pontos}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoundScoreTable;
