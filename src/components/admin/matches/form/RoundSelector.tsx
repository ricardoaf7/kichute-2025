
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoundSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RoundSelector = ({ value, onChange }: RoundSelectorProps) => {
  return (
    <FormItem>
      <FormLabel>Rodada</FormLabel>
      <Select 
        onValueChange={onChange} 
        defaultValue={value}
        value={value}
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
  );
};
