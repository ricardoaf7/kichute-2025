
import { TableCell, TableRow } from "@/components/ui/table";
import { MatchScore } from "./MatchScore";
import { GuessScore } from "./GuessScore";

interface MatchRowProps {
  match: {
    id: string;
    time_casa: { nome: string; sigla: string };
    time_visitante: { nome: string; sigla: string };
    placar_casa?: number;
    placar_visitante?: number;
  };
  participants: { id: string; nome: string }[];
  kichutes: any[];
}

export const MatchRow = ({ match, participants, kichutes }: MatchRowProps) => {
  const getKichute = (participantId: string, matchId: string) => {
    return kichutes.find(
      (k) => k.jogador_id === participantId && k.partida_id === matchId
    );
  };

  return (
    <TableRow className="border-t border-border/30">
      <TableCell className="p-2 print:p-1 whitespace-nowrap">
        <div className="flex flex-col">
          <span>{match.time_casa.nome}</span>
          <span>x</span>
          <span>{match.time_visitante.nome}</span>
        </div>
      </TableCell>
      <TableCell className="p-2 print:p-1 text-center">
        <MatchScore 
          homeScore={match.placar_casa} 
          awayScore={match.placar_visitante} 
        />
      </TableCell>
      {participants.map((participant) => {
        const kichute = getKichute(participant.id, match.id);
        return (
          <TableCell 
            key={`${match.id}-${participant.id}`} 
            className="p-2 print:p-1 text-center"
          >
            <GuessScore
              homeGuess={kichute?.palpite_casa}
              awayGuess={kichute?.palpite_visitante}
              points={kichute?.pontos || 0}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
