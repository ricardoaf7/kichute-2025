
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NewParticipantForm } from "./NewParticipantForm";
import { Player } from "@/types";

interface NewParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Player, "id" | "roundPoints" | "paid" | "paidAmount" | "totalPoints"> & { password: string, tipo: "Participante" | "Administrador" }) => void;
}

export function NewParticipantDialog({ isOpen, onClose, onSubmit }: NewParticipantDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Participante</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo participante ao Kichute FC.
          </DialogDescription>
        </DialogHeader>
        <NewParticipantForm onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
