import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const apiKey = Deno.env.get("API_FOOTBALL_KEY");
    if (!apiKey) {
      throw new Error("API_FOOTBALL_KEY não está configurada");
    }

    let endpoint, league, season, round;

    if (req.method === "GET") {
      const url = new URL(req.url);
      endpoint = url.searchParams.get("endpoint") || "fixtures";
      league = url.searchParams.get("league") || "71";
      season = url.searchParams.get("season") || "2024";
      round = url.searchParams.get("round");
    } else if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      endpoint = body.endpoint || "fixtures";
      league = body.league || "71";
      season = body.season || "2024";
      round = body.round;
      console.log("Corpo da requisição POST:", body);
    }

    console.log(`Parâmetros: endpoint=${endpoint}, league=${league}, season=${season}, round=${round}`);

    let apiUrl = `https://api-football-v1.p.rapidapi.com/v3/${endpoint}`;
    if (endpoint === "fixtures") {
      apiUrl += `?league=${league}&season=${season}`;
      if (round) {
        apiUrl += `&round=${round}`;
      }
    } else if (endpoint === "rounds") {
      apiUrl += `?league=${league}&season=${season}`;
    }

    console.log(`Chamando API: ${apiUrl}`);

    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`Erro na API: ${apiResponse.status} ${apiResponse.statusText}`);
      console.error(`Resposta de erro: ${errorText}`);
      throw new Error(`Erro na API: ${apiResponse.status} ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    console.log("Resposta da API recebida com sucesso");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro:", error.message);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
