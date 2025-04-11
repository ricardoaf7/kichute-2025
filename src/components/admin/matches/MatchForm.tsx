
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Match } from "@/types";
import { TEAMS } from "@/utils/mockData";
import { Form, FormField } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchFormValues } from "@/contexts/MatchesContext";
import { RoundSelector } from "./form/RoundSelector";
import { TeamSelector } from "./form/TeamSelector";
import { DateTimeSelector } from "./form/DateTimeSelector";
import { LocationFields } from "./form/LocationFields";
import { FormActions } from "./form/FormActions";

const formSchema = z.object({
  round: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  matchDate: z.date(),
  stadium: z.string().optional(),
  city: z.string().optional(),
});

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
      homeTeam: "",
      awayTeam: "",
      matchDate: new Date(),
      stadium: "",
      city: "",
    },
  });

  // Update form when editing match changes
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
    } else {
      form.reset({
        round: selectedRound.toString(),
        homeTeam: "",
        awayTeam: "",
        matchDate: new Date(),
        stadium: "",
        city: "",
      });
    }
  }, [editingMatch, selectedRound, form]);

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
                <RoundSelector 
                  value={field.value} 
                  onChange={field.onChange} 
                />
              )}
            />

            <FormField
              control={form.control}
              name="homeTeam"
              render={({ field }) => (
                <TeamSelector 
                  teams={TEAMS}
                  label="Time da Casa"
                  value={field.value}
                  placeholder="Selecione o time da casa"
                  onChange={(value) => {
                    field.onChange(value);
                    handleHomeTeamChange(value);
                  }}
                />
              )}
            />

            <FormField
              control={form.control}
              name="awayTeam"
              render={({ field }) => (
                <TeamSelector 
                  teams={TEAMS}
                  label="Time Visitante"
                  value={field.value}
                  placeholder="Selecione o time visitante" 
                  onChange={field.onChange}
                />
              )}
            />

            <FormField
              control={form.control}
              name="matchDate"
              render={({ field }) => (
                <DateTimeSelector 
                  date={field.value}
                  onChange={field.onChange}
                  label="Data e Hora da Partida"
                />
              )}
            />

            <LocationFields form={form} />

            <FormActions 
              editingMatch={editingMatch} 
              onCancel={onCancel} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
