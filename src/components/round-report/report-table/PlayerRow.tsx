
import { Trophy, Medal, Star } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface PlayerRowProps {
  playerName: string;
  monthlyPoints: Record<string, number>;
  totalPoints: number;
  position: number;
  isMonthly: boolean;
}

export const PlayerRow = ({ playerName, monthlyPoints, totalPoints, position, isMonthly }: PlayerRowProps) => {
  const getPositionIcon = (position: number) => {
    if (position === 0) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (position === 1) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (position === 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {getPositionIcon(position)}
          {playerName}
        </div>
      </TableCell>
      {isMonthly && Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
        <TableCell key={`${playerName}-${month}`} className="text-center">
          {monthlyPoints[month] || 0}
        </TableCell>
      ))}
      <TableCell className="text-center font-bold">
        {totalPoints}
      </TableCell>
    </TableRow>
  );
};
