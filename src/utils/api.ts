import { Match, Round, Team } from "../types";

interface ApiFootballResponse {
  response: any[];
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
}

interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    timestamp: number;
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

// Função para testar a função Edge Function do Supabase
export async function testApiFootballFunction(): Promise<boolean> {
  try {
    console.log("Testando conexão com API-Football...");
    
    // Usando a URL correta para a função Edge do Supabase
    const response = await fetch(`${window.location.origin}/functions/v1/api-football?endpoint=rounds&league=71&season=2024`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Resposta da API:", data);
    
    // Verifica se a resposta possui o formato esperado
    if (data && 'response' in data) {
      console.log("Conexão com API-Football estabelecida com sucesso!");
      return true;
    } else {
      console.error("Formato de resposta inválido:", data);
      return false;
    }
  } catch (error) {
    console.error("Erro ao testar API-Football:", error);
    return false;
  }
}

// Função para buscar rodadas do campeonato
export async function fetchRounds(season: string = "2024", league: string = "71"): Promise<string[]> {
  try {
    const response = await fetch(
      `${window.location.origin}/functions/v1/api-football?endpoint=rounds&league=${league}&season=${season}`
    );
    
    if (!response.ok) {
      throw new Error("Falha ao buscar rodadas");
    }
    
    const data: ApiFootballResponse = await response.json();
    return data.response || [];
  } catch (error) {
    console.error("Erro ao buscar rodadas:", error);
    return [];
  }
}

// Função para buscar partidas de uma rodada específica
export async function fetchFixtures(
  round: string,
  season: string = "2024",
  league: string = "71"
): Promise<Match[]> {
  try {
    // Formatar o round conforme API-Football (ex: "Regular Season - 1")
    const formattedRound = `Regular Season - ${round}`;
    
    const response = await fetch(
      `${window.location.origin}/functions/v1/api-football?endpoint=fixtures&league=${league}&season=${season}&round=${encodeURIComponent(formattedRound)}`
    );
    
    if (!response.ok) {
      throw new Error("Falha ao buscar partidas");
    }
    
    const data: ApiFootballResponse = await response.json();
    
    // Converter os dados da API para o formato da nossa aplicação
    return (data.response || []).map((fixture: ApiFootballFixture) => {
      const homeTeam: Team = {
        id: fixture.teams.home.id.toString(),
        name: fixture.teams.home.name,
        shortName: getTeamShortName(fixture.teams.home.name),
      };
      
      const awayTeam: Team = {
        id: fixture.teams.away.id.toString(),
        name: fixture.teams.away.name,
        shortName: getTeamShortName(fixture.teams.away.name),
      };
      
      // Extrair o número da rodada da string "Regular Season - X"
      const roundNumber = parseInt(fixture.league.round.split(" - ")[1]) || 1;
      
      return {
        id: fixture.fixture.id.toString(),
        round: roundNumber,
        homeTeam,
        awayTeam,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away,
        date: fixture.fixture.date,
        played: fixture.fixture.status.short === "FT", // FT = Finished
        stadium: fixture.fixture.venue.name,
        city: fixture.fixture.venue.city,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return [];
  }
}

// Função para obter o nome curto do time
function getTeamShortName(fullName: string): string {
  const shortNames: Record<string, string> = {
    "Atlético Mineiro": "CAM",
    "Athletico Paranaense": "CAP",
    "Atletico-PR": "CAP",
    "Atlético-PR": "CAP",
    "Bahia": "BAH",
    "Botafogo": "BOT",
    "Corinthians": "COR",
    "Cruzeiro": "CRU",
    "Cuiabá": "CUI",
    "Flamengo": "FLA",
    "Fluminense": "FLU",
    "Fortaleza": "FOR",
    "Grêmio": "GRE",
    "Gremio": "GRE",
    "Internacional": "INT",
    "Juventude": "JUV",
    "Palmeiras": "PAL",
    "Red Bull Bragantino": "RBB",
    "Bragantino": "RBB",
    "São Paulo": "SAO",
    "Sao Paulo": "SAO",
    "Vasco da Gama": "VAS",
    "Vasco": "VAS",
    "Vitória": "VIT",
    "Vitoria": "VIT",
    "Criciúma": "CRI",
    "Criciuma": "CRI",
    "Atlético Goianiense": "ACG",
    "Atletico-GO": "ACG",
  };
  
  return shortNames[fullName] || fullName.substring(0, 3).toUpperCase();
}

// Função para agrupar partidas por rodada
export function groupMatchesByRound(matches: Match[]): Round[] {
  const rounds: Record<number, Round> = {};
  
  // Agrupar partidas por rodada
  matches.forEach((match) => {
    if (!rounds[match.round]) {
      // Para calcular um prazo adequado para palpites, usamos a data da primeira partida da rodada
      const matchDate = new Date(match.date);
      // Definir o prazo como 1 minuto antes da primeira partida da rodada
      const deadlineDate = new Date(matchDate.getTime() - 60000); // -1 minuto
      
      rounds[match.round] = {
        number: match.round,
        matches: [],
        closed: new Date() > deadlineDate,
        deadline: deadlineDate.toISOString(),
      };
    }
    
    rounds[match.round].matches.push(match);
  });
  
  // Ordenar rodadas por número
  return Object.values(rounds).sort((a, b) => a.number - b.number);
}
