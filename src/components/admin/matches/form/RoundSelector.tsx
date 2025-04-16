
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { MatchFormValues } from "@/contexts/MatchesContext";

interface RoundSelectorProps {
  control: Control<MatchFormValues>;
  name: "round";
}

export const RoundSelector = ({ control, name }: RoundSelectorProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Rodada</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
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
  );
};
