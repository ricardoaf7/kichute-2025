
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Match, Team } from "@/types";
import { Form, FormField } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchFormValues } from "@/contexts/MatchesContext";
import { RoundSelector } from "./form/RoundSelector";
import { TeamSelector } from "./form/TeamSelector";
import { DateTimeSelector } from "./form/DateTimeSelector";
import { LocationFields } from "./form/LocationFields";
import { FormActions } from "./form/FormActions";
import { useTeams } from "@/hooks/teams/useTeams";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export const MatchForm = ({ selectedRound, editingMatch, onSubmit, onCancel }: MatchFormProps) => {
  const { teams, isLoading, error, fetchTeams } = useTeams();
  const { toast } = useToast();
  const [matchesInRound, setMatchesInRound] = useState(0);
  
  // Fetch matches in current round to check for duplicates and count
  const fetchRoundMatches = async () => {
    const { data, error } = await supabase
      .from('partidas')
      .select('*')
      .eq('rodada', selectedRound);
    
    if (error) {
      toast({
        title: "Erro ao carregar partidas",
        description: "Não foi possível verificar as partidas da rodada.",
        variant: "destructive"
      });
      return;
    }
    
    setMatchesInRound(data ? data.length : 0);
  };

  useEffect(() => {
    fetchRoundMatches();
  }, [selectedRound]);
  
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
    const selectedTeam = teams.find(team => team.id === teamId);
    if (selectedTeam) {
      // Auto-fill stadium information from the database
      form.setValue("stadium", selectedTeam.homeStadium || "");
      if (selectedTeam.city) {
        form.setValue("city", selectedTeam.city || "");
      }
    }
  };

  // Verificar se há times duplicados selecionados
  const validateTeamSelection = async () => {
    const homeTeam = form.getValues("homeTeam");
    const awayTeam = form.getValues("awayTeam");
    
    // Check for team duplication in the same round
    const { data: duplicateMatches, error } = await supabase
      .from('partidas')
      .select('*')
      .eq('rodada', selectedRound)
      .or(`time_casa_id.eq.${homeTeam},time_casa_id.eq.${awayTeam},time_visitante_id.eq.${homeTeam},time_visitante_id.eq.${awayTeam}`);
    
    if (error) {
      toast({
        title: "Erro de validação",
        description: "Não foi possível verificar times duplicados.",
        variant: "destructive"
      });
      return false;
    }
    
    if (homeTeam === awayTeam) {
      form.setError("awayTeam", {
        type: "manual",
        message: "O time visitante deve ser diferente do time da casa"
      });
      return false;
    }
    
    if (duplicateMatches && duplicateMatches.length > 0) {
      form.setError("awayTeam", {
        type: "manual",
        message: "Este time já está cadastrado nesta rodada"
      });
      return false;
    }
    
    // Check round match limit
    if (matchesInRound >= 10 && !editingMatch) {
      toast({
        title: "Limite de partidas excedido",
        description: "Só é possível cadastrar 10 partidas por rodada.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleFormSubmit = async (values: MatchFormValues) => {
    const isValid = await validateTeamSelection();
    if (isValid) {
      onSubmit(values);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingMatch ? "Editar Partida" : "Nova Partida"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Jogos cadastrados nesta rodada: {matchesInRound} / 10
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                  teams={teams}
                  label="Time da Casa"
                  value={field.value}
                  placeholder="Selecione o time da casa"
                  isLoading={isLoading}
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
                  teams={teams}
                  label="Time Visitante"
                  value={field.value}
                  placeholder="Selecione o time visitante" 
                  isLoading={isLoading}
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
