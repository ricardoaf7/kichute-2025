
interface KichuteQueryResponse {
  id: string;
  palpite_casa: number | null;
  palpite_visitante: number | null;
  pontos: number | null;
  jogador_id: string;
  partida_id: string;
  jogador: {
    id: string;
    nome: string;
  } | null;
  partida: {
    id: string;
    rodada: number;
    placar_casa: number | null;
    placar_visitante: number | null;
    time_casa: {
      nome: string;
      sigla: string;
    } | null;
    time_visitante: {
      nome: string;
      sigla: string;
    } | null;
  } | null;
}

export type { KichuteQueryResponse };
