import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// 🔒 CHAVE FIXA (provisória para testes)
const API_KEY = "f91f9fd1e1b1d1766166ed7948bbf151";

serve(async (req) => {
  const url = new URL(req.url);

  // Pega o endpoint e remove dos parâmetros
  const endpoint = url.searchParams.get("endpoint") || "fixtures";
  url.searchParams.delete("endpoint");

  // Monta a query string
  const queryString = url.searchParams.toString();
  const apiUrl = `https://v3.football.api-sports.io/${endpoint}?${queryString}`;

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-apisports-key": API_KEY,
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
