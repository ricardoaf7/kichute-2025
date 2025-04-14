
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditParticipantForm } from "./EditParticipantForm";
import { Player } from "@/types";

interface EditParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Player | null;
  onSubmit: (data: { name: string; password?: string; tipo: "Participante" | "Administrador" }) => void;
}

export function EditParticipantDialog({ isOpen, onClose, participant, onSubmit }: EditParticipantDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Participante</DialogTitle>
          <DialogDescription>
            Atualize os dados do participante.
          </DialogDescription>
        </DialogHeader>
        {participant && (
          <EditParticipantForm
            participant={participant}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
