
import { Team } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Image } from "lucide-react";

interface TeamCardProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              {team.logoUrl ? (
                <img 
                  src={team.logoUrl} 
                  alt={`Escudo do ${team.name}`} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              ) : (
                <Image className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{team.name}</h3>
              <div className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-sm">
                {team.shortName}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
