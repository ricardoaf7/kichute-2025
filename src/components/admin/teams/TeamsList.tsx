
import { useState, useEffect } from "react";
import { Team } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TeamCard from "./components/TeamCard";
import TeamFormDialog from "./components/TeamFormDialog";
import DeleteTeamDialog from "./components/DeleteTeamDialog";

const TeamsList = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    logoUrl: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('times')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      
      const transformedTeams: Team[] = data.map(team => ({
        id: team.id,
        name: team.nome,
        shortName: team.sigla,
        homeStadium: "",
        city: "",
        logoUrl: team.escudo_url
      }));
      
      setTeams(transformedTeams);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      toast({
        title: "Erro ao carregar times",
        description: "Não foi possível carregar a lista de times.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentTeam(null);
    setFormData({
      name: "",
      shortName: "",
      logoUrl: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logoUrl || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setCurrentTeam(team);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.shortName) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e sigla são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentTeam) {
        const { error } = await supabase
          .from('times')
          .update({
            nome: formData.name,
            sigla: formData.shortName,
            escudo_url: formData.logoUrl
          })
          .eq('id', currentTeam.id);
          
        if (error) throw error;
        
        setTeams(prev => prev.map(team => 
          team.id === currentTeam.id ? 
          { 
            ...team, 
            name: formData.name, 
            shortName: formData.shortName,
            logoUrl: formData.logoUrl
          } : team
        ));
        
        toast({
          title: "Time atualizado",
          description: `${formData.name} foi atualizado com sucesso.`
        });
      } else {
        const { data, error } = await supabase
          .from('times')
          .insert({
            nome: formData.name,
            sigla: formData.shortName,
            escudo_url: formData.logoUrl
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          const newTeam: Team = {
            id: data[0].id,
            name: data[0].nome,
            shortName: data[0].sigla,
            homeStadium: "",
            city: "",
            logoUrl: data[0].escudo_url
          };
          
          setTeams(prev => [...prev, newTeam]);
          
          toast({
            title: "Time criado",
            description: `${formData.name} foi adicionado com sucesso.`
          });
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar time:', error);
      toast({
        title: "Erro ao salvar time",
        description: error.message || "Ocorreu um erro ao salvar o time.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentTeam) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('times')
        .delete()
        .eq('id', currentTeam.id);
        
      if (error) throw error;
      
      setTeams(prev => prev.filter(team => team.id !== currentTeam.id));
      
      toast({
        title: "Time removido",
        description: `${currentTeam.name} foi removido com sucesso.`
      });
    } catch (error: any) {
      console.error('Erro ao remover time:', error);
      toast({
        title: "Erro ao remover time",
        description: error.message || "Ocorreu um erro ao remover o time.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setCurrentTeam(null);
    }
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
        onConfirm={handleConfirmDelete}
        isSubmitting={isSubmitting}
        team={currentTeam}
      />
    </Card>
  );
};

export default TeamsList;
