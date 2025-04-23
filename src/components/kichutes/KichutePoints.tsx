
import { Star, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoringDescription } from "@/utils/scoring";

interface KichutePointsProps {
  points: number;
  isAnnual?: boolean;
  position?: number;
}

export const KichutePoints = ({ points, isAnnual = false, position = 0 }: KichutePointsProps) => {
  const getPontosIcon = (pontos: number, isAnnual: boolean, position: number) => {
    // Para exibição anual, usa posição para definir ícone
    if (isAnnual) {
      if (position === 1) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
      if (position === 2) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
      if (position === 3) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
      return null;
    }
    
    // Para exibição de rodada/mês, só o primeiro ganha troféu
    if (position === 1) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    return null;
  };

  const getPointsBadgeClass = (pontos: number, isAnnual: boolean, position: number) => {
    if (isAnnual) {
      if (position === 1) return "font-bold text-yellow-600 dark:text-yellow-400";
      if (position === 2) return "font-semibold text-blue-600 dark:text-blue-400";
      if (position === 3) return "font-medium text-green-600 dark:text-green-400";
      return "text-gray-600 dark:text-gray-400";
    }
    
    // Para rodada/mês
    if (position === 1) return "font-bold text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className={cn("flex items-center justify-center space-x-1", 
      getPointsBadgeClass(points, isAnnual, position))}>
      {getPontosIcon(points, isAnnual, position)}
      <span>{points}</span>
      {points > 0 && (
        <span className="text-xs ml-1 opacity-75">
          ({getScoringDescription(points).split('!')[0]})
        </span>
      )}
    </div>
  );
};
