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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShieldSelector } from "./ShieldSelector";

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

  // Fetch teams from Supabase when component mounts
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
    // Open the dialog for creating a new team
    setCurrentTeam(null);
    setFormData({
      name: "",
      shortName: "",
      logoUrl: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    // Open the dialog for editing the team
    setCurrentTeam(team);
    setFormData({
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logoUrl || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTeam = (team: Team) => {
    // Open the confirmation dialog for deleting the team
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
      
      // Remove from local state
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
                maxLength={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Escudo do Time</Label>
              <ShieldSelector
                value={formData.logoUrl || ""}
                onChange={(url) => setFormData(prev => ({ ...prev, logoUrl: url }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentTeam ? "Salvar Alterações" : "Cadastrar Time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o time {currentTeam?.name}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

export default TeamsList;
