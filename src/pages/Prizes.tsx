
import { useState, useEffect } from "react";
import { PRIZES, PLAYERS } from "../utils/mockData";
import { Calendar, DollarSign, Check, X, Plus } from "lucide-react";
import { toast } from "../components/ui/use-toast";

const Prizes = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAsPaid = (prizeId: string) => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Premiação atualizada",
        description: "Status de pagamento atualizado com sucesso.",
      });
    }, 500);
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Premiações</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os vencedores e premiações de cada mês
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 mb-8 animate-slide-up">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Histórico de Premiações</h2>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-goal text-white hover:bg-goal-dark transition-colors shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Premiação
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRIZES.map((prize, index) => (
            <div 
              key={prize.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="border-b border-border/40 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{prize.month}</h3>
                </div>
                <div className="text-lg font-bold text-goal">
                  R$ {prize.amount.toFixed(2)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vencedor</p>
                    <p className="font-medium">{prize.player.name}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-goal/10 flex items-center justify-center">
                    <span className="text-goal font-bold">{prize.player.totalPoints}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {prize.paid ? (
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Pago
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                        <X className="mr-1 h-3 w-3" />
                        Pendente
                      </span>
                    )}
                  </div>
                  
                  {!prize.paid && (
                    <button 
                      onClick={() => handleMarkAsPaid(prize.id)}
                      className="inline-flex items-center text-xs px-2 py-1 font-medium rounded-md bg-goal/10 text-goal hover:bg-goal/20 transition-colors"
                    >
                      <DollarSign className="mr-1 h-3 w-3" />
                      Marcar como pago
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prizes;
