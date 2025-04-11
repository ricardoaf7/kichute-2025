
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Match } from "@/types";

interface FormActionsProps {
  editingMatch: Match | null;
  onCancel: () => void;
}

export const FormActions = ({ editingMatch, onCancel }: FormActionsProps) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button type="submit" className="flex-1">
        <Save className="mr-2 h-4 w-4" />
        {editingMatch ? "Atualizar" : "Adicionar"}
      </Button>
      {editingMatch && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </div>
  );
};
