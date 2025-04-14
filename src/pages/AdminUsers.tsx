import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ParticipantList } from "@/components/admin/users/ParticipantList";
import { AdminModeToggle } from "@/components/admin/users/AdminModeToggle";
import { PaymentDialog } from "@/components/admin/users/PaymentDialog";
import { EditParticipantDialog } from "@/components/admin/users/EditParticipantDialog";
import { NewParticipantDialog } from "@/components/admin/users/NewParticipantDialog";
import { DeleteConfirmationDialog } from "@/components/admin/users/DeleteConfirmationDialog";
import { useParticipants } from "@/hooks/admin/useParticipants";
import { useParticipantEdit } from "@/hooks/admin/useParticipantEdit";
import { useParticipantDelete } from "@/hooks/admin/useParticipantDelete";
import { usePayments } from "@/hooks/admin/usePayments";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MONTHLY_FEE = 10;
const SEASON_TOTAL = 90;

const AdminUsers = () => {
  const { users, setUsers } = useParticipants();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true);
  const { toast } = useToast();

  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedParticipant,
    handleEditUser,
    handleSubmitEdit
  } = useParticipantEdit(users, setUsers);

  const {
    deleteConfirmation,
    setDeleteConfirmation,
    handleDeleteUser,
    confirmDeleteUser
  } = useParticipantDelete(users, setUsers);

  const {
    isPaymentDialogOpen,
    setIsPaymentDialogOpen,
    paymentDetails,
    handleOpenPaymentDialog,
    handleSubmitPayment
  } = usePayments(users, setUsers);

  const calculateMonthsPaid = (amount: number) => {
    return Math.min(Math.floor(amount / MONTHLY_FEE), 9);
  };

  const calculateRemainingBalance = (paidAmount: number) => {
    return Math.max(SEASON_TOTAL - paidAmount, 0);
  };

  const isCurrentMonthPaid = (paidAmount: number) => {
    const currentMonth = new Date().getMonth() - 2;
    const monthsPaid = calculateMonthsPaid(paidAmount);
    return monthsPaid >= currentMonth;
  };

  const getMonthStatus = (paidAmount: number) => {
    if (paidAmount >= SEASON_TOTAL) return "Temporada Completa";
    const monthsPaid = calculateMonthsPaid(paidAmount);
    return isCurrentMonthPaid(paidAmount)
      ? `${monthsPaid} mês(es) pago(s) - Em dia`
      : `${monthsPaid} mês(es) pago(s) - Em atraso`;
  };

  const handleSubmitNewUser = async (data: any) => {
    try {
      const { data: newUser, error } = await supabase
        .from('jogadores')
        .insert({
          nome: data.name,
          senha: data.password,
          tipo: data.tipo,
          status_pagamento: 'pendente',
          pagamento_total: 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setUsers(prevUsers => [...prevUsers, {
        id: newUser.id,
        name: newUser.nome,
        paid: false,
        paidAmount: 0,
        totalPoints: 0,
        roundPoints: {},
        role: newUser.tipo
      }]);
      
      setIsNewDialogOpen(false);
      
      toast({
        title: "Participante adicionado",
        description: `${data.name} foi adicionado com sucesso.`
      });
    } catch (error: any) {
      console.error("Erro ao adicionar participante:", error);
      toast({
        title: "Erro ao adicionar",
        description: error.message || "Ocorreu um erro inesperado ao tentar adicionar o participante.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Gerenciar Participantes</h1>
          <p className="text-muted-foreground mt-2">
            Adicione, edite e remova participantes do Brasileirão 2025
          </p>
        </div>

        {!isAdminMode && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Modo Participante</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Você está no modo participante. Algumas ações estão restritas apenas para administradores.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <AdminModeToggle isAdminMode={isAdminMode} onToggle={setIsAdminMode} />
          
          <Button onClick={() => setIsNewDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Participante
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
            <CardDescription>
              Lista de todos os jogadores participantes do Kichute FC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ParticipantList
              users={users}
              onEdit={handleEditUser}
              onDelete={(userId, userName) => handleDeleteUser(userId, userName, isAdminMode)}
              onOpenPayment={(userId, userName, currentPayment) => 
                handleOpenPaymentDialog(userId, userName, currentPayment, isAdminMode)}
              calculateMonthsPaid={calculateMonthsPaid}
              calculateRemainingBalance={calculateRemainingBalance}
              isCurrentMonthPaid={isCurrentMonthPaid}
              getMonthStatus={getMonthStatus}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <NewParticipantDialog
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onSubmit={handleSubmitNewUser}
      />

      <EditParticipantDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        participant={selectedParticipant}
        onSubmit={handleSubmitEdit}
      />

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onSubmit={handleSubmitPayment}
        paymentDetails={paymentDetails}
        calculateRemainingBalance={calculateRemainingBalance}
      />

      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        userName={deleteConfirmation.userName}
        onConfirm={confirmDeleteUser}
        onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))}
      />
    </div>
  );
}

export default AdminUsers;
