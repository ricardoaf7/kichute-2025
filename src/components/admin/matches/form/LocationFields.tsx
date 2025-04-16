
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { MatchFormValues } from "@/contexts/matches/types";
import { Team } from "@/types";

interface LocationFieldsProps {
  control: Control<MatchFormValues>;
  homeTeamId: string;
  teams: Team[];
}

export const LocationFields = ({ control, homeTeamId, teams }: LocationFieldsProps) => {
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
