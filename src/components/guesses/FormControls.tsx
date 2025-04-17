
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface FormControlsProps {
  isLoading?: boolean;
  isSaving: boolean;
  hasMatches?: boolean;
  isValid?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormControls = ({ isLoading = false, isSaving, hasMatches = true, isValid = true, onSubmit }: FormControlsProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          disabled={isLoading || isSaving || !hasMatches || !isValid}
          className="w-full md:w-auto"
        >
          {isSaving ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Enviar Palpites'
          )}
        </Button>
      </div>
    </form>
  );
};
