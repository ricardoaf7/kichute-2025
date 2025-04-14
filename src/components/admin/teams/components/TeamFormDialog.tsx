
import { Team } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ShieldSelector } from "../ShieldSelector";

interface TeamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formData: {
    name: string;
    shortName: string;
    logoUrl: string;
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
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Time</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome completo do time"
              value={formData.name}
              onChange={onInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortName">Sigla</Label>
            <Input
              id="shortName"
              name="shortName"
              placeholder="Abreviação (ex: FLA, PAL)"
              value={formData.shortName}
              onChange={onInputChange}
              maxLength={3}
            />
          </div>
          <div className="grid gap-2">
            <Label>Escudo do Time</Label>
            <ShieldSelector
              value={formData.logoUrl}
              onChange={onLogoChange}
            />
          </div>
        </div>
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

