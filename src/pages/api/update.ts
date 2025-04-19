// api/update.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  const resultadoEmpate = resultado.placar_casa === resultado.placar_fora;
  const palpiteEmpate = palpite.palpite_casa === palpite.palpite_visitante;

  if (
    (resultadoEmpate && palpiteEmpate) ||
    (diffPalpite === diffResultado &&
      Math.sign(palpite.palpite_casa - palpite.palpite_visitante) ===
        Math.sign(resultado.placar_casa - resultado.placar_fora))
  ) {
    return regras.correctDifferenceOrDraw;
  }

  const vencedorPalpite = palpite.palpite_casa > palpite.palpite_visitante ? "casa" :
                          palpite.palpite_casa < palpite.palpite_visitante ? "fora" : "empate";
  const vencedorReal = resultado.placar_casa > resultado.placar_fora ? "casa" :
                       resultado.placar_casa < resultado.placar_fora ? "fora" : "empate";

  if (vencedorPalpite === vencedorReal) return regras.correctWinner;

  return 0;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    const rodada = 1;

    const { data: partidas, error: erroPartidas } = await supabase
      .from("partidas")
      .select("id, placar_casa, placar_fora, rodada")
      .eq("rodada", rodada);

    if (erroPartidas || !partidas) {
      return new Response(JSON.stringify({ erro: "Erro ao buscar partidas", detalhes: erroPartidas }), {
        status: 500,
      });
    }

    const { data: palpites, error: erroPalpites } = await supabase
      .from("kichutes")
      .select("*")
      .in("partida_id", partidas.map((p) => p.id));

    if (erroPalpites || !palpites) {
      return new Response(JSON.stringify({ erro: "Erro ao buscar palpites", detalhes: erroPalpites }), {
        status: 500,
      });
    }

    const atualizacoes = palpites.map(async (palpite) => {
      const partida = partidas.find((p) => p.id === palpite.partida_id);
      if (!partida) return null;

      const pontos = calcularPontuacao(palpite, partida);

      return supabase
        .from("kichutes")
        .update({ pontos })
        .eq("id", palpite.id);
    });

    await Promise.all(atualizacoes);

    return new Response(
      JSON.stringify({ mensagem: "Pontuação da rodada 1 atualizada com sucesso!" }),
      { status: 200 }
    );
  } catch (erro) {
    return new Response(JSON.stringify({ erro: "Erro geral", detalhes: erro }), {
      status: 500,
    });
  }
}
