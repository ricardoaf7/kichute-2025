
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Match } from "@/types";
import { useEffect, useState } from "react";
import { MatchFormHeader } from "./form/MatchFormHeader";
import { RoundSelector } from "./form/RoundSelector";
import { TeamSelector } from "./form/TeamSelector";
import { DateTimeSelector } from "./form/DateTimeSelector";
import { LocationFields } from "./form/LocationFields";
import { FormActions } from "./form/FormActions";
import { MatchFormValues } from "@/contexts/matches/types";
import { useTeams } from "@/hooks/teams/useTeams";

// Definir esquema de validação do formulário
const formSchema = z.object({
  round: z.string().min(1, "Selecione a rodada"),
  homeTeam: z.string().min(1, "Selecione o time da casa"),
  awayTeam: z.string().min(1, "Selecione o time visitante")
    .refine(val => val !== "", {
      message: "Selecione o time visitante",
    }),
  matchDate: z.date({
    required_error: "Selecione a data da partida",
  }),
  stadium: z.string().optional(),
  city: z.string().optional(),
});

interface MatchFormProps {
  selectedRound: number;
  editingMatch: Match | null;
  onSubmit: (values: MatchFormValues) => void;
  onCancel: () => void;
}

export const MatchForm = ({
  selectedRound,
  editingMatch,
  onSubmit,
  onCancel
}: MatchFormProps) => {
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const { teams, isLoading: teamsLoading } = useTeams();
  
  // Obter a última data/hora utilizada ou usar a data atual
  const getDefaultMatchDate = () => {
    const savedDateTime = localStorage.getItem('lastMatchDateTime');
    if (savedDateTime) {
      try {
        // Usar o construtor de Date diretamente, que mantém o fuso local
        return new Date(savedDateTime);
      } catch (error) {
        console.error('Erro ao converter data salva:', error);
        // Criar data com horário padrão (16:00)
        const defaultDate = new Date();
        defaultDate.setHours(16, 0, 0, 0);
        return defaultDate;
      }
    }
    // Criar data com horário padrão (16:00)
    const defaultDate = new Date();
    defaultDate.setHours(16, 0, 0, 0);
    return defaultDate;
  };
  
  // Inicializar formulário com react-hook-form
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      round: selectedRound.toString(),
      homeTeam: "",
      awayTeam: "",
      matchDate: getDefaultMatchDate(),
      stadium: "",
      city: "",
    },
  });

  // Atualizar valores do formulário quando editingMatch mudar
  useEffect(() => {
    if (editingMatch) {
      // Para edição, usamos a data exata da partida
      const matchDate = new Date(editingMatch.date);
      
      form.reset({
        round: editingMatch.round.toString(),
        homeTeam: editingMatch.homeTeam.id,
        awayTeam: editingMatch.awayTeam.id,
        matchDate: matchDate,
        stadium: editingMatch.stadium || "",
        city: editingMatch.city || "",
      });
      setHomeTeamId(editingMatch.homeTeam.id);
    } else {
      // Para nova partida, usamos a última data salva ou a data atual
      form.reset({
        round: selectedRound.toString(),
        homeTeam: "",
        awayTeam: "",
        matchDate: getDefaultMatchDate(),
        stadium: "",
        city: "",
      });
      setHomeTeamId("");
    }
  }, [editingMatch, selectedRound, form]);

  // Atualizar homeTeamId quando o time da casa mudar
  const watchHomeTeam = form.watch("homeTeam");
  useEffect(() => {
    setHomeTeamId(watchHomeTeam);
  }, [watchHomeTeam]);

  // Manipular envio do formulário
  const handleSubmit = (values: MatchFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <MatchFormHeader 
        editingMatch={editingMatch} 
      />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <RoundSelector control={form.control} />
            <TeamSelector 
              label="Time da Casa"
              name="homeTeam" 
              control={form.control} 
              teams={teams} 
              isLoading={teamsLoading}
            />
            <TeamSelector 
              label="Time Visitante" 
              name="awayTeam" 
              control={form.control} 
              teams={teams}
              excludeTeamId={homeTeamId}
              isLoading={teamsLoading}
            />
            <DateTimeSelector control={form.control} />
            <LocationFields 
              control={form.control}
              homeTeamId={homeTeamId}
              teams={teams}
            />
            <FormActions 
              isEditing={!!editingMatch} 
              onCancel={onCancel} 
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
