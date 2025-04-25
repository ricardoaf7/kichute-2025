
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PointsDisplayProps {
  points: number;
}

export const PointsDisplay = ({ points }: PointsDisplayProps) => {
  const getPositionIcon = (points: number) => {
    if (points === 7) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (points === 4) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (points === 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  const getPointsColorClass = (points: number) => {
    if (points === 7) return "text-green-600 font-bold";
    if (points === 4) return "text-blue-600 font-bold";
    if (points === 2) return "text-yellow-600 font-bold";
    return "text-red-500";
  };

  return (
    <span className={cn(getPointsColorClass(points))}>
      {getPositionIcon(points)}
      {points}pts
    </span>
  );
};
