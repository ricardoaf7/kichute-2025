import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Regras de pontuação
const regras = {
  exactScore: 7,
  correctDifferenceOrDraw: 4,
  correctWinner: 2,
};

function calcularPontuacao(palpite: any, resultado: any): number {
  if (
    resultado.placar_casa === null ||
    resultado.placar_fora === null
  ) return 0;

  if (
    palpite.palpite_casa === resultado.placar_casa &&
    palpite.palpite_visitante === resultado.placar_fora
  ) return regras.exactScore;

  const diffPalpite = palpite.palpite_casa - palpite.palpite_visitante;
  const diffResultado = resultado.placar_casa - resultado.placar_fora;

  const vencedorPalpite = palpite.palpite_casa > palpite.palpite_visitante
    ? 'casa' : palpite.palpite_casa < palpite.palpite_visitante
    ? 'fora' : 'empate';

  const vencedorReal = resultado.placar_casa > resultado.placar_fora
    ? 'casa' : resultado.placar_casa < resultado.placar_fora
    ? 'fora' : 'empate';

  if (
    vencedorPalpite === vencedorReal &&
    diffPalpite === diffResultado
  ) return regras.correctDifferenceOrDraw;

  if (vencedorPalpite === vencedorReal)
    return regras.correctWinner;

  return 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rodada = 1; // ou req.query.rodada para receber por parâmetro futuramente

    const { data: partidas, error: erroPartidas } = await supabase
      .from("partidas")
      .select("id, placar_casa, placar_fora, rodada")
      .eq("rodada", rodada);

    if (erroPartidas || !partidas) {
      return res.status(500).json({ error: "Erro ao buscar partidas", detalhes: erroPartidas });
    }

    const { data: palpites, error: erroPalpites } = await supabase
      .from("kichutes")
      .select("*")
      .in("partida_id", partidas.map((p) => p.id));

    if (erroPalpites || !palpites) {
      return res.status(500).json({ error: "Erro ao buscar palpites", detalhes: erroPalpites });
    }

    const updates = palpites.map(async (palpite) => {
      const resultado = partidas.find(p => p.id === palpite.partida_id);
      const pontos = resultado ? calcularPontuacao(palpite, resultado) : 0;

      return supabase
        .from("kichutes")
        .update({ pontos })
        .eq("id", palpite.id);
    });

    await Promise.all(updates);

    return res.status(200).json({ mensagem: "Pontuações atualizadas com sucesso!" });
  } catch (erro) {
    return res.status(500).json({ error: "Erro inesperado", detalhes: erro });
  }
}
