
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Team } from "../types";
import { TEAMS } from "../utils/mockData";
import { TeamForm, TeamFormValues } from "@/components/admin/teams/TeamForm";
import { TeamsList } from "@/components/admin/teams/TeamsList";

const AdminTeams = () => {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { toast } = useToast();

  const handleAddNewTeam = () => {
    setEditingTeam(null);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Tem certeza que deseja excluir este time?")) {
      setTeams(prev => prev.filter(team => team.id !== teamId));
      
      toast({
        title: "Time excluído",
        description: "O time foi removido com sucesso."
      });
    }
  };

  const handleFormSubmit = (values: TeamFormValues) => {
    if (editingTeam) {
      // Editar time existente
      setTeams(prev => 
        prev.map(team => 
          team.id === editingTeam.id
            ? { 
                ...team, 
                name: values.name,
                shortName: values.shortName,
                homeStadium: values.homeStadium,
                city: values.city
              }
            : team
        )
      );

      toast({
        title: "Time atualizado",
        description: "O time foi atualizado com sucesso."
      });
    } else {
      // Adicionar novo time
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: values.name,
        shortName: values.shortName,
        homeStadium: values.homeStadium,
        city: values.city,
      };

      setTeams(prev => [...prev, newTeam]);

      toast({
        title: "Time adicionado",
        description: "O time foi adicionado com sucesso."
      });
    }

    setEditingTeam(null);
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Cadastro de Times</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os times participantes do Brasileirão 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TeamForm 
              editingTeam={editingTeam} 
              onSubmit={handleFormSubmit} 
              onCancel={() => setEditingTeam(null)}
            />
          </div>

          <div className="lg:col-span-2">
            <TeamsList 
              teams={teams} 
              onAddNew={handleAddNewTeam}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeams;
