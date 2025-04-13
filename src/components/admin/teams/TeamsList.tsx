
import { useState, useEffect } from "react";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus, Trash, Image, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TeamsListProps {
  teams?: Team[];
  onAddNew?: () => void;
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: string) => void;
  onSelectTeam?: (teamId: string) => void;
  onCreateNew?: () => void;
}

export const TeamsList = ({ 
  teams: propTeams = [], 
  onAddNew, 
  onEdit, 
  onDelete, 
  onSelectTeam, 
  onCreateNew 
}: TeamsListProps) => {
  const [teams, setTeams] = useState<Team[]>(propTeams);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    homeStadium: "",
    city: "",
    logoUrl: ""
  });
  const { toast } = useToast();

  // Fetch teams from Supabase when component mounts
  useEffect(() => {
    if (propTeams.length === 0) {
      fetchTeams();
    }
  }, [propTeams]);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('times')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match the Team interface
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
      console.error('Error fetching teams:', error);
      toast({
        title: "Erro ao carregar times",
        description: "Não foi possível carregar a lista de times.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use onCreateNew or onAddNew (for backward compatibility)
  const handleAddNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else if (onAddNew) {
      onAddNew();
    } else {
      // Open the dialog for creating a new team
      setCurrentTeam(null);
      setFormData({
        name: "",
        shortName: "",
        homeStadium: "",
        city: "",
        logoUrl: ""
      });
      setIsDialogOpen(true);
    }
  };

  const handleEditTeam = (team: Team) => {
    if (onSelectTeam) {
      onSelectTeam(team.id);
    } else if (onEdit) {
      onEdit(team);
    } else {
      // Open the dialog for editing the team
      setCurrentTeam(team);
      setFormData({
        name: team.name,
        shortName: team.shortName,
        homeStadium: team.homeStadium || "",
        city: team.city || "",
        logoUrl: team.logoUrl || ""
      });
      setIsDialogOpen(true);
    }
  };

  const handleDeleteTeam = (team: Team) => {
    if (onDelete) {
      onDelete(team.id);
    } else {
      // Open the confirmation dialog for deleting the team
      setCurrentTeam(team);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (currentTeam) {
        // Update existing team
        const { error } = await supabase
          .from('times')
          .update({
            nome: formData.name,
            sigla: formData.shortName,
            escudo_url: formData.logoUrl
          })
          .eq('id', currentTeam.id);
          
        if (error) throw error;
        
        // Update local state
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
        // Create new team
        const { data, error } = await supabase
          .from('times')
          .insert({
            nome: formData.name,
            sigla: formData.shortName,
            escudo_url: formData.logoUrl
          })
          .select();
          
        if (error) throw error;
        
        // Add to local state
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
      console.error('Error saving team:', error);
      toast({
        title: "Erro ao salvar time",
        description: error.message || "Ocorreu um erro ao salvar o time.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentTeam) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('times')
        .delete()
        .eq('id', currentTeam.id);
        
      if (error) throw error;
      
      // Remove from local state
      setTeams(prev => prev.filter(team => team.id !== currentTeam.id));
      
      toast({
        title: "Time removido",
        description: `${currentTeam.name} foi removido com sucesso.`
      });
    } catch (error: any) {
      console.error('Error deleting team:', error);
      toast({
        title: "Erro ao remover time",
        description: error.message || "Ocorreu um erro ao remover o time.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setCurrentTeam(null);
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
          {isLoading && teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Carregando times...</p>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum time cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Team Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentTeam ? "Editar Time" : "Novo Time"}
            </DialogTitle>
            <DialogDescription>
              {currentTeam 
                ? "Edite as informações do time abaixo." 
                : "Preencha as informações do novo time abaixo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Time</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nome completo do time"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortName">Sigla</Label>
              <Input
                id="shortName"
                name="shortName"
                placeholder="Abreviação (ex: FLA, PAL)"
                value={formData.shortName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">URL do Escudo</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                placeholder="https://exemplo.com/escudo.png"
                value={formData.logoUrl || ""}
                onChange={handleInputChange}
              />
              {formData.logoUrl && (
                <div className="mt-2 flex items-center">
                  <div className="w-12 h-12 border rounded flex items-center justify-center overflow-hidden">
                    <img 
                      src={formData.logoUrl} 
                      alt="Prévia do escudo" 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Prévia do escudo</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentTeam ? "Salvar Alterações" : "Cadastrar Time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o time {currentTeam?.name}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted overflow-hidden">
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
