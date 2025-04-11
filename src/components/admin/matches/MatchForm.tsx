
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { pt } from "date-fns/locale";
import { Match, Team } from "@/types";
import { TEAMS } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  round: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  matchDate: z.date(),
  stadium: z.string().optional(),
  city: z.string().optional(),
});

export type MatchFormValues = z.infer<typeof formSchema>;

interface MatchFormProps {
  selectedRound: number;
  editingMatch: Match | null;
  onSubmit: (values: MatchFormValues) => void;
  onCancel: () => void;
}

export const MatchForm = ({ selectedRound, editingMatch, onSubmit, onCancel }: MatchFormProps) => {
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      round: selectedRound.toString(),
      homeTeam: editingMatch?.homeTeam.id || "",
      awayTeam: editingMatch?.awayTeam.id || "",
      matchDate: editingMatch ? new Date(editingMatch.date) : new Date(),
      stadium: editingMatch?.stadium || "",
      city: editingMatch?.city || "",
    },
  });

  const handleHomeTeamChange = (teamId: string) => {
    const selectedTeam = TEAMS.find(team => team.id === teamId);
    if (selectedTeam && selectedTeam.homeStadium) {
      form.setValue("stadium", selectedTeam.homeStadium);
      if (selectedTeam.city) {
        form.setValue("city", selectedTeam.city);
      }
    }
  };

  return (
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleHomeTeamChange(value);
                    }}
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
                  <FormLabel>Estádio</FormLabel>
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
                  <FormLabel>Cidade</FormLabel>
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
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
