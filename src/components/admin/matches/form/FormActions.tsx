
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const FormActions = ({ isEditing, onCancel, isSubmitting }: FormActionsProps) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button type="submit" className="flex-1" disabled={isSubmitting}>
        <Save className="mr-2 h-4 w-4" />
        {isEditing ? "Atualizar" : "Adicionar"}
      </Button>
      {isEditing && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </div>
  );
};
