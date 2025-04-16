
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Match } from "@/types";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { MatchFormValues } from "@/contexts/MatchesContext";
import { RoundSelector } from "./form/RoundSelector";
import { TeamSelector } from "./form/TeamSelector";
import { DateTimeSelector } from "./form/DateTimeSelector";
import { LocationFields } from "./form/LocationFields";
import { FormActions } from "./form/FormActions";
import { useTeams } from "@/hooks/teams/useTeams";
import { MatchFormHeader } from "./form/MatchFormHeader";
import { useMatchValidation } from "./form/ValidationHelpers";

const formSchema = z.object({
  round: z.string(),
  homeTeam: z.string().min(1, "Selecione o time da casa"),
  awayTeam: z.string().min(1, "Selecione o time visitante"),
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

export const MatchForm = ({ 
  selectedRound, 
  editingMatch, 
  onSubmit, 
  onCancel 
}: MatchFormProps) => {
  const { teams, isLoading } = useTeams();
  
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

  const { validateTeamSelection, matchesInRound } = useMatchValidation(
    form, 
    selectedRound,
    editingMatch?.id || null
  );

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
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      // Auto-fill stadium information from the database
      form.setValue("stadium", selectedTeam.homeStadium || "");
      if (selectedTeam.city) {
        form.setValue("city", selectedTeam.city || "");
      }
    }
  };

  const handleFormSubmit = async (values: MatchFormValues) => {
    const isValid = await validateTeamSelection();
    if (isValid) {
      onSubmit(values);
    }
  };

  return (
    <Card>
      <MatchFormHeader 
        editingMatch={editingMatch} 
        matchesInRound={matchesInRound} 
      />
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <RoundSelector 
              control={form.control}
              name="round"
            />

            <TeamSelector 
              control={form.control}
              name="homeTeam"
              label="Time da Casa"
              placeholder="Selecione o time da casa"
              teams={teams}
              isLoading={isLoading}
              onChange={handleHomeTeamChange}
            />

            <TeamSelector 
              control={form.control}
              name="awayTeam"
              label="Time Visitante"
              placeholder="Selecione o time visitante"
              teams={teams}
              isLoading={isLoading}
            />

            <DateTimeSelector 
              control={form.control}
              name="matchDate"
              label="Data e Hora da Partida"
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
