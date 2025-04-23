
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
  const [topScorerId, setTopScorerId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingKichutes && kichutes && kichutes.length > 0) {
      // Inicializar totais com 0 para cada participante
      const totais: Record<string, number> = {};
      participants.forEach(p => {
        totais[p.id] = 0;
      });
      
      // Para cada kichute, somar os pontos ao total do jogador
      kichutes.forEach(kichute => {
        if (kichute.jogador_id) {
          const jogadorId = String(kichute.jogador_id);
          
          // Converter explicitamente para número
          let points = 0;
          if (kichute.pontos !== null && kichute.pontos !== undefined && String(kichute.pontos) !== '') {
            points = typeof kichute.pontos === 'number' 
              ? kichute.pontos 
              : parseInt(String(kichute.pontos), 10) || 0;
          }
          
          // Atualizar o total do jogador
          if (!totais[jogadorId]) {
            totais[jogadorId] = 0;
          }
          totais[jogadorId] += points;
        }
      });
      
      // Encontrar o jogador com maior pontuação
      let maxPontos = -1;
      let maxJogadorId = null;
      
      Object.entries(totais).forEach(([jogadorId, pontos]) => {
        if (pontos > maxPontos) {
          maxPontos = pontos;
          maxJogadorId = jogadorId;
        }
      });
      
      setTopScorerId(maxJogadorId);
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
        // Converter o ID para string para garantir compatibilidade
        const participantId = String(participant.id);
        const totalPontos = totaisPorJogador[participantId] || 0;
        const isTopScorer = participantId === topScorerId && totalPontos > 0;
        
        return (
          <TableCell key={`total-${participantId}`} className="text-center">
            <div className="flex items-center justify-center space-x-1">
              {isTopScorer && <Trophy className="h-4 w-4 text-amber-500" />}
              <span>{totalPontos}</span>
            </div>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default RoundTotalScore;
