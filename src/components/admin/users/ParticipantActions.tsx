
import { Button } from "@/components/ui/button";
import { DollarSign, Pencil, Trash2 } from "lucide-react";

interface ParticipantActionsProps {
  userId: string;
  userName: string;
  currentPayment: number;
  onEdit: (userId: string) => void;
  onDelete: (userId: string, userName: string) => void;
  onOpenPayment: (userId: string, userName: string, currentPayment: number) => void;
}

export function ParticipantActions({
  userId,
  userName,
  currentPayment,
  onEdit,
  onDelete,
  onOpenPayment,
}: ParticipantActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onOpenPayment(userId, userName, currentPayment)}
      >
        <DollarSign className="h-4 w-4" />
        <span className="sr-only">Pagamento</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onEdit(userId)}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(userId, userName)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Excluir</span>
      </Button>
    </div>
  );
}
