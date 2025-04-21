
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCurrentRound = () => {
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentRound = async () => {
      setIsLoading(true);
      try {
        // Buscar todas as partidas ordenadas por rodada
        const { data, error } = await supabase
          .from("partidas")
          .select("rodada, data")
          .order("data", { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          // Se não houver partidas, a rodada atual é 1
          setCurrentRound(1);
          return;
        }

        // Agrupar partidas por rodada
        const matchesByRound = data.reduce((acc, match) => {
          const round = match.rodada;
          if (!acc[round]) {
            acc[round] = [];
          }
          acc[round].push(match);
          return acc;
        }, {});

        // Obter a data atual
        const now = new Date();

        // Encontrar a próxima rodada que ainda não começou
        let nextRound = 1;
        let foundNextRound = false;

        // Ordenar as rodadas numericamente
        const sortedRounds = Object.keys(matchesByRound)
          .map(Number)
          .sort((a, b) => a - b);

        for (const round of sortedRounds) {
          const matches = matchesByRound[round];
          // Verificar se todas as partidas da rodada já aconteceram
          const allMatchesPlayed = matches.every(match => new Date(match.data) < now);

          if (!allMatchesPlayed) {
            // Se nem todas as partidas aconteceram, esta é a próxima rodada
            nextRound = round;
            foundNextRound = true;
            break;
          }
        }

        // Se todas as rodadas já aconteceram, a rodada atual é a última
        if (!foundNextRound && sortedRounds.length > 0) {
          nextRound = sortedRounds[sortedRounds.length - 1];
        }

        setCurrentRound(nextRound);
      } catch (err) {
        console.error("Erro ao determinar a rodada atual:", err);
        // Em caso de erro, usar rodada 1 como fallback
        setCurrentRound(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentRound();
  }, []);

  return { currentRound, isLoading };
};
