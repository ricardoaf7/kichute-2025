
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useParticipantEdit = (users: Player[], setUsers: React.Dispatch<React.SetStateAction<Player[]>>) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Player | null>(null);
  const { toast } = useToast();

  const handleEditUser = (userId: string) => {
    const participant = users.find(user => user.id === userId);
    if (participant) {
      setSelectedParticipant(participant);
      setIsEditDialogOpen(true);
    }
  };

  const handleSubmitEdit = async (data: { name: string; password?: string; tipo: "Participante" | "Administrador" }) => {
    if (!selectedParticipant) return;

    try {
      const updateData: { nome: string; tipo: "Participante" | "Administrador"; senha?: string } = {
        nome: data.name,
        tipo: data.tipo
      };

      if (data.password) {
        updateData.senha = data.password;
      }

      const { error } = await supabase
        .from('jogadores')
        .update(updateData)
        .eq('id', selectedParticipant.id);

      if (error) throw error;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedParticipant.id
            ? { ...user, name: data.name, role: data.tipo }
            : user
        )
      );

      setIsEditDialogOpen(false);
      setSelectedParticipant(null);

      toast({
        title: "Participante atualizado",
        description: `${data.name} foi atualizado com sucesso.`
      });
    } catch (error: any) {
      console.error("Erro ao atualizar participante:", error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro inesperado ao tentar atualizar o participante.",
        variant: "destructive"
      });
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedParticipant,
    handleEditUser,
    handleSubmitEdit
  };
};
