
import { Star, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoringDescription } from "@/utils/scoring";

export type ViewType = 'round' | 'month' | 'annual';

interface KichutePointsProps {
  points: number;
  viewType: ViewType;
  position?: number;
}

export const KichutePoints = ({ points, viewType, position = 0 }: KichutePointsProps) => {
  const getPontosIcon = (points: number, viewType: ViewType, position: number) => {
    if (viewType === 'annual') {
      if (position === 0) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
      if (position === 1) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
      if (position === 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
      return null;
    }
    
    // For round or month view, only show trophy for first place
    if (position === 0) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    return null;
  };

  const getPointsBadgeClass = (points: number, viewType: ViewType, position: number) => {
    if (viewType === 'annual') {
      if (position === 0) return "font-bold text-yellow-600 dark:text-yellow-400";
      if (position === 1) return "font-semibold text-blue-600 dark:text-blue-400";
      if (position === 2) return "font-medium text-green-600 dark:text-green-400";
      return "text-gray-600 dark:text-gray-400";
    }
    
    // For round or month view
    if (position === 0) return "font-bold text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className={cn("flex items-center justify-center space-x-1", 
      getPointsBadgeClass(points, viewType, position))}>
      {getPontosIcon(points, viewType, position)}
      <span>{points}</span>
      {points > 0 && (
        <span className="text-xs ml-1 opacity-75">
          ({getScoringDescription(points).split('!')[0]})
        </span>
      )}
    </div>
  );
};
