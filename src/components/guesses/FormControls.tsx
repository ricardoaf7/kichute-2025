
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface FormControlsProps {
  isLoading: boolean;
  isSaving: boolean;
  hasMatches: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormControls = ({ isLoading, isSaving, hasMatches, onSubmit }: FormControlsProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          disabled={isLoading || isSaving || !hasMatches}
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
