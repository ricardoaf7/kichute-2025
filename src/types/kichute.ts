
export interface Kichute {
  id: string;
  rodada: number;
  partida: {
    id: string;
    time_casa: { nome: string; sigla: string };
    time_visitante: { nome: string; sigla: string };
    placar_casa: number | null;
    placar_visitante: number | null;
  };
  jogador: { id: string; nome: string };
  palpite_casa: number;
  palpite_visitante: number;
  pontos: number;
}

