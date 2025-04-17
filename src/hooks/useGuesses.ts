
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
      
      let saveSuccess = true;
      const savedResults = [];
      
      // Processa cada palpite individualmente para melhor controle de erros
      for (const guess of guessesData) {
        // Verificar se já existe um palpite para esta partida e jogador
        const { data: existingGuess, error: checkError } = await supabase
          .from('kichutes')
          .select('*')
          .eq('jogador_id', guess.jogador_id)
          .eq('partida_id', guess.partida_id)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 significa que nenhum registro foi encontrado, o que é esperado
          console.error("Erro ao verificar palpite existente:", checkError);
          throw checkError;
        }
        
        let result;
        if (existingGuess) {
          // Atualizar palpite existente
          console.log(`Atualizando palpite existente: Jogador ${guess.jogador_id}, Partida ${guess.partida_id}`);
          result = await supabase
            .from('kichutes')
            .update({
              palpite_casa: guess.palpite_casa,
              palpite_visitante: guess.palpite_visitante
            })
            .eq('jogador_id', guess.jogador_id)
            .eq('partida_id', guess.partida_id);
        } else {
          // Inserir novo palpite
          console.log(`Inserindo novo palpite: Jogador ${guess.jogador_id}, Partida ${guess.partida_id}`);
          result = await supabase
            .from('kichutes')
            .insert(guess);
        }
        
        if (result.error) {
          console.error("Erro ao salvar palpite:", result.error);
          saveSuccess = false;
          throw result.error;
        } else {
          console.log("Palpite salvo com sucesso:", result.data);
          savedResults.push(result);
        }
      }
      
      if (saveSuccess) {
        console.log("Todos os palpites foram salvos com sucesso:", savedResults);
        toast({
          title: "Sucesso!",
          description: "Seus palpites foram salvos com sucesso!"
        });
        
        onSubmitSuccess();
      }
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
