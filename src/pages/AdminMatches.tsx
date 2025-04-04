
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TEAMS, ROUNDS } from "../utils/mockData";
import { Match, Round, Team } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, Trash } from "lucide-react";
import { pt } from "date-fns/locale";

const formSchema = z.object({
  round: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  matchDate: z.date(),
  stadium: z.string().optional(),
  city: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AdminMatches = () => {
  const [rounds, setRounds] = useState<Round[]>(ROUNDS);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      round: selectedRound.toString(),
      homeTeam: "",
      awayTeam: "",
      stadium: "",
      city: "",
    },
  });

  const resetForm = () => {
    form.reset({
      round: selectedRound.toString(),
      homeTeam: "",
      awayTeam: "",
      stadium: "",
      city: "",
    });
    setEditingMatch(null);
  };

  const handleAddRound = () => {
    const newRoundNumber = rounds.length > 0 
      ? Math.max(...rounds.map(r => r.number)) + 1 
      : 1;
    
    const newRound: Round = {
      number: newRoundNumber,
      matches: [],
      closed: false,
      deadline: new Date().toISOString(),
    };
    
    setRounds(prev => [...prev, newRound]);
    toast({
      title: "Rodada adicionada",
      description: `Rodada ${newRoundNumber} criada com sucesso.`
    });
  };

  const handleDeleteRound = (roundNumber: number) => {
    if (confirm(`Tem certeza que deseja excluir a Rodada ${roundNumber}?`)) {
      setRounds(prev => prev.filter(r => r.number !== roundNumber));
      toast({
        title: "Rodada excluída",
        description: `Rodada ${roundNumber} foi removida com sucesso.`
      });
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    const matchDate = new Date(match.date);
    
    form.reset({
      round: match.round.toString(),
      homeTeam: match.homeTeam.id,
      awayTeam: match.awayTeam.id,
      matchDate: matchDate,
      stadium: match.stadium || "",
      city: match.city || "",
    });
  };

  const handleDeleteMatch = (matchId: string, roundNumber: number) => {
    if (confirm("Tem certeza que deseja excluir esta partida?")) {
      setRounds(prev => 
        prev.map(round => {
          if (round.number === roundNumber) {
            return {
              ...round,
              matches: round.matches.filter(match => match.id !== matchId)
            };
          }
          return round;
        })
      );
      
      toast({
        title: "Partida excluída",
        description: "A partida foi removida com sucesso."
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    const homeTeam = TEAMS.find(team => team.id === values.homeTeam);
    const awayTeam = TEAMS.find(team => team.id === values.awayTeam);
    const roundNumber = parseInt(values.round);

    if (!homeTeam || !awayTeam) {
      toast({
        title: "Erro ao salvar partida",
        description: "Times selecionados inválidos.",
        variant: "destructive"
      });
      return;
    }

    if (homeTeam.id === awayTeam.id) {
      toast({
        title: "Erro ao salvar partida",
        description: "Os times da casa e visitante não podem ser os mesmos.",
        variant: "destructive"
      });
      return;
    }

    // Verificar se a rodada existe
    let round = rounds.find(r => r.number === roundNumber);
    if (!round) {
      // Criar a rodada se não existir
      round = {
        number: roundNumber,
        matches: [],
        closed: false,
        deadline: new Date().toISOString(),
      };
      setRounds(prev => [...prev, round!]);
    }

    if (editingMatch) {
      // Editar partida existente
      setRounds(prev => 
        prev.map(r => {
          if (r.number === roundNumber) {
            return {
              ...r,
              matches: r.matches.map(m => 
                m.id === editingMatch.id
                  ? {
                      ...m,
                      round: roundNumber,
                      homeTeam,
                      awayTeam,
                      date: values.matchDate.toISOString(),
                      stadium: values.stadium || "",
                      city: values.city || "",
                    }
                  : m
              )
            };
          }
          return r;
        })
      );

      toast({
        title: "Partida atualizada",
        description: "A partida foi atualizada com sucesso."
      });
    } else {
      // Adicionar nova partida
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        round: roundNumber,
        homeTeam,
        awayTeam,
        homeScore: null,
        awayScore: null,
        date: values.matchDate.toISOString(),
        played: false,
        stadium: values.stadium || "",
        city: values.city || "",
      };

      setRounds(prev => 
        prev.map(r => {
          if (r.number === roundNumber) {
            return {
              ...r,
              matches: [...r.matches, newMatch]
            };
          }
          return r;
        })
      );

      toast({
        title: "Partida adicionada",
        description: "A partida foi adicionada com sucesso."
      });
    }

    resetForm();
  };

  const handleUpdateResults = (match: Match, homeScore: number, awayScore: number) => {
    setRounds(prev => 
      prev.map(round => {
        if (round.number === match.round) {
          return {
            ...round,
            matches: round.matches.map(m => 
              m.id === match.id
                ? {
                    ...m,
                    homeScore,
                    awayScore,
                    played: true
                  }
                : m
            )
          };
        }
        return round;
      })
    );

    toast({
      title: "Resultado atualizado",
      description: "O resultado da partida foi atualizado com sucesso."
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Gerenciar Jogos</h1>
          <p className="text-muted-foreground mt-2">
            Adicione e edite rodadas e partidas manualmente
          </p>
        </div>

        <Tabs defaultValue="rounds" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rounds">Rodadas</TabsTrigger>
            <TabsTrigger value="matches">Partidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rounds" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Rodadas</CardTitle>
                  <Button onClick={handleAddRound}>Nova Rodada</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rounds.map((round) => (
                    <Card key={round.number} className="hover:shadow-md transition-shadow">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Rodada {round.number}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteRound(round.number)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <div>Partidas: {round.matches.length}</div>
                          <div>{round.closed ? "Fechada" : "Aberta"}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingMatch ? "Editar Partida" : "Nova Partida"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="round"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rodada</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a rodada" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Array.from({ length: 38 }, (_, i) => i + 1).map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      Rodada {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="homeTeam"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time da Casa</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o time da casa" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TEAMS.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="awayTeam"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time Visitante</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o time visitante" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TEAMS.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="matchDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data e Hora da Partida</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={`w-full pl-3 text-left font-normal ${
                                        !field.value ? "text-muted-foreground" : ""
                                      }`}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP 'às' HH:mm", { locale: pt })
                                      ) : (
                                        <span>Selecione a data e hora</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date("2025-01-01")}
                                    initialFocus
                                  />
                                  <div className="p-3 border-t border-border">
                                    <Input
                                      type="time"
                                      onChange={(e) => {
                                        const date = field.value || new Date();
                                        const [hours, minutes] = e.target.value.split(':');
                                        date.setHours(parseInt(hours, 10));
                                        date.setMinutes(parseInt(minutes, 10));
                                        field.onChange(date);
                                      }}
                                      defaultValue={field.value ? format(field.value, "HH:mm") : "16:00"}
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stadium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estádio (opcional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nome do estádio" />
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
                              <FormLabel>Cidade (opcional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nome da cidade" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-2 pt-2">
                          <Button type="submit" className="flex-1">
                            <Save className="mr-2 h-4 w-4" />
                            {editingMatch ? "Atualizar" : "Adicionar"}
                          </Button>
                          {editingMatch && (
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
                      <CardTitle>Lista de Partidas</CardTitle>
                      <Select
                        value={selectedRound.toString()}
                        onValueChange={(value) => setSelectedRound(parseInt(value))}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione a rodada" />
                        </SelectTrigger>
                        <SelectContent>
                          {rounds.map((round) => (
                            <SelectItem key={round.number} value={round.number.toString()}>
                              Rodada {round.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {rounds.find(r => r.number === selectedRound)?.matches.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhuma partida cadastrada para esta rodada.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {rounds
                          .find(r => r.number === selectedRound)
                          ?.matches.map((match) => (
                            <Card key={match.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm text-muted-foreground">
                                        {format(new Date(match.date), "dd/MM/yyyy HH:mm")}
                                      </span>
                                      {match.stadium && (
                                        <span className="text-sm text-muted-foreground">
                                          {match.stadium}, {match.city}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="flex flex-1 items-center gap-2">
                                        <span className="font-medium">{match.homeTeam.name}</span>
                                      </div>
                                      <div className="mx-2 font-bold">
                                        {match.played
                                          ? `${match.homeScore} x ${match.awayScore}`
                                          : "x"}
                                      </div>
                                      <div className="flex flex-1 items-center justify-end gap-2">
                                        <span className="font-medium">{match.awayTeam.name}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 justify-end items-center border-t pt-2 md:pt-0 md:border-t-0">
                                    {!match.played && (
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          min="0"
                                          placeholder="Casa"
                                          className="w-16"
                                          id={`home-${match.id}`}
                                        />
                                        <span className="flex items-center">x</span>
                                        <Input
                                          type="number"
                                          min="0"
                                          placeholder="Fora"
                                          className="w-16"
                                          id={`away-${match.id}`}
                                        />
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            const homeInput = document.getElementById(`home-${match.id}`) as HTMLInputElement;
                                            const awayInput = document.getElementById(`away-${match.id}`) as HTMLInputElement;
                                            
                                            if (homeInput && awayInput) {
                                              const homeScore = parseInt(homeInput.value);
                                              const awayScore = parseInt(awayInput.value);
                                              
                                              if (!isNaN(homeScore) && !isNaN(awayScore)) {
                                                handleUpdateResults(match, homeScore, awayScore);
                                              }
                                            }
                                          }}
                                        >
                                          Salvar
                                        </Button>
                                      </div>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleEditMatch(match)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                      </svg>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handleDeleteMatch(match.id, match.round)}
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminMatches;
