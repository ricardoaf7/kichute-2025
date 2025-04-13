
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Player {
  id: string;
  nome: string;
}

interface PaymentsFilterProps {
  onPlayerChange: (playerId: string | null) => void;
  onMonthChange: (month: string | null) => void;
  onStatusChange: (status: string | null) => void;
}

// Array de meses para o filtro
const months = [
  { value: "janeiro", label: "Janeiro" },
  { value: "fevereiro", label: "Fevereiro" },
  { value: "março", label: "Março" },
  { value: "abril", label: "Abril" },
  { value: "maio", label: "Maio" },
  { value: "junho", label: "Junho" },
  { value: "julho", label: "Julho" },
  { value: "agosto", label: "Agosto" },
  { value: "setembro", label: "Setembro" },
  { value: "outubro", label: "Outubro" },
  { value: "novembro", label: "Novembro" },
  { value: "dezembro", label: "Dezembro" },
];

const PaymentsFilter: React.FC<PaymentsFilterProps> = ({
  onPlayerChange,
  onMonthChange,
  onStatusChange,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("jogadores")
          .select("id, nome")
          .order("nome");

        if (error) throw error;
        
        setPlayers(data || []);
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="space-y-2">
        <Label htmlFor="player-filter">Jogador</Label>
        <Select onValueChange={(value) => onPlayerChange(value === "all" ? null : value)}>
          <SelectTrigger id="player-filter" className="w-full">
            <SelectValue placeholder="Todos os jogadores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os jogadores</SelectItem>
            {players.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                {player.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="month-filter">Mês</Label>
        <Select onValueChange={(value) => onMonthChange(value === "all" ? null : value)}>
          <SelectTrigger id="month-filter" className="w-full">
            <SelectValue placeholder="Todos os meses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os meses</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status-filter">Status</Label>
        <Select onValueChange={(value) => onStatusChange(value === "all" ? null : value)}>
          <SelectTrigger id="status-filter" className="w-full">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Pago">Pago</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PaymentsFilter;
