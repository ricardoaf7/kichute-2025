
import { useState } from "react";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Trash } from "lucide-react";

interface TeamsListProps {
  teams?: Team[];
  onAddNew?: () => void;
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: string) => void;
  onSelectTeam?: (teamId: string) => void;
  onCreateNew?: () => void;
}

export const TeamsList = ({ 
  teams = [], 
  onAddNew, 
  onEdit, 
  onDelete, 
  onSelectTeam, 
  onCreateNew 
}: TeamsListProps) => {
  // Use onCreateNew or onAddNew (for backward compatibility)
  const handleAddNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else if (onAddNew) {
      onAddNew();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Times Cadastrados</CardTitle>
          <Button onClick={handleAddNew} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum time cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onEdit={() => {
                    if (onSelectTeam) {
                      onSelectTeam(team.id);
                    } else if (onEdit) {
                      onEdit(team);
                    }
                  }} 
                  onDelete={() => onDelete && onDelete(team.id)} 
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface TeamCardProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamCard = ({ team, onEdit, onDelete }: TeamCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{team.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="bg-muted px-2 py-0.5 rounded-md">{team.shortName}</span>
            </div>
            {team.homeStadium && (
              <p className="text-sm">
                <span className="font-medium">Estádio:</span> {team.homeStadium}
              </p>
            )}
            {team.city && (
              <p className="text-sm">
                <span className="font-medium">Cidade:</span> {team.city}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
