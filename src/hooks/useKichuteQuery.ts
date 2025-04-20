// src/hooks/useKichuteQuery.ts

import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { KichuteQueryResponse } from "@/types/supabase-responses";

export const useKichuteQuery = () => {
  const fetchKichutes = useCallback(
    async (selectedRodada: string, selectedJogador: string) => {
      let query = supabase
        .from("kichutes")
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

      // *** FILTRO CORRIGIDO usando o alias 'partida' ***
      if (selectedRodada !== "todas") {
        query = query.eq("partida.rodada", parseInt(selectedRodada, 10));
      }

      if (selectedJogador !== "todos") {
        query = query.eq("jogador_id", selectedJogador);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as KichuteQueryResponse[];
    },
    []
  );

  return { fetchKichutes };
};
