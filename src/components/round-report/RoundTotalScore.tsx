
import { useParticipants } from "@/hooks/useParticipants";
import { usePontuacaoRodada } from "@/hooks/usePontuacaoRodada";
import { TableRow, TableCell } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useKichutes } from "@/hooks/useKichutes";

interface RoundTotalScoreProps {
  selectedRound: number;
}

const RoundTotalScore = ({ selectedRound }: RoundTotalScoreProps) => {
  const { participants } = useParticipants();
  const { pontuacoes, isLoading } = usePontuacaoRodada(selectedRound);
  const { kichutes } = useKichutes(selectedRound);
  const [totaisPorJogador, setTotaisPorJogador] = useState<Record<string, number>>({});

  // Calcular o total de pontos por jogador a partir dos kichutes
  useEffect(() => {
    if (!isLoading) {
      const totais: Record<string, number> = {};
      
      // Inicializar todos os participantes com 0 pontos
      participants.forEach(p => {
        totais[p.id] = 0;
      });
      
      // Debug para verificar os kichutes carregados
      console.log("Kichutes para cálculo:", kichutes);
      
      // Somar os pontos de cada kichute para cada jogador
      kichutes.forEach(kichute => {
        if (kichute.jogador_id && typeof kichute.pontos === 'number') {
          totais[kichute.jogador_id] = (totais[kichute.jogador_id] || 0) + kichute.pontos;
        }
      });
      
      // Se temos pontuações da tabela pontuacao_rodada, usar esses valores
      console.log("Pontuações da rodada:", pontuacoes);
      if (pontuacoes && pontuacoes.length > 0) {
        pontuacoes.forEach(pontuacao => {
          if (pontuacao.jogador && pontuacao.jogador.id) {
            totais[pontuacao.jogador.id] = pontuacao.pontos;
          }
        });
      }
      
      console.log("Totais calculados:", totais);
      setTotaisPorJogador(totais);
    }
  }, [pontuacoes, kichutes, participants, isLoading]);

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

  return (
    <TableRow className="bg-muted/30 font-bold">
      <TableCell colSpan={2} className="text-right">
        Total de Pontos:
      </TableCell>
      {participants.map((participant) => {
        const totalPontos = totaisPorJogador[participant.id] || 0;
        
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
