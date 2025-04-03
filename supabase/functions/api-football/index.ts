
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
    // Configurar cliente Supabase usando variáveis de ambiente
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const apiKey = Deno.env.get("API_FOOTBALL_KEY");
    if (!apiKey) {
      throw new Error("API_FOOTBALL_KEY não está configurada");
    }

    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint") || "fixtures";
    const league = url.searchParams.get("league") || "71"; // ID da liga brasileira
    const season = url.searchParams.get("season") || "2024";
    const round = url.searchParams.get("round") || "Regular Season - 1";

    // Construir a URL da API
    let apiUrl = `https://api-football-v1.p.rapidapi.com/v3/${endpoint}`;
    
    // Adicionar parâmetros conforme o endpoint
    if (endpoint === "fixtures") {
      apiUrl += `?league=${league}&season=${season}`;
      if (round) {
        apiUrl += `&round=${round}`;
      }
    } else if (endpoint === "rounds") {
      apiUrl += `?league=${league}&season=${season}`;
    }

    console.log(`Chamando API: ${apiUrl}`);

    // Fazer requisição à API-Football
    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`Erro na API: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();

    // Retornar dados da API
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
