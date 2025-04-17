
import { Team } from "@/types";
import { getTeamImagePath } from "@/utils/teamImages";

interface TeamDisplayProps {
  team: Team;
  alignment: 'left' | 'right';
}

export const TeamDisplay = ({ team, alignment }: TeamDisplayProps) => {
  const isLeft = alignment === 'left';
  
  return (
    <div className={`flex flex-1 items-center ${isLeft ? '' : 'justify-end'}`}>
      {isLeft && (
        <div className="mr-2 flex items-center justify-center">
          <img
            src={getTeamImagePath(team.name)}
            alt={`Escudo do ${team.name}`}
            className="w-8 h-8 object-contain rounded-full border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
      
      <div className={`text-${isLeft ? 'right' : 'left'} ${isLeft ? '' : 'mr-2'}`}>
        <p className="font-semibold">{team.name}</p>
        <p className="text-sm text-muted-foreground">{team.shortName}</p>
      </div>
      
      {!isLeft && (
        <div className="ml-2 flex items-center justify-center">
          <img
            src={getTeamImagePath(team.name)}
            alt={`Escudo do ${team.name}`}
            className="w-8 h-8 object-contain rounded-full border border-gray-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      )}
    </div>
  );
};
