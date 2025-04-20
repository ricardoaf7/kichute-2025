
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
  // Para screen readers
  const ariaLabel = `Score for ${teamName}`;

  const increment = () => {
    if (isDisabled) return;
    onChange(Math.min(20, score + 1));
  };

  const decrement = () => {
    if (isDisabled) return;
    onChange(Math.max(0, score - 1));
  };

  return (
    <div className="flex flex-col items-center flex-1">
      <div className="font-medium text-sm mb-2 text-center line-clamp-1 w-full" title={teamName}>
        {teamName}
      </div>

      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={decrement}
          disabled={isDisabled || score <= 0}
          aria-label={`Decrease score for ${teamName}`}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>

        <div 
          className="w-12 mx-2 text-center text-xl font-bold"
          aria-label={ariaLabel}
        >
          {score}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={increment}
          disabled={isDisabled || score >= 20}
          aria-label={`Increase score for ${teamName}`}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
