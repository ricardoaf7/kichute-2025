
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ShieldCheck, Lock, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NewParticipantForm } from "@/components/admin/users/NewParticipantForm";
import { PaymentDialog } from "@/components/admin/users/PaymentDialog";
import { ParticipantList } from "@/components/admin/users/ParticipantList";
import { useParticipants } from "@/hooks/admin/useParticipants";
import { supabase } from "@/integrations/supabase/client";

const MONTHLY_FEE = 10;
const SEASON_TOTAL = 90;

interface PaymentDetails {
  userId: string;
  userName: string;
  currentPayment: number;
}

interface DeleteConfirmation {
  isOpen: boolean;
  userId: string | null;
  userName: string;
}

export default function AdminUsers() {
  const { users, setUsers } = useParticipants();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    userId: null,
    userName: ""
  });

  // Calculate months paid based on amount
  const calculateMonthsPaid = (amount: number) => {
    return Math.min(Math.floor(amount / MONTHLY_FEE), 9);
  };

  // Calculate remaining balance
  const calculateRemainingBalance = (paidAmount: number) => {
    return Math.max(SEASON_TOTAL - paidAmount, 0);
  };

  // Check if current month is paid
  const isCurrentMonthPaid = (paidAmount: number) => {
    const currentMonth = new Date().getMonth() - 2;
    const monthsPaid = calculateMonthsPaid(paidAmount);
    return monthsPaid >= currentMonth;
  };

  const getMonthStatus = (paidAmount: number) => {
    if (paidAmount >= SEASON_TOTAL) return "Temporada Completa";
    
    const monthsPaid = calculateMonthsPaid(paidAmount);
    
    if (isCurrentMonthPaid(paidAmount)) {
      return `${monthsPaid} mês(es) pago(s) - Em dia`;
    } else {
      return `${monthsPaid} mês(es) pago(s) - Em atraso`;
    }
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do usuário ID ${userId} será implementada em breve.`
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
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

  const handleOpenPaymentDialog = (userId: string, userName: string, currentPayment: number) => {
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
      const newStatus = newPaidAmount >= MONTHLY_FEE ? 'pago' : 'pendente';
      
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
              paid: newPaidAmount >= MONTHLY_FEE
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

  const handleSubmitNewUser = async (data: any) => {
    try {
      const { data: newUser, error } = await supabase
        .from('jogadores')
        .insert({
          nome: data.name,
          senha: data.password,
          status_pagamento: 'pendente',
          pagamento_total: 0,
          tipo: data.tipo
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
      
      setIsDialogOpen(false);
      
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
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isAdminMode ? "default" : "outline"} 
                    onClick={() => setIsAdminMode(true)}
                    className="mr-2"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modo Administrador</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={!isAdminMode ? "default" : "outline"} 
                    onClick={() => setIsAdminMode(false)}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Participante
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modo Participante</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Button onClick={() => setIsDialogOpen(true)}>
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
              onDelete={handleDeleteUser}
              onOpenPayment={handleOpenPaymentDialog}
              calculateMonthsPaid={calculateMonthsPaid}
              calculateRemainingBalance={calculateRemainingBalance}
              isCurrentMonthPaid={isCurrentMonthPaid}
              getMonthStatus={getMonthStatus}
            />
          </CardContent>
        </Card>
      </div>

      {/* New Participant Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Novo Participante</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo participante ao Kichute FC.
            </DialogDescription>
          </DialogHeader>
          <NewParticipantForm 
            onSubmit={handleSubmitNewUser} 
            onCancel={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onSubmit={handleSubmitPayment}
        paymentDetails={paymentDetails}
        calculateRemainingBalance={calculateRemainingBalance}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirmation.isOpen} 
        onOpenChange={(open) => 
          setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir o participante <span className="font-medium">{deleteConfirmation.userName}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
