
import { Player } from "../types";

interface PlayerCardProps {
  player: Player;
  position?: number;
  showPayment?: boolean;
  animated?: boolean;
}

const PlayerCard = ({ 
  player, 
  position, 
  showPayment = false,
  animated = true
}: PlayerCardProps) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-subtle overflow-hidden card-transition
      border border-border/40 hover:border-border/80 relative ${animated ? 'animate-slide-up' : ''}`}
      style={animated ? { animationDelay: `${position ? position * 0.05 : 0}s` } : {}}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {position && (
              <div className={`flex items-center justify-center w-8 h-8 rounded-full 
                ${position === 1 ? 'bg-goal/20 text-goal' : 
                  position === 2 ? 'bg-field/20 text-field' : 
                    position === 3 ? 'bg-amber-500/20 text-amber-500' : 
                      'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                <span className="text-sm font-semibold">{position}</span>
              </div>
            )}
            <h3 className="text-lg font-semibold">{player.name}</h3>
          </div>
          <div className="text-xl font-bold text-goal">{player.totalPoints} pts</div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {Object.entries(player.roundPoints).map(([round, points]) => (
            <div key={round} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700">
              R{round}: <span className="font-medium ml-1">{points} pts</span>
            </div>
          ))}
        </div>

        {showPayment && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status:</span>
              {player.paid ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Pago: R$ {player.paidAmount.toFixed(2)}
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Pendente
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
