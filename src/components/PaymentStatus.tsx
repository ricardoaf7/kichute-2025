
import { Player } from "../types";
import { Check, X } from "lucide-react";

interface PaymentStatusProps {
  players: Player[];
  totalCost: number;
}

const PaymentStatus = ({ players, totalCost }: PaymentStatusProps) => {
  const totalPaid = players.reduce((sum, player) => sum + (player.paid ? player.paidAmount : 0), 0);
  const percentPaid = Math.round((totalPaid / totalCost) * 100);
  
  const paidPlayers = players.filter(player => player.paid);
  const pendingPlayers = players.filter(player => !player.paid);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 overflow-hidden animate-fadeIn">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Status de Pagamentos</h3>
        
        <div className="flex justify-between mb-2">
          <span className="text-muted-foreground">Total arrecadado:</span>
          <span className="font-semibold">R$ {totalPaid.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-4">
          <span className="text-muted-foreground">Valor planejado:</span>
          <span className="font-semibold">R$ {totalCost.toFixed(2)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
          <div 
            className="bg-goal h-2 rounded-full"
            style={{ width: `${percentPaid}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>{paidPlayers.length} de {players.length} pagos</span>
          <span className="font-medium">{percentPaid}%</span>
        </div>
        
        <div className="mt-6 border-t pt-4 border-border/30">
          <h4 className="font-semibold mb-3 flex items-center">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            Pagamentos Confirmados
          </h4>
          
          <div className="space-y-2">
            {paidPlayers.map(player => (
              <div key={player.id} className="flex justify-between items-center py-1 px-2 bg-green-50 rounded dark:bg-green-900/20">
                <span>{player.name}</span>
                <span className="font-medium">R$ {player.paidAmount.toFixed(2)}</span>
              </div>
            ))}
            
            {paidPlayers.length === 0 && (
              <div className="text-muted-foreground text-sm italic">Nenhum pagamento confirmado</div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <X className="w-4 h-4 mr-2 text-red-500" />
            Pagamentos Pendentes
          </h4>
          
          <div className="space-y-2">
            {pendingPlayers.map(player => (
              <div key={player.id} className="flex justify-between items-center py-1 px-2 bg-red-50 rounded dark:bg-red-900/20">
                <span>{player.name}</span>
                <span className="text-red-500 font-medium">Pendente</span>
              </div>
            ))}
            
            {pendingPlayers.length === 0 && (
              <div className="text-muted-foreground text-sm italic">Não há pagamentos pendentes</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
