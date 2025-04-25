
import { TableCell, TableRow } from "@/components/ui/table";

interface RoundHeaderProps {
  roundNumber: number;
  participantPoints: Record<string, number>;
  participants: { id: string; nome: string }[];
}

export const RoundHeader = ({ roundNumber, participantPoints, participants }: RoundHeaderProps) => {
  return (
    <TableRow className="bg-muted/30">
      <TableCell 
        colSpan={2} 
        className="font-bold py-1 print:py-0"
      >
        Rodada {roundNumber}
      </TableCell>
      {participants.map(participant => (
        <TableCell 
          key={`total-${roundNumber}-${participant.id}`}
          className="py-1 print:py-0 text-center font-bold"
        >
          {participantPoints[participant.id] || 0} pts
        </TableCell>
      ))}
    </TableRow>
  );
};
