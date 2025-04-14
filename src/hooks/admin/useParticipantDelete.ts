
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmation {
  isOpen: boolean;
  userId: string | null;
  userName: string;
}

export const useParticipantDelete = (users: Player[], setUsers: React.Dispatch<React.SetStateAction<Player[]>>) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    userId: null,
    userName: ""
  });
  const { toast } = useToast();

  const handleDeleteUser = (userId: string, userName: string, isAdminMode: boolean) => {
    if (!isAdminMode) {
      toast({
        title: "Acesso Negado",
        description: "Apenas administradores podem remover participantes.",
        variant: "destructive"
      });
      return;
    }
    setDeleteConfirmation({ isOpen: true, userId, userName });
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirmation.userId) return;
    
    try {
      const { error } = await supabase
        .from('jogadores')
        .delete()
        .eq('id', deleteConfirmation.userId);
      
      if (error) throw error;
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteConfirmation.userId));
      
      toast({
        title: "Participante excluído",
        description: `${deleteConfirmation.userName} foi removido com sucesso.`
      });
    } catch (error: any) {
      console.error("Erro ao excluir participante:", error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro inesperado ao tentar excluir o participante.",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmation({ isOpen: false, userId: null, userName: "" });
    }
  };

  return {
    deleteConfirmation,
    setDeleteConfirmation,
    handleDeleteUser,
    confirmDeleteUser
  };
};
