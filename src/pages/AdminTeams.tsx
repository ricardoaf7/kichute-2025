
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Team } from "../types";
import { TEAMS } from "../utils/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, Plus, Save, Trash } from "lucide-react";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome do time é obrigatório"),
  shortName: z.string().min(1, "Abreviação é obrigatória").max(3, "Máximo de 3 caracteres"),
  homeStadium: z.string().min(1, "Nome do estádio é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminTeams = () => {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shortName: "",
      homeStadium: "",
      city: "",
    },
  });

  useEffect(() => {
    if (editingTeam) {
      form.reset({
        id: editingTeam.id,
        name: editingTeam.name,
        shortName: editingTeam.shortName,
        homeStadium: editingTeam.homeStadium || "",
        city: editingTeam.city || "",
      });
    }
  }, [editingTeam, form]);

  const resetForm = () => {
    form.reset({
      name: "",
      shortName: "",
      homeStadium: "",
      city: "",
    });
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

  const onSubmit = (values: FormValues) => {
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

    resetForm();
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
            <Card>
              <CardHeader>
                <CardTitle>{editingTeam ? "Editar Time" : "Novo Time"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Time</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Flamengo" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Abreviação (3 letras)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: FLA" maxLength={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="homeStadium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estádio Principal</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Maracanã" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: Rio de Janeiro" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        {editingTeam ? "Atualizar" : "Adicionar"}
                      </Button>
                      {editingTeam && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Times Cadastrados</CardTitle>
                  <Button onClick={resetForm} variant="outline" size="sm">
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
                        <Card key={team.id} className="hover:shadow-md transition-shadow">
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
                                  onClick={() => handleEditTeam(team)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTeam(team.id)}
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeams;
