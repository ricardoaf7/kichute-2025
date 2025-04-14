
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PaymentDetails {
  userId: string;
  userName: string;
  currentPayment: number;
}

export const usePayments = (users: Player[], setUsers: React.Dispatch<React.SetStateAction<Player[]>>) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const { toast } = useToast();

  const handleOpenPaymentDialog = (userId: string, userName: string, currentPayment: number, isAdminMode: boolean) => {
    if (!isAdminMode) {
      toast({
        title: "Acesso Negado",
        description: "Apenas administradores podem registrar pagamentos.",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentDetails({ userId, userName, currentPayment });
    setIsPaymentDialogOpen(true);
  };

  const handleSubmitPayment = async (amount: number) => {
    if (!paymentDetails) {
      toast({
        title: "Erro no pagamento",
        description: "Por favor, insira um valor válido para o pagamento.",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = users.find(u => u.id === paymentDetails.userId);
      if (!user) return;
      
      const newPaidAmount = user.paidAmount + amount;
      const newStatus = newPaidAmount >= 10 ? 'pago' : 'pendente';
      
      const { error } = await supabase
        .from('jogadores')
        .update({ 
          pagamento_total: newPaidAmount,
          status_pagamento: newStatus
        })
        .eq('id', paymentDetails.userId);
      
      if (error) throw error;
      
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === paymentDetails.userId) {
            return {
              ...user,
              paidAmount: newPaidAmount,
              paid: newPaidAmount >= 10
            };
          }
          return user;
        })
      );
      
      setIsPaymentDialogOpen(false);
      
      toast({
        title: "Pagamento registrado",
        description: `Pagamento de R$ ${amount.toFixed(2)} registrado para ${paymentDetails.userName}.`,
      });
    } catch (error: any) {
      console.error("Erro ao registrar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro inesperado ao tentar registrar o pagamento.",
        variant: "destructive"
      });
    }
  };

  return {
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    paymentDetails,
    handleOpenPaymentDialog,
    handleSubmitPayment
  };
};
