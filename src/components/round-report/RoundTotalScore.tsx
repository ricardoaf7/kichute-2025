
import { usePontuacaoRodada } from "@/hooks/usePontuacaoRodada";
import { TableRow, TableCell } from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface RoundTotalScoreProps {
  selectedRound: number;
}

const RoundTotalScore = ({ selectedRound }: RoundTotalScoreProps) => {
  const { pontuacoes } = usePontuacaoRodada(selectedRound);

  return (
    <TableRow className="bg-muted/30 font-bold">
      <TableCell colSpan={2} className="text-right">
        Total de Pontos:
      </TableCell>
      {pontuacoes.map((pontuacao) => (
        <TableCell key={pontuacao.jogador.id} className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>{pontuacao.pontos}</span>
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default RoundTotalScore;
