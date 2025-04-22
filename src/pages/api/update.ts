
// This file was previously importing Next.js types, which aren't compatible with this project
// Let's replace it with a simple API handler

export interface RequestParams {
  rodada?: string;
}

export default async function handler(req: any, res: any) {
  const params = req.query as RequestParams;
  
  // Simple response
  return { mensagem: "Funcionando!", rodada: params.rodada };
}
