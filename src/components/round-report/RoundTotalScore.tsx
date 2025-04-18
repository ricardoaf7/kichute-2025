
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

  useEffect(() => {
    if (!isLoadingKichutes && kichutes.length > 0) {
      // Inicializar totais com 0 para cada participante
      const totais: Record<string, number> = {};
      participants.forEach(p => {
        totais[p.id] = 0;
      });

      // Para cada kichute, somar os pontos ao total do jogador
      kichutes.forEach(kichute => {
        if (kichute.jogador_id) {
          // Usamos diretamente o campo pontos do kichute
          const points = Number(kichute.pontos || 0);
          totais[kichute.jogador_id] += points;
        }
      });

      console.log("Totais calculados por jogador:", totais);
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
