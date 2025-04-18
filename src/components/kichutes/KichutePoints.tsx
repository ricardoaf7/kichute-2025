
import { Star, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface KichutePointsProps {
  points: number;
}

export const KichutePoints = ({ points }: KichutePointsProps) => {
  const getPontosIcon = (pontos: number) => {
    if (pontos >= 7) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (pontos >= 4) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (pontos >= 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  const getPointsBadgeClass = (pontos: number) => {
    if (pontos >= 7) return "font-bold text-yellow-600 dark:text-yellow-400";
    if (pontos >= 4) return "font-semibold text-blue-600 dark:text-blue-400";
    if (pontos >= 2) return "font-medium text-green-600 dark:text-green-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className={cn("flex items-center justify-center space-x-1", getPointsBadgeClass(points))}>
      {getPontosIcon(points)}
      <span>{points}</span>
    </div>
  );
};

