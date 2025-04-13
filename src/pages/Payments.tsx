import { useState, useEffect } from "react";
import { PLAYERS } from "../utils/mockData";
import PlayerCard from "../components/PlayerCard";
import PaymentStatus from "../components/PaymentStatus";
import { DollarSign, Plus, Check, Calendar, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "../components/ui/use-toast";
const Payments = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"monthly" | "annual">("monthly");
  const [selectedMonth, setSelectedMonth] = useState("current");
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  const handleOpenPaymentModal = (playerId: string) => {
    setSelectedPlayer(playerId);
    setPaymentAmount("");
    setIsPaymentModalOpen(true);
  };
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Pagamento registrado",
        description: `Pagamento de R$ ${paymentAmount} registrado com sucesso.`
      });
      handleClosePaymentModal();
    }, 500);
  };

  // Sort players by payment status (unpaid first) and then by name
  const sortedPlayers = [...PLAYERS].sort((a, b) => {
    if (a.paid === b.paid) {
      return a.name.localeCompare(b.name);
    }
    return a.paid ? 1 : -1;
  });

  // Financial data
  const totalPlayers = PLAYERS.length;
  const monthlyContribution = 10;
  const annualContribution = 90;
  const monthlyTotal = totalPlayers * monthlyContribution;
  const annualTotal = totalPlayers * annualContribution;
  const currentMonthReceived = PLAYERS.filter(p => p.paid).length * monthlyContribution;
  const annualReceived = 300; // Simulated value

  const prizesDistributed = 80; // Simulated value for rewards already distributed
  const availableBalance = annualReceived - prizesDistributed;
  const months = [{
    value: "mar-apr",
    label: "Março/Abril"
  }, {
    value: "may",
    label: "Maio"
  }, {
    value: "jun",
    label: "Junho"
  }, {
    value: "jul",
    label: "Julho"
  }, {
    value: "aug",
    label: "Agosto"
  }, {
    value: "sep",
    label: "Setembro"
  }, {
    value: "oct",
    label: "Outubro"
  }, {
    value: "nov",
    label: "Novembro"
  }, {
    value: "dec",
    label: "Dezembro"
  }, {
    value: "current",
    label: "Mês Atual"
  }];
  return <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-2">Gerenciamento das contribuições, premiações e o saldo financeiro</p>
        </div>

        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden border border-border mb-8 animate-slide-up">
          <button onClick={() => setActiveTab("monthly")} className={`flex-1 py-3 px-4 flex justify-center items-center ${activeTab === "monthly" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/50"}`}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Contribuições Mensais (R${monthlyContribution})</span>
          </button>
          <button onClick={() => setActiveTab("annual")} className={`flex-1 py-3 px-4 flex justify-center items-center ${activeTab === "annual" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/50"}`}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Situação Anual (R${annualContribution})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "monthly" && <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold">Participantes</h2>
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="form-input text-sm">
                      {months.map(month => <option key={month.value} value={month.value}>
                          {month.label}
                        </option>)}
                    </select>
                  </div>
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-goal text-white hover:bg-goal-dark transition-colors shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Participante
                  </button>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      Apenas jogadores com o pagamento em dia para o mês atual podem receber prêmios. Em caso de não pagamento, o prêmio passa para o próximo jogador elegível.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {sortedPlayers.map((player, index) => <div key={player.id} className={`bg-white dark:bg-gray-800 rounded-lg border border-border/40 shadow-subtle overflow-hidden hover:border-border/70 transition-all animate-slide-up flex ${player.paid ? 'opacity-90' : 'opacity-100'}`} style={{
                animationDelay: `${index * 0.05}s`
              }}>
                      <div className="flex-grow p-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{player.name}</h3>
                          {player.paid && <Check className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {player.paid ? `Pago: R$ ${player.paidAmount.toFixed(2)}` : "Pagamento pendente"}
                          </span>
                          <span className="text-sm font-medium">{player.totalPoints} pts</span>
                        </div>
                      </div>
                      
                      {!player.paid && <button onClick={() => handleOpenPaymentModal(player.id)} className="flex items-center justify-center px-4 bg-goal/10 text-goal hover:bg-goal/20 transition-colors">
                          <DollarSign className="h-4 w-4" />
                        </button>}
                    </div>)}
                </div>
              </div>}

            {activeTab === "annual" && <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 animate-slide-up">
                <h2 className="text-xl font-semibold mb-4">Balanço Anual 2025</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Arrecadado</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      R$ {annualReceived.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      de R$ {annualTotal.toFixed(2)} previsto
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Premiações Pagas</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      R$ {prizesDistributed.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      em premiações mensais
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">Saldo Disponível</h3>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                      R$ {availableBalance.toFixed(2)}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">
                      para premiação final
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-border/30 pt-4">
                  <h3 className="font-medium mb-3">Pagamentos Anuais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedPlayers.slice(0, 6).map((player, index) => <div key={player.id} className="flex justify-between items-center p-3 rounded-lg border border-border/40">
                        <div className="flex items-center">
                          <div className={`w-2 h-10 mr-3 rounded-l ${player.paid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {player.paid ? 'Pagamento anual realizado' : 'Pagamento anual pendente'}
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">
                          {player.paid ? 'R$ 90,00' : '-'}
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 overflow-hidden animate-fadeIn">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                  Pagamentos
                </h3>
                
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Valor mensal:</span>
                  <span className="font-semibold">R$ 10,00</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Valor anual:</span>
                  <span className="font-semibold">R$ 90,00</span>
                </div>
                
                <div className="h-px bg-border/40 my-4"></div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Total arrecadado:</span>
                  <span className="font-semibold">R$ {activeTab === "monthly" ? currentMonthReceived.toFixed(2) : annualReceived.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Valor planejado:</span>
                  <span className="font-semibold">R$ {activeTab === "monthly" ? monthlyTotal.toFixed(2) : annualTotal.toFixed(2)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
                  <div className="bg-goal h-2 rounded-full" style={{
                  width: `${activeTab === "monthly" ? currentMonthReceived / monthlyTotal * 100 : annualReceived / annualTotal * 100}%`
                }}></div>
                </div>
                
                <div className="mt-6 border-t pt-4 border-border/30">
                  <button className="w-full py-3 bg-goal hover:bg-goal-dark text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pagar via PIX
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {isPaymentModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full animate-slide-up p-6">
            <h3 className="text-xl font-semibold mb-4">Registrar Pagamento</h3>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Jogador
                </label>
                <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)} className="form-input w-full" required>
                  <option value="" disabled>Selecione um jogador</option>
                  {sortedPlayers.filter(p => !p.paid).map(player => <option key={player.id} value={player.id}>
                      {player.name}
                    </option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor (R$)
                </label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="0,00" step="0.01" min="0" className="form-input w-full" required />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={handleClosePaymentModal} className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted/50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-goal text-white hover:bg-goal-dark transition-colors">
                  Confirmar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
export default Payments;