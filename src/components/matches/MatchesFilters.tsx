
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchesFiltersProps {
  selectedRodada: string;
  setSelectedRodada: (value: string) => void;
  selectedTime: string;
  setSelectedTime: (value: string) => void;
}

const MatchesFilters = ({ 
  selectedRodada, 
  setSelectedRodada, 
  selectedTime, 
  setSelectedTime 
}: MatchesFiltersProps) => {
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [times, setTimes] = useState<{ id: string; nome: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Buscar rodadas disponíveis
  useEffect(() => {
    const fetchRodadas = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) throw error;
        
        // Extrair rodadas únicas
        const uniqueRodadas = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setRodadas(uniqueRodadas);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        setError("Não foi possível carregar as rodadas");
      }
    };

    fetchRodadas();
  }, []);

  // Buscar times
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const { data, error } = await supabase
          .from('times')
          .select('id, nome')
          .order('nome');
        
        if (error) throw error;
        
        setTimes(data || []);
      } catch (err) {
        console.error("Erro ao buscar times:", err);
        setError("Não foi possível carregar os times");
      }
    };

    fetchTimes();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="rodada-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rodada:
        </label>
        <Select value={selectedRodada} onValueChange={setSelectedRodada}>
          <SelectTrigger id="rodada-select" className="w-[160px]">
            <SelectValue placeholder="Selecionar rodada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as rodadas</SelectItem>
            {rodadas.map(rodada => (
              <SelectItem key={`rodada-${rodada}`} value={rodada.toString()}>
                Rodada {rodada}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="time-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time:
        </label>
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger id="time-select" className="w-[200px]">
            <SelectValue placeholder="Selecionar time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os times</SelectItem>
            {times.map(time => (
              <SelectItem key={time.id} value={time.id}>
                {time.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MatchesFilters;
