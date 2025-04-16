
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMatches } from "@/contexts/matches";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTeams } from "@/hooks/teams/useTeams";
import { Match } from "@/types";
import { useEffect, useState } from "react";
import { MatchFormHeader } from "./form/MatchFormHeader";
import { RoundSelector } from "./form/RoundSelector";
import { TeamSelector } from "./form/TeamSelector";
import { DateTimeSelector } from "./form/DateTimeSelector";
import { LocationFields } from "./form/LocationFields";
import { FormActions } from "./form/FormActions";
import { format } from "date-fns";

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

type MatchFormValues = z.infer<typeof formSchema>;

interface MatchFormProps {
  selectedRound: number;
  editingMatch: Match | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export const MatchForm = ({
  selectedRound,
  editingMatch,
  onSubmit,
  onCancel
}: MatchFormProps) => {
  const { teams, isLoading: teamsLoading } = useTeams();
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  
  // Inicializar formulário com react-hook-form
  const form = useForm<MatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      round: selectedRound.toString(),
      homeTeam: "",
      awayTeam: "",
      matchDate: new Date(),
      stadium: "",
      city: "",
    },
  });

  // Atualizar valores do formulário quando editingMatch mudar
  useEffect(() => {
    if (editingMatch) {
      form.reset({
        round: editingMatch.round.toString(),
        homeTeam: editingMatch.homeTeam.id,
        awayTeam: editingMatch.awayTeam.id,
        matchDate: new Date(editingMatch.date),
        stadium: editingMatch.stadium || "",
        city: editingMatch.city || "",
      });
      setHomeTeamId(editingMatch.homeTeam.id);
    } else {
      form.reset({
        round: selectedRound.toString(),
        homeTeam: "",
        awayTeam: "",
        matchDate: new Date(),
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
