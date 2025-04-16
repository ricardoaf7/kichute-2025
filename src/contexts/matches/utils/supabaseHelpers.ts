
import { supabase } from "@/integrations/supabase/client";
import { Match, Round } from "@/types";
import { transformMatchFromSupabase, groupMatchesToRounds, getMatchQueryWithTeams } from "./matchTransformers";

/**
 * Fetches all matches from Supabase with team data
 */
export const fetchAllMatches = async () => {
  try {
    const { data, error } = await supabase
      .from('partidas')
      .select(getMatchQueryWithTeams())
      .order('rodada')
      .order('data');
    
    if (error) throw error;
    
    return {
      data: data.map(transformMatchFromSupabase),
      error: null
    };
  } catch (error) {
    console.error('Error fetching matches:', error);
    return { 
      data: null, 
      error: "Não foi possível carregar as partidas do banco de dados."
    };
  }
};

/**
 * Updates a match result in Supabase
 */
export const updateMatchResult = async (matchId: string, homeScore: number, awayScore: number) => {
  try {
    const { error } = await supabase
      .from('partidas')
      .update({
        placar_casa: homeScore,
        placar_visitante: awayScore
      })
      .eq('id', matchId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating match result:', error);
    return { 
      success: false, 
      error: "Não foi possível atualizar o resultado da partida." 
    };
  }
};

/**
 * Deletes a match from Supabase
 */
export const deleteMatch = async (matchId: string) => {
  try {
    const { error } = await supabase
      .from('partidas')
      .delete()
      .eq('id', matchId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting match:', error);
    return { 
      success: false, 
      error: "Não foi possível excluir a partida." 
    };
  }
};

/**
 * Saves a match (creates or updates) in Supabase
 */
export const saveMatch = async (matchData: any, matchId?: string) => {
  try {
    if (matchId) {
      // Update existing match
      const { error } = await supabase
        .from('partidas')
        .update(matchData)
        .eq('id', matchId);

      if (error) throw error;
    } else {
      // Create new match
      const { error } = await supabase
        .from('partidas')
        .insert(matchData);

      if (error) throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving match:', error);
    return { 
      success: false, 
      error: "Não foi possível salvar a partida no banco de dados." 
    };
  }
};
