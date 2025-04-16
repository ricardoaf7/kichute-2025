
import { Match, Round, Team } from "@/types";

/**
 * Transforms a raw Supabase match record into the application's match format
 */
export const transformMatchFromSupabase = (match: any): Match => {
  return {
    id: match.id,
    round: match.rodada,
    homeTeam: {
      id: match.time_casa.id,
      name: match.time_casa.nome,
      shortName: match.time_casa.sigla,
      logoUrl: match.time_casa.escudo_url,
      homeStadium: match.time_casa.estadio,
      city: ''  // Add empty city property to fix TypeScript error
    },
    awayTeam: {
      id: match.time_visitante.id,
      name: match.time_visitante.nome,
      shortName: match.time_visitante.sigla,
      logoUrl: match.time_visitante.escudo_url,
      homeStadium: '',  // Add empty homeStadium property to fix TypeScript error
      city: ''  // Add empty city property to fix TypeScript error
    },
    homeScore: match.placar_casa,
    awayScore: match.placar_visitante,
    date: match.data,
    played: match.placar_casa !== null && match.placar_visitante !== null,
    stadium: match.local ? match.local.split(',')[0].trim() : '',
    city: match.local && match.local.includes(',') 
      ? match.local.split(',').slice(1).join(',').trim() 
      : ''
  };
};

/**
 * Groups matches into rounds
 */
export const groupMatchesToRounds = (matches: Match[]): Round[] => {
  // Extract unique round numbers
  const roundNumbers = [...new Set(matches.map(m => m.round))];
  
  // Create round objects
  return roundNumbers.map(roundNumber => {
    const roundMatches = matches.filter(m => m.round === roundNumber);
    return {
      number: roundNumber,
      matches: roundMatches,
      closed: false, // Could be determined from a database value in the future
      deadline: new Date().toISOString()
    };
  });
};

/**
 * Get Supabase match query with full team data
 */
export const getMatchQueryWithTeams = () => {
  return `
    id,
    rodada,
    data,
    local,
    placar_casa,
    placar_visitante,
    time_casa:times!time_casa_id(id, nome, sigla, escudo_url, estadio),
    time_visitante:times!time_visitante_id(id, nome, sigla, escudo_url)
  `;
};
