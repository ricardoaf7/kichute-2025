
import { useParticipants } from "@/hooks/useParticipants";
import { TableRow, TableCell } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useKichutes } from "@/hooks/useKichutes";

interface RoundTotalScoreProps {
  selectedRound: number;
}

const RoundTotalScore = ({ selectedRound }: RoundTotalScoreProps) => {
  const { participants } = useParticipants();
  const { kichutes, isLoading: isLoadingKichutes } = useKichutes(selectedRound);
  const [totaisPorJogador, setTotaisPorJogador] = useState<Record<string, number>>({});

  // Calcular o total de pontos por jogador diretamente a partir dos kichutes
  useEffect(() => {
    if (!isLoadingKichutes) {
      console.log("Calculando totais a partir dos kichutes:", kichutes);
      
      // Inicializar o objeto com todos os jogadores tendo 0 pontos
      const totais: Record<string, number> = {};
      participants.forEach(p => {
        totais[p.id] = 0;
      });
      
      // Somar pontos de cada kichute para o respectivo jogador
      kichutes.forEach(kichute => {
        if (kichute.jogador_id && kichute.pontos !== null && kichute.pontos !== undefined) {
          // Garantir que pontos seja um número
          const pontosNum = Number(kichute.pontos);
          if (!isNaN(pontosNum)) {
            totais[kichute.jogador_id] = (totais[kichute.jogador_id] || 0) + pontosNum;
          }
        }
      });
      
      console.log("Totais calculados diretamente dos kichutes:", totais);
      setTotaisPorJogador(totais);
    }
  }, [kichutes, participants, isLoadingKichutes, selectedRound]);

  if (isLoadingKichutes) {
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

  return (
    <TableRow className="bg-muted/30 font-bold">
      <TableCell colSpan={2} className="text-right">
        Total de Pontos:
      </TableCell>
      {participants.map((participant) => {
        const totalPontos = totaisPorJogador[participant.id] || 0;
        
        return (
          <TableCell key={`total-${participant.id}`} className="text-center">
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
