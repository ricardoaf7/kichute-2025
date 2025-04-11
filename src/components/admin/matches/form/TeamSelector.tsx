
import { Team } from "@/types";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamSelectorProps {
  teams: Team[];
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export const TeamSelector = ({ 
  teams, 
  label, 
  value,
  placeholder,
  onChange
}: TeamSelectorProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select 
        onValueChange={onChange}
        value={value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
