
import { TableCell, TableRow } from "@/components/ui/table";
import { KichutePoints } from "@/components/kichutes/KichutePoints";

interface PlayerRowProps {
  playerName: string;
  monthlyPoints: Record<string, number>;
  totalPoints: number;
  position: number;
  isMonthly: boolean;
}

export const PlayerRow = ({ 
  playerName, 
  monthlyPoints, 
  totalPoints, 
  position, 
  isMonthly 
}: PlayerRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center">
          {playerName}
        </div>
      </TableCell>
      {isMonthly && Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
        <TableCell key={`${playerName}-${month}`} className="text-center">
          <KichutePoints 
            points={monthlyPoints[month] || 0}
            viewType="month"
            position={monthlyPoints[month] ? position : -1}
          />
        </TableCell>
      ))}
      <TableCell className="text-center">
        <KichutePoints 
          points={totalPoints}
          viewType={isMonthly ? "month" : "annual"}
          position={position}
        />
      </TableCell>
    </TableRow>
  );
};
