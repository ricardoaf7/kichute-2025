
import { Kichute } from "@/types/kichute";
import { KichuteQueryResponse } from "@/types/supabase-responses";

export const formatKichuteData = (data: KichuteQueryResponse[]): Kichute[] => {
  return (data || []).map(item => ({
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
    palpite_casa: item.palpite_casa || 0,
    palpite_visitante: item.palpite_visitante || 0,
    pontos: Number(item.pontos) || 0
  }));
};

export const sortKichutes = (kichutes: Kichute[]): Kichute[] => {
  return [...kichutes].sort((a, b) => {
    if (a.rodada !== b.rodada) {
      return a.rodada - b.rodada;
    }
    return b.pontos - a.pontos;
  });
};
