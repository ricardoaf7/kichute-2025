
import { useEffect } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, useWatch, useFormContext } from "react-hook-form";
import { MatchFormValues } from "@/contexts/matches/types";
import { Team } from "@/types";

interface LocationFieldsProps {
  control: Control<MatchFormValues>;
  homeTeamId: string;
  teams: Team[];
}

export const LocationFields = ({ control, homeTeamId, teams }: LocationFieldsProps) => {
  // Observar a seleção do time da casa
  const watchHomeTeam = useWatch({
    control,
    name: "homeTeam",
  });
  
  // Obter a função setValue do contexto do formulário
  const { setValue } = useFormContext<MatchFormValues>();

  // Efeito para atualizar os campos de estádio e cidade quando o time da casa muda
  useEffect(() => {
    if (watchHomeTeam && teams.length > 0) {
      const selectedHomeTeam = teams.find(team => team.id === watchHomeTeam);
      
      if (selectedHomeTeam) {
        // Atualizar os campos com os valores do time selecionado
        if (selectedHomeTeam.homeStadium) {
          setValue("stadium", selectedHomeTeam.homeStadium);
        }
        
        if (selectedHomeTeam.city) {
          setValue("city", selectedHomeTeam.city);
        }
      }
    }
  }, [watchHomeTeam, teams, setValue]);

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};
