
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KichuteFiltersProps {
  selectedRodada: string;
  selectedJogador: string;
  onRodadaChange: (value: string) => void;
  onJogadorChange: (value: string) => void;
}

export const KichuteFilters = ({
  selectedRodada,
  selectedJogador,
  onRodadaChange,
  onJogadorChange,
}: KichuteFiltersProps) => {
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [jogadores, setJogadores] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    const fetchRodadas = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) throw error;
        
        const uniqueRodadas = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setRodadas(uniqueRodadas);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
      }
    };

    const fetchJogadores = async () => {
      try {
        const { data, error } = await supabase
          .from('jogadores')
          .select('id, nome')
          .order('nome');
        
        if (error) throw error;
        
        setJogadores(data || []);
      } catch (err) {
        console.error("Erro ao buscar jogadores:", err);
      }
    };

    fetchRodadas();
    fetchJogadores();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="rodada-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rodada:
        </label>
        <Select value={selectedRodada} onValueChange={onRodadaChange}>
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
        <label htmlFor="jogador-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Jogador:
        </label>
        <Select value={selectedJogador} onValueChange={onJogadorChange}>
          <SelectTrigger id="jogador-select" className="w-[200px]">
            <SelectValue placeholder="Selecionar jogador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os jogadores</SelectItem>
            {jogadores.map(jogador => (
              <SelectItem key={jogador.id} value={jogador.id}>
                {jogador.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

