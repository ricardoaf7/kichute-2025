
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ScoreInputProps {
  teamName: string;
  score: number;
  onChange: (value: string) => void;
  isDisabled: boolean;
}

export const ScoreInput = ({ teamName, score, onChange, isDisabled }: ScoreInputProps) => {
  const handleIncrement = () => {
    // Ensure we don't exceed max value of 20
    if (score < 20) {
      onChange((score + 1).toString());
    }
  };

  const handleDecrement = () => {
    // Ensure we don't go below 0
    if (score > 0) {
      onChange((score - 1).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid numbers 0-20
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 20)) {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2 w-2/5">
      <span className="font-semibold text-center">{teamName}</span>
      <div className="flex items-center space-x-1">
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleDecrement}
          disabled={isDisabled || score <= 0}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        <Input
          type="text"
          className="w-12 text-center"
          value={score}
          onChange={handleInputChange}
          disabled={isDisabled}
          min="0"
          max="20"
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
          disabled={isDisabled || score >= 20}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
