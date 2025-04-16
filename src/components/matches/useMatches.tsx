
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  nome: string;
  sigla: string;
}

interface Match {
  id: string;
  rodada: number;
  data: string;
  local: string;
  time_casa: Team;
  time_visitante: Team;
  placar_casa: number | null;
  placar_visitante: number | null;
}

export const useMatches = (selectedRodada: string, selectedTime: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar partidas com filtros
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('partidas')
          .select(`
            id,
            rodada,
            data,
            local,
            placar_casa,
            placar_visitante,
            time_casa:times!time_casa_id(id, nome, sigla),
            time_visitante:times!time_visitante_id(id, nome, sigla)
          `);
        
        // Aplicar filtro de rodada se selecionado
        if (selectedRodada !== "todas") {
          query = query.eq('rodada', parseInt(selectedRodada));
        }
        
        // Aplicar filtro de time se selecionado
        if (selectedTime !== "todos") {
          query = query.or(`time_casa_id.eq.${selectedTime},time_visitante_id.eq.${selectedTime}`);
        }
        
        // Ordenar por rodada e data
        query = query.order('rodada').order('data');
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        console.log("Dados brutos das partidas:", data);
        
        // Formatar os dados para o formato necessário para a tabela
        const formattedData = (data || []).map(item => ({
          id: item.id,
          rodada: item.rodada,
          data: item.data,
          local: item.local || 'A definir',
          time_casa: {
            id: item.time_casa?.id || '',
            nome: item.time_casa?.nome || 'N/A',
            sigla: item.time_casa?.sigla || 'N/A'
          },
          time_visitante: {
            id: item.time_visitante?.id || '',
            nome: item.time_visitante?.nome || 'N/A',
            sigla: item.time_visitante?.sigla || 'N/A'
          },
          placar_casa: item.placar_casa,
          placar_visitante: item.placar_visitante
        }));
        
        console.log("Dados formatados das partidas:", formattedData);
        
        setMatches(formattedData);
      } catch (err) {
        console.error("Erro ao buscar partidas:", err);
        setError("Não foi possível carregar as partidas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedRodada, selectedTime]);

  return { matches, isLoading, error };
};
