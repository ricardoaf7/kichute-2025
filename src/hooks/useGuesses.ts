
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useGuesses = (onSubmitSuccess: () => void) => {
  const [guesses, setGuesses] = useState<Array<{
    matchId: string;
    homeScore: number;
    awayScore: number;
  }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const updateGuess = (matchId: string, type: 'home' | 'away', value: number) => {
    setGuesses(prev => 
      prev.map(guess => 
        guess.matchId === matchId 
          ? { 
              ...guess, 
              homeScore: type === 'home' ? value : guess.homeScore,
              awayScore: type === 'away' ? value : guess.awayScore
            } 
          : guess
      )
    );
  };

  const validateGuesses = (participantId?: string) => {
    if (!participantId) {
      return false;
    }

    const emptyGuesses = guesses.filter(
      guess => guess.homeScore === undefined || guess.awayScore === undefined
    );
    
    if (emptyGuesses.length > 0) {
      toast({
        title: "Palpites incompletos",
        description: `Existem ${emptyGuesses.length} partidas sem palpites. Por favor, preencha todos os palpites.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const saveGuesses = async (participantId: string) => {
    if (!validateGuesses(participantId)) return;
    
    setIsSaving(true);
    try {
      const guessesData = guesses.map(guess => ({
        jogador_id: participantId,
        partida_id: guess.matchId,
        palpite_casa: guess.homeScore,
        palpite_visitante: guess.awayScore
      }));
      
      const { error } = await supabase
        .from('kichutes')
        .upsert(guessesData, { 
          onConflict: 'jogador_id,partida_id',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Seus palpites foram salvos com sucesso!"
      });
      
      onSubmitSuccess();
    } catch (err) {
      console.error("Erro ao salvar palpites:", err);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seus palpites. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    guesses,
    setGuesses,
    isSaving,
    updateGuess,
    saveGuesses
  };
};
