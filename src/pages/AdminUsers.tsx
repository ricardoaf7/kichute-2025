
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Pencil, Trash2, DollarSign, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import { PLAYERS } from "@/utils/mockData";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Player } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NewParticipantForm } from "@/components/admin/users/NewParticipantForm";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const MONTHLY_FEE = 10; // R$10 per month
const SEASON_TOTAL = 90; // R$90 for the full season (9 months)

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

const AdminUsers = () => {
  const [users, setUsers] = useState<Player[]>(PLAYERS);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(true); // Default to admin mode for now
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    userId: null,
    userName: ""
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('jogadores')
        .select('*');
      
      if (error) {
        console.error("Erro ao buscar participantes:", error);
        toast({
          title: "Erro ao carregar participantes",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Map the database fields to our Player type
      const mappedData = data.map(jogador => ({
        id: jogador.id,
        name: jogador.nome,
        paid: jogador.status_pagamento === 'pago',
        paidAmount: jogador.pagamento_total || 0,
        totalPoints: 0, // Default value as it's not in the database yet
        roundPoints: {}
      }));
      
      setUsers(mappedData);
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
      toast({
        title: "Erro ao carregar participantes",
        description: "Não foi possível carregar a lista de participantes.",
        variant: "destructive"
      });
    }
  };

  // Calculate months paid based on amount
  const calculateMonthsPaid = (amount: number) => {
    return Math.min(Math.floor(amount / MONTHLY_FEE), 9); // Maximum 9 months
  };

  // Calculate remaining balance
  const calculateRemainingBalance = (paidAmount: number) => {
    return Math.max(SEASON_TOTAL - paidAmount, 0);
  };

  // Check if current month is paid
  const isCurrentMonthPaid = (paidAmount: number) => {
    // For simplicity, we'll assume the current month is the number of months since the start of the season
    // In a real app, you'd calculate this based on the current date
    const currentMonth = new Date().getMonth() - 2; // Assuming season starts in March
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

  const handleAddUser = () => {
    if (!isAdminMode) {
      toast({
        title: "Acesso Negado",
        description: "Apenas administradores podem adicionar novos participantes.",
        variant: "destructive"
      });
      return;
    }
    setIsDialogOpen(true);
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
    
    // Open confirmation dialog
    setDeleteConfirmation({
      isOpen: true,
      userId,
      userName
    });
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirmation.userId) return;
    
    try {
      const { error } = await supabase
        .from('jogadores')
        .delete()
        .eq('id', deleteConfirmation.userId);
      
      if (error) {
        console.error("Erro ao excluir participante:", error);
        toast({
          title: "Erro ao excluir",
          description: `Não foi possível excluir ${deleteConfirmation.userName}. ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      // Remove from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteConfirmation.userId));
      
      toast({
        title: "Participante excluído",
        description: `${deleteConfirmation.userName} foi removido com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao excluir participante:", error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro inesperado ao tentar excluir o participante.",
        variant: "destructive"
      });
    } finally {
      // Close confirmation dialog
      setDeleteConfirmation({
        isOpen: false,
        userId: null,
        userName: ""
      });
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
    
    setPaymentDetails({
      userId,
      userName,
      currentPayment
    });
    setPaymentAmount("");
    setIsPaymentDialogOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!paymentDetails || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      toast({
        title: "Erro no pagamento",
        description: "Por favor, insira um valor válido para o pagamento.",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(paymentAmount);
    
    try {
      // Find current user to get their existing payment amount
      const user = users.find(u => u.id === paymentDetails.userId);
      if (!user) return;
      
      const newPaidAmount = user.paidAmount + amount;
      const newStatus = newPaidAmount >= MONTHLY_FEE ? 'pago' : 'pendente';
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('jogadores')
        .update({ 
          pagamento_total: newPaidAmount,
          status_pagamento: newStatus
        })
        .eq('id', paymentDetails.userId);
      
      if (error) {
        console.error("Erro ao atualizar pagamento:", error);
        toast({
          title: "Erro no pagamento",
          description: `Não foi possível registrar o pagamento. ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      // Update the user with the new payment amount
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === paymentDetails.userId) {
            return {
              ...user,
              paidAmount: newPaidAmount,
              paid: newPaidAmount >= MONTHLY_FEE // Paid if at least one month is covered
            };
          }
          return user;
        })
      );
      
      // Close dialog and show success message
      setIsPaymentDialogOpen(false);
      
      toast({
        title: "Pagamento registrado",
        description: `Pagamento de R$ ${amount.toFixed(2)} registrado para ${paymentDetails.userName}.`,
      });
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro inesperado ao tentar registrar o pagamento.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitNewUser = async (newUser: Omit<Player, "id" | "roundPoints" | "paid" | "paidAmount" | "totalPoints"> & { password: string }) => {
    try {
      // Insert the new user into Supabase
      const { data, error } = await supabase
        .from('jogadores')
        .insert({
          nome: newUser.name,
          senha: newUser.password, // Store password (in a real app, this should be hashed)
          status_pagamento: 'pendente',
          pagamento_total: 0
        })
        .select();
      
      if (error) {
        console.error("Erro ao adicionar participante:", error);
        toast({
          title: "Erro ao adicionar",
          description: `Não foi possível adicionar ${newUser.name}. ${error.message}`,
          variant: "destructive"
        });
        return;
      }
      
      // Add the new user to the local state
      if (data && data.length > 0) {
        const addedUser: Player = {
          id: data[0].id,
          name: data[0].nome,
          paid: false,
          paidAmount: 0,
          totalPoints: 0,
          roundPoints: {}
        };
        
        setUsers(prevUsers => [...prevUsers, addedUser]);
      }
      
      setIsDialogOpen(false);
      
      toast({
        title: "Participante adicionado",
        description: `${newUser.name} foi adicionado com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro inesperado ao tentar adicionar o participante.",
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
          
          <Button onClick={handleAddUser}>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status de Pagamento</TableHead>
                  <TableHead>Valor Pago</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      {user.paidAmount >= SEASON_TOTAL ? (
                        <Badge className="bg-green-500">Temporada Completa</Badge>
                      ) : isCurrentMonthPaid(user.paidAmount) ? (
                        <Badge className="bg-green-500">Em Dia</Badge>
                      ) : (
                        <Badge variant="destructive">Em Atraso</Badge>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {getMonthStatus(user.paidAmount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>R$ {user.paidAmount.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          Restante: R$ {calculateRemainingBalance(user.paidAmount).toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.totalPoints}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenPaymentDialog(user.id, user.name, user.paidAmount)}>
                          <DollarSign className="h-4 w-4" />
                          <span className="sr-only">Pagamento</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id, user.name)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
          <NewParticipantForm onSubmit={handleSubmitNewUser} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Informe o valor pago pelo participante.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {paymentDetails && (
              <>
                <div className="mb-4">
                  <p className="font-medium">{paymentDetails.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    Valor já pago: R$ {paymentDetails.currentPayment.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valor restante: R$ {calculateRemainingBalance(paymentDetails.currentPayment).toFixed(2)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Valor do Pagamento (R$)</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    min="0"
                    step="10"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0.00"
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>Valores sugeridos:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPaymentAmount("10")}
                      >
                        R$ 10 (1 mês)
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPaymentAmount("30")}
                      >
                        R$ 30 (3 meses)
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPaymentAmount("90")}
                      >
                        R$ 90 (Temporada completa)
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmitPayment}>
              Registrar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
};

export default AdminUsers;
