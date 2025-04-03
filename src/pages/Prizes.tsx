
import { useState, useEffect } from "react";
import { PRIZES, PLAYERS } from "../utils/mockData";
import { Calendar, DollarSign, Check, X, Plus, Trophy } from "lucide-react";
import { toast } from "../components/ui/use-toast";

const Prizes = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [prizeType, setPrizeType] = useState<"monthly" | "annual">("monthly");

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

  const annualPrizes = [
    {
      id: "annual-1",
      position: 1,
      percentage: 50,
      estimatedValue: 450.00,
      player: PLAYERS[2], // Cortez
      paid: false
    },
    {
      id: "annual-2",
      position: 2,
      percentage: 30,
      estimatedValue: 270.00,
      player: PLAYERS[0], // Álvaro
      paid: false
    },
    {
      id: "annual-3",
      position: 3,
      percentage: 20,
      estimatedValue: 180.00,
      player: PLAYERS[5], // Uemura
      paid: false
    }
  ];

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Premiações</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe as premiações mensais e anuais
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">Histórico de Premiações</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <label htmlFor="year-select" className="text-sm font-medium">
                  Ano:
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="form-input"
                >
                  <option value="2025">2025</option>
                </select>
              </div>
              
              <div className="flex rounded-md overflow-hidden border border-border">
                <button
                  onClick={() => setPrizeType("monthly")}
                  className={`px-3 py-1.5 text-sm ${
                    prizeType === "monthly"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Mensal (R$40,00)
                </button>
                <button
                  onClick={() => setPrizeType("annual")}
                  className={`px-3 py-1.5 text-sm ${
                    prizeType === "annual"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Anual
                </button>
              </div>
            </div>
          </div>
        </div>

        {prizeType === "monthly" ? (
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
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 overflow-hidden">
            <div className="border-b border-border/40 p-4">
              <h3 className="font-semibold text-xl flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                Premiação Anual 2025
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Distribuição do saldo financeiro ao final do ano
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {annualPrizes.map((prize) => (
                  <div 
                    key={prize.id}
                    className="flex justify-between items-center p-4 border border-border/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${
                        prize.position === 1 ? 'bg-amber-100 text-amber-800' :
                        prize.position === 2 ? 'bg-gray-100 text-gray-800' :
                        'bg-amber-700/20 text-amber-700'
                      } flex items-center justify-center font-bold`}>
                        {prize.position}º
                      </div>
                      <div>
                        <p className="font-medium">{prize.player.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {prize.percentage}% do saldo final (~R$ {prize.estimatedValue.toFixed(2)})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-muted-foreground mr-2">Status:</span>
                      {prize.paid ? (
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                          <X className="mr-1 h-3 w-3" />
                          Aguardando fim do ano
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-amber-800 dark:text-amber-200">Regras da Premiação Anual</h4>
                <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-amber-700 dark:text-amber-300">
                  <li>1º colocado: 50% do saldo financeiro</li>
                  <li>2º colocado: 30% do saldo financeiro</li>
                  <li>3º colocado: 20% do saldo financeiro</li>
                  <li>Somente participantes que pagaram o ano completo concorrem à premiação anual</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prizes;
