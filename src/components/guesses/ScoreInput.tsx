
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [inputValue, setInputValue] = useState<string>(score.toString());

  // Atualiza o input quando o score muda externamente
  useEffect(() => {
    setInputValue(score.toString());
  }, [score]);

  // Para screen readers
  const ariaLabel = `Score for ${teamName}`;

  const increment = () => {
    if (isDisabled) return;
    const newValue = Math.min(20, score + 1);
    onChange(newValue);
  };

  const decrement = () => {
    if (isDisabled) return;
    const newValue = Math.max(0, score - 1);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permite apenas dígitos
    if (!/^\d*$/.test(value)) return;

    setInputValue(value);
  };

  const handleInputBlur = () => {
    // Converte para número e limita entre 0 e 20
    let numValue = parseInt(inputValue, 10);

    // Se não for um número válido, volta para o valor anterior
    if (isNaN(numValue)) {
      setInputValue(score.toString());
      return;
    }

    // Limita o valor entre 0 e 20
    numValue = Math.max(0, Math.min(20, numValue));
    setInputValue(numValue.toString());
    onChange(numValue);
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

        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-12 mx-2 text-center text-xl font-bold h-8 p-0"
          disabled={isDisabled}
          aria-label={ariaLabel}
          maxLength={2}
        />

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
