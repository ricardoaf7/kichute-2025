
import { Team } from "@/types";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTeamImagePath } from "@/utils/teamImages";
import { Loader2 } from "lucide-react";

interface TeamSelectorProps {
  teams: Team[];
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const TeamSelector = ({ 
  teams, 
  label, 
  value,
  placeholder,
  onChange,
  isLoading = false
}: TeamSelectorProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select 
        onValueChange={onChange}
        value={value}
        disabled={isLoading}
      >
        <FormControl>
          <SelectTrigger>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando times...</span>
              </div>
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
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
