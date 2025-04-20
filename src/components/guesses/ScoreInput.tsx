// src/components/guesses/ScoreInput.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

interface ScoreInputProps {
  teamName: string;
  score: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
}

export const ScoreInput = ({
  teamName,
  score,
  onChange,
  isDisabled = false,
}: ScoreInputProps) => {
  const increment = () => onChange(Math.min(score + 1, 20));
  const decrement = () => onChange(Math.max(score - 1, 0));
  const handleDirect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0 && val <= 20) {
      onChange(val);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={isDisabled || score <= 0}
        aria-label={`Diminuir placar de ${teamName}`}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>

      <input
        type="number"
        className="w-12 text-center border rounded"
        value={score}
        onChange={handleDirect}
        disabled={isDisabled}
        min={0}
        max={20}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={increment}
        disabled={isDisabled || score >= 20}
        aria-label={`Aumentar placar de ${teamName}`}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
