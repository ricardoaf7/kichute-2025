
import { Team } from "@/types";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTeamImagePath } from "@/utils/teamImages";

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
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 relative flex-shrink-0">
                  <img
                    src={team.logoUrl || getTeamImagePath(team.name)}
                    alt={team.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <span>{team.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
