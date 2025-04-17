
import { Input } from "@/components/ui/input";

interface ScoreInputProps {
  teamName: string;
  score: number;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const ScoreInput = ({ teamName, score, onChange, isDisabled }: ScoreInputProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 w-2/5">
      <span className="font-semibold text-center">{teamName}</span>
      <Input
        type="number"
        min="0"
        max="20"
        className="w-16 text-center"
        value={score}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  );
};
