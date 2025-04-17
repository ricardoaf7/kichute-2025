
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface ScoreInputProps {
  teamName: string;
  score: number;
  onChange: (value: number) => void;
  isDisabled: boolean;
}

export const ScoreInput = ({ teamName, score, onChange, isDisabled }: ScoreInputProps) => {
  // Use local state to handle text input
  const [inputValue, setInputValue] = useState<string>(score?.toString() || "0");

  // Update local state when prop changes (e.g. from parent)
  useEffect(() => {
    if (score !== undefined) {
      setInputValue(score.toString());
    }
  }, [score]);

  const handleIncrement = () => {
    // Ensure we don't exceed max value of 20
    if (score < 20) {
      const newScore = score + 1;
      setInputValue(newScore.toString());
      onChange(newScore);
    }
  };

  const handleDecrement = () => {
    // Ensure we don't go below 0
    if (score > 0) {
      const newScore = score - 1;
      setInputValue(newScore.toString());
      onChange(newScore);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Always update the input field for better UX
    setInputValue(value);
    
    // Only update parent if it's a valid number
    if (value === "") {
      // Let user type empty value temporarily without updating parent
    } else if (/^\d+$/.test(value)) {
      const numValue = parseInt(value);
      if (numValue >= 0 && numValue <= 20) {
        onChange(numValue);
      }
    }
  };

  const handleBlur = () => {
    // When input loses focus, ensure the display value is valid
    let finalValue = 0;
    
    if (inputValue === "" || !/^\d+$/.test(inputValue)) {
      // If empty or invalid, reset to zero
      finalValue = 0;
    } else {
      const numValue = parseInt(inputValue);
      if (numValue < 0) {
        finalValue = 0;
      } else if (numValue > 20) {
        finalValue = 20;
      } else {
        finalValue = numValue;
      }
    }
    
    // Update both local state and parent component
    setInputValue(finalValue.toString());
    onChange(finalValue);
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
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={isDisabled}
          min="0"
          max="20"
          aria-label={`Score for ${teamName}`}
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
