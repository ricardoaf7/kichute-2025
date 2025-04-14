
import { Team } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Image, Loader2 } from "lucide-react";
import TeamCard from "./components/TeamCard";
import TeamFormDialog from "./components/TeamFormDialog";
import DeleteTeamDialog from "./components/DeleteTeamDialog";
import { useTeams } from "@/hooks/teams/useTeams";
import { useTeamForm } from "@/hooks/teams/useTeamForm";
import { useTeamDelete } from "@/hooks/teams/useTeamDelete";

const TeamsList = () => {
  const { teams, setTeams, isLoading } = useTeams();
  
  const { 
    formData,
    setFormData,
    currentTeam,
    setCurrentTeam,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit
  } = useTeamForm((team: Team) => {
    if (currentTeam) {
      setTeams(prev => prev.map(t => t.id === team.id ? team : t));
    } else {
      setTeams(prev => [...prev, team]);
    }
  });

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    teamToDelete,
    setTeamToDelete,
    isDeleting,
    handleDelete
  } = useTeamDelete((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
  });

  const handleAddNew = () => {
    setCurrentTeam(null);
    setFormData({
      name: "",
      shortName: "",
      logoUrl: "",
      stadium: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logoUrl || "",
      stadium: team.homeStadium || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Times Cadastrados</CardTitle>
          <Button onClick={handleAddNew} className="bg-primary text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Time
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && teams.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Carregando times...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum time cadastrado.</p>
              <Button onClick={handleAddNew} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Time
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onEdit={() => handleEditTeam(team)} 
                  onDelete={() => handleDeleteTeam(team)} 
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <TeamFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        onLogoChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
        isSubmitting={isSubmitting}
        currentTeam={currentTeam}
      />

      <DeleteTeamDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isSubmitting={isDeleting}
        team={teamToDelete}
      />
    </Card>
  );
};

export default TeamsList;
