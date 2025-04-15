
import { Team } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import TeamFormFields from "./TeamFormFields";

interface TeamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formData: {
    name: string;
    shortName: string;
    logoUrl: string;
    stadium: string;
    city: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoChange: (url: string) => void;
  isSubmitting: boolean;
  currentTeam: Team | null;
}

const TeamFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  formData,
  onInputChange,
  onLogoChange,
  isSubmitting,
  currentTeam
}: TeamFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentTeam ? "Editar Time" : "Novo Time"}
          </DialogTitle>
          <DialogDescription>
            {currentTeam 
              ? "Edite as informações do time abaixo." 
              : "Preencha as informações do novo time abaixo."}
          </DialogDescription>
        </DialogHeader>

        <TeamFormFields 
          formData={formData}
          onInputChange={onInputChange}
          onLogoChange={onLogoChange}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentTeam ? "Salvar Alterações" : "Cadastrar Time"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamFormDialog;
