
import { useState, useEffect } from "react";
import { PLAYERS } from "../utils/mockData";
import PlayerCard from "../components/PlayerCard";
import PaymentStatus from "../components/PaymentStatus";
import { DollarSign, Plus, Check } from "lucide-react";
import { toast } from "../components/ui/use-toast";

const Payments = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
        description: `Pagamento de R$ ${paymentAmount} registrado com sucesso.`,
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

  // Calculate the total cost (assuming each player pays the same amount)
  const playerCost = 30; // Cost per player
  const totalCost = PLAYERS.length * playerCost;

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Pagamentos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os pagamentos dos participantes do bolão
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Participantes</h2>
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-goal text-white hover:bg-goal-dark transition-colors shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Participante
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {sortedPlayers.map((player, index) => (
                  <div 
                    key={player.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg border border-border/40 shadow-subtle overflow-hidden hover:border-border/70 transition-all animate-slide-up flex ${player.paid ? 'opacity-90' : 'opacity-100'}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
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
                    
                    {!player.paid && (
                      <button 
                        onClick={() => handleOpenPaymentModal(player.id)}
                        className="flex items-center justify-center px-4 bg-goal/10 text-goal hover:bg-goal/20 transition-colors"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <PaymentStatus players={PLAYERS} totalCost={totalCost} />
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full animate-slide-up p-6">
            <h3 className="text-xl font-semibold mb-4">Registrar Pagamento</h3>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Jogador
                </label>
                <select 
                  value={selectedPlayer} 
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="form-input w-full"
                  required
                >
                  <option value="" disabled>Selecione um jogador</option>
                  {sortedPlayers.filter(p => !p.paid).map(player => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor (R$)
                </label>
                <input 
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  className="form-input w-full"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button"
                  onClick={handleClosePaymentModal}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-goal text-white hover:bg-goal-dark transition-colors"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
