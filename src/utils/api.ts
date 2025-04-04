
import { Match, Round } from "../types";
import { ROUNDS } from "./mockData";

// Função para testar a conexão com API-Football
export const testApiFootballFunction = async (): Promise<{success: boolean; message?: string}> => {
  try {
    // Como não estamos mais usando a API real, retornamos uma simulação
    return {
      success: false,
      message: "A conexão com API-Football não está disponível. Estamos usando dados locais."
    };
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return {
      success: false,
      message: "Erro ao testar conexão com API-Football"
    };
  }
};

// Função para buscar as rodadas disponíveis
export const fetchRounds = async (): Promise<string[]> => {
  try {
    // Retornar rodadas simuladas baseadas nos dados mockados
    return ROUNDS.map(round => `Regular Season - ${round.number}`);
  } catch (error) {
    console.error("Erro ao buscar rodadas:", error);
    throw new Error("Não foi possível carregar as rodadas.");
  }
};

// Função para buscar partidas por rodada
export const fetchFixtures = async (round?: string): Promise<Match[]> => {
  try {
    // Usar dados locais em vez de API
    let matches: Match[] = [];
    
    // Se um número de rodada for especificado, filtrar apenas essa rodada
    if (round) {
      const roundNumber = parseInt(round);
      const foundRound = ROUNDS.find(r => r.number === roundNumber);
      matches = foundRound?.matches || [];
    } else {
      // Caso contrário, retornar todas as partidas de todas as rodadas
      ROUNDS.forEach(round => {
        matches = [...matches, ...round.matches];
      });
    }
    
    return matches;
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    throw new Error("Não foi possível carregar as partidas.");
  }
};

// Função para agrupar partidas por rodada
export const groupMatchesByRound = (matches: Match[]): Round[] => {
  // Extrair números únicos de rodadas presentes nos dados
  const roundNumbers = [...new Set(matches.map(match => match.round))].sort((a, b) => a - b);
  
  // Criar objetos de rodada para cada número de rodada encontrado
  return roundNumbers.map(roundNumber => {
    const roundMatches = matches.filter(match => match.round === roundNumber);
    
    // Buscar a rodada existente para obter dados adicionais como deadline, closed, etc.
    const existingRound = ROUNDS.find(r => r.number === roundNumber);
    
    return {
      number: roundNumber,
      matches: roundMatches,
      closed: existingRound?.closed || false,
      deadline: existingRound?.deadline || new Date().toISOString(),
    };
  });
};

// Função para salvar as rodadas e partidas no localStorage
export const saveRoundsToStorage = (rounds: Round[]): void => {
  localStorage.setItem('kichute_rounds', JSON.stringify(rounds));
};

// Função para carregar as rodadas e partidas do localStorage
export const loadRoundsFromStorage = (): Round[] => {
  const stored = localStorage.getItem('kichute_rounds');
  return stored ? JSON.parse(stored) : ROUNDS;
};
