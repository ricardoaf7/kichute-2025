
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
      toast({
        title: "Participante não selecionado",
        description: "Por favor, selecione um participante antes de enviar os palpites.",
        variant: "destructive"
      });
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
      
      // Log dos dados que estão sendo enviados para depuração
      console.log("Enviando palpites:", guessesData);
      
      // Vamos usar insert com upsert mais simples, sem especificar conflitos
      // O erro anterior era devido à falta de constraint na tabela
      for (const guess of guessesData) {
        // Verificar se já existe um palpite para esta partida e jogador
        const { data: existingGuess, error: checkError } = await supabase
          .from('kichutes')
          .select('*')
          .eq('jogador_id', guess.jogador_id)
          .eq('partida_id', guess.partida_id)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error("Erro ao verificar palpite existente:", checkError);
          throw checkError;
        }
        
        let saveError;
        if (existingGuess) {
          // Atualizar palpite existente
          const { error } = await supabase
            .from('kichutes')
            .update({
              palpite_casa: guess.palpite_casa,
              palpite_visitante: guess.palpite_visitante
            })
            .eq('jogador_id', guess.jogador_id)
            .eq('partida_id', guess.partida_id);
          
          saveError = error;
        } else {
          // Inserir novo palpite
          const { error } = await supabase
            .from('kichutes')
            .insert(guess);
          
          saveError = error;
        }
        
        if (saveError) {
          console.error("Erro ao salvar palpite:", saveError);
          throw saveError;
        }
      }
      
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
