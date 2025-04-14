
import { useState } from "react";
import { Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTeamDelete = (onSuccess: (teamId: string) => void) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!teamToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('times')
        .delete()
        .eq('id', teamToDelete.id);
        
      if (error) throw error;
      
      onSuccess(teamToDelete.id);
      toast({
        title: "Time removido",
        description: `${teamToDelete.name} foi removido com sucesso.`
      });
    } catch (error: any) {
      console.error('Erro ao remover time:', error);
      toast({
        title: "Erro ao remover time",
        description: error.message || "Ocorreu um erro ao remover o time.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    teamToDelete,
    setTeamToDelete,
    isDeleting,
    handleDelete
  };
};
