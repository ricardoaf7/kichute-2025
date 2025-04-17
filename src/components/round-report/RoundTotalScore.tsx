
import { useParticipants } from "@/hooks/useParticipants";
import { usePontuacaoRodada } from "@/hooks/usePontuacaoRodada";
import { TableRow, TableCell } from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface RoundTotalScoreProps {
  selectedRound: number;
}

const RoundTotalScore = ({ selectedRound }: RoundTotalScoreProps) => {
  const { participants } = useParticipants();
  const { pontuacoes, isLoading } = usePontuacaoRodada(selectedRound);

  if (isLoading) {
    return (
      <TableRow className="bg-muted/30 font-bold">
        <TableCell colSpan={2} className="text-right">
          Total de Pontos:
        </TableCell>
        {participants.map((participant) => (
          <TableCell key={participant.id} className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <span>...</span>
            </div>
          </TableCell>
        ))}
      </TableRow>
    );
  }

  // Função para obter a pontuação de um jogador
  const getPontuacaoJogador = (jogadorId: string) => {
    const pontuacao = pontuacoes.find(p => p.jogador.id === jogadorId);
    return pontuacao ? pontuacao.pontos : 0;
  };

  return (
    <TableRow className="bg-muted/30 font-bold">
      <TableCell colSpan={2} className="text-right">
        Total de Pontos:
      </TableCell>
      {participants.map((participant) => {
        const totalPontos = getPontuacaoJogador(participant.id);
        
        return (
          <TableCell key={participant.id} className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>{totalPontos}</span>
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default RoundTotalScore;
