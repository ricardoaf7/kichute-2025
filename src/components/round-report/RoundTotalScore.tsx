
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
  const [maxScore, setMaxScore] = useState<number>(0);

  useEffect(() => {
    if (!isLoadingKichutes && kichutes && kichutes.length > 0) {
      const totais: Record<string, number> = {};
      participants.forEach(p => {
        totais[p.id] = 0;
      });
      
      kichutes.forEach(kichute => {
        if (kichute.jogador_id) {
          const jogadorId = String(kichute.jogador_id);
          let points = 0;
          if (kichute.pontos !== null && kichute.pontos !== undefined && String(kichute.pontos) !== '') {
            points = typeof kichute.pontos === 'number' 
              ? kichute.pontos 
              : parseInt(String(kichute.pontos), 10) || 0;
          }
          
          if (!totais[jogadorId]) {
            totais[jogadorId] = 0;
          }
          totais[jogadorId] += points;
        }
      });
      
      // Find maximum score
      const maxPoints = Math.max(...Object.values(totais));
      setMaxScore(maxPoints);
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
        const participantId = String(participant.id);
        const totalPontos = totaisPorJogador[participantId] || 0;
        const isTopScorer = totalPontos === maxScore && totalPontos > 0;
        
        return (
          <TableCell key={`total-${participantId}`} className="text-center">
            <div className="flex items-center justify-center space-x-1">
              {isTopScorer && <Trophy className="h-4 w-4 text-yellow-500" />}
              <span>{totalPontos}</span>
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default RoundTotalScore;
