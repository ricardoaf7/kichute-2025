
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePontuacaoRodada } from "@/hooks/usePontuacaoRodada";
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoundScoreTableProps {
  selectedRound?: number;
}

const RoundScoreTable = ({ selectedRound }: RoundScoreTableProps) => {
  const { pontuacoes, isLoading } = usePontuacaoRodada(selectedRound);

  const getPontosIcon = (pontos: number) => {
    if (pontos >= 7) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (pontos >= 4) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (pontos >= 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  const getPontosClass = (pontos: number) => {
    if (pontos >= 7) return "text-yellow-600 dark:text-yellow-400";
    if (pontos >= 4) return "text-blue-600 dark:text-blue-400";
    if (pontos >= 2) return "text-green-600 dark:text-green-400";
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
          {pontuacoes.map((pontuacao) => (
            <TableRow key={pontuacao.id}>
              <TableCell className="text-center">{pontuacao.rodada}</TableCell>
              <TableCell>{pontuacao.jogador.nome}</TableCell>
              <TableCell className={cn("text-center font-medium", getPontosClass(pontuacao.pontos))}>
                {getPontosIcon(pontuacao.pontos)}
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
