
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Kichute } from "@/types/kichute";

export const useKichuteData = (selectedRodada: string, selectedJogador: string) => {
  const [kichutes, setKichutes] = useState<Kichute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKichutes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('kichutes')
          .select(`
            id,
            palpite_casa,
            palpite_visitante,
            pontos,
            jogador_id,
            partida_id,
            jogador:jogadores(id, nome),
            partida:partidas(
              id,
              rodada,
              placar_casa,
              placar_visitante,
              time_casa:times!time_casa_id(nome, sigla),
              time_visitante:times!time_visitante_id(nome, sigla)
            )
          `);
        
        if (selectedRodada !== "todas") {
          query = query.eq('partida.rodada', parseInt(selectedRodada));
        }
        
        if (selectedJogador !== "todos") {
          query = query.eq('jogador_id', selectedJogador);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const formattedData = (data || []).map(item => ({
          id: item.id,
          rodada: item.partida?.rodada,
          partida: {
            id: item.partida_id,
            time_casa: {
              nome: item.partida?.time_casa?.nome || 'N/A',
              sigla: item.partida?.time_casa?.sigla || 'N/A'
            },
            time_visitante: {
              nome: item.partida?.time_visitante?.nome || 'N/A',
              sigla: item.partida?.time_visitante?.sigla || 'N/A'
            },
            placar_casa: item.partida?.placar_casa,
            placar_visitante: item.partida?.placar_visitante
          },
          jogador: {
            id: item.jogador_id,
            nome: item.jogador?.nome || 'N/A'
          },
          palpite_casa: item.palpite_casa || 0,
          palpite_visitante: item.palpite_visitante || 0,
          pontos: Number(item.pontos) || 0
        }));
        
        formattedData.sort((a, b) => {
          if (a.rodada !== b.rodada) {
            return a.rodada - b.rodada;
          }
          return b.pontos - a.pontos;
        });
        
        setKichutes(formattedData);
      } catch (err) {
        console.error("Erro ao buscar kichutes:", err);
        setError("Não foi possível carregar os kichutes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKichutes();
  }, [selectedRodada, selectedJogador]);

  return { kichutes, isLoading, error };
};

