
import { Kichute } from "@/types/kichute";
import { KichuteQueryResponse } from "@/types/supabase-responses";
import { calculatePoints } from "./scoring";

export const formatKichuteData = (data: KichuteQueryResponse[]): Kichute[] => {
  return (data || []).map(item => {
    // Dados brutos para cálculo de pontos
    const palpiteCasa = item.palpite_casa || 0;
    const palpiteVisitante = item.palpite_visitante || 0;
    const placarCasa = item.partida?.placar_casa;
    const placarVisitante = item.partida?.placar_visitante;
    
    // Calcular pontos se tiver resultado da partida
    let pontos = 0;
    if (placarCasa !== null && placarVisitante !== null) {
      pontos = calculatePoints(
        { homeScore: palpiteCasa, awayScore: palpiteVisitante },
        { homeScore: placarCasa, awayScore: placarVisitante }
      );
    } else if (item.pontos !== null && item.pontos !== undefined) {
      // Se não tem resultado, usa pontos do banco de dados se disponível
      pontos = Number(item.pontos);
    }

    return {
      id: item.id,
      rodada: item.partida?.rodada ?? 0,
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
      palpite_casa: palpiteCasa,
      palpite_visitante: palpiteVisitante,
      pontos: pontos
    };
  });
};

export const sortKichutes = (kichutes: Kichute[]): Kichute[] => {
  return [...kichutes].sort((a, b) => {
    if (a.rodada !== b.rodada) {
      return a.rodada - b.rodada;
    }
    return b.pontos - a.pontos;
  });
};
