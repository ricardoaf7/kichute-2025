
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { RoundSelector } from "./RoundSelector";
import { ParticipantSelector } from "./ParticipantSelector";
import { LoadingMatches } from "./LoadingMatches";
import { MatchesGrid } from "./MatchesGrid";
import { FormControls } from "./FormControls";
import { useGuesses } from "@/hooks/useGuesses";
import { useToast } from "@/hooks/use-toast";

interface GuessingFormNewProps {
  onSubmitSuccess: () => void;
}

const GuessingFormNew = ({ onSubmitSuccess }: GuessingFormNewProps) => {
  const [selectedRound, setSelectedRound] = useState<string>("1");
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [participantError, setParticipantError] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { guesses, setGuesses, isSaving, updateGuess, saveGuesses } = useGuesses(onSubmitSuccess);
  const { toast } = useToast();

  // Função para buscar partidas e palpites existentes
  const fetchMatchesAndGuesses = async () => {
    if (!selectedRound) return;
    
    setIsLoading(true);
    try {
      // Buscar partidas da rodada selecionada
      const { data: matchesData, error: matchesError } = await supabase
        .from('partidas')
        .select(`
          id,
          rodada,
          data,
          local,
          time_casa:times!time_casa_id(id, nome, sigla),
          time_visitante:times!time_visitante_id(id, nome, sigla)
        `)
        .eq('rodada', parseInt(selectedRound))
        .order('data');
      
      if (matchesError) {
        console.error("Erro ao buscar partidas:", matchesError);
        throw matchesError;
      }
      
      console.log("Partidas encontradas:", matchesData || []);
      setMatches(matchesData || []);
      
      // Inicializar array de palpites com valores zerados
      const initialGuesses = (matchesData || []).map(match => ({
        matchId: match.id,
        homeScore: 0,
        awayScore: 0
      }));
      
      setGuesses(initialGuesses);
      
      // Determinar o ID do jogador (autenticado ou selecionado manualmente)
      const playerId = selectedParticipant;
      
      if (playerId) {
        console.log("Buscando palpites existentes para o jogador:", playerId);
        
        // Buscar palpites existentes para este jogador e estas partidas
        const { data: existingGuesses, error: guessesError } = await supabase
          .from('kichutes')
          .select('id, partida_id, palpite_casa, palpite_visitante')
          .eq('jogador_id', playerId)
          .in('partida_id', (matchesData || []).map(m => m.id));
        
        if (guessesError) {
          console.error("Erro ao buscar palpites existentes:", guessesError);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus palpites anteriores.",
            variant: "destructive"
          });
        } else {
          console.log("Palpites existentes encontrados:", existingGuesses || []);
          
          if (existingGuesses && existingGuesses.length > 0) {
            // Mesclar palpites existentes com os inicializados como zero
            const updatedGuesses = initialGuesses.map(guess => {
              const existing = existingGuesses.find(g => g.partida_id === guess.matchId);
              return existing 
                ? {
                    ...guess,
                    homeScore: existing.palpite_casa || 0,
                    awayScore: existing.palpite_visitante || 0
                  }
                : guess;
            });
            console.log("Palpites atualizados com dados existentes:", updatedGuesses);
            setGuesses(updatedGuesses);
          } else {
            console.log("Nenhum palpite existente. Usando valores iniciais:", initialGuesses);
          }
        }
      } else {
        console.log("Nenhum jogador selecionado. Usando valores iniciais:", initialGuesses);
      }
    } catch (err) {
      console.error("Erro ao buscar partidas e palpites:", err);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar as partidas desta rodada.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar partidas quando a rodada ou participante mudar
  useEffect(() => {
    fetchMatchesAndGuesses();
  }, [selectedRound, selectedParticipant]);

  const handleParticipantChange = (participantId: string) => {
    console.log("Participante selecionado:", participantId);
    setSelectedParticipant(participantId);
    if (participantId) {
      setParticipantError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedParticipant) {
      setParticipantError(true);
      return;
    }

    console.log("Enviando palpites para o participante:", selectedParticipant);
    await saveGuesses(selectedParticipant);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ParticipantSelector
          selectedParticipant={selectedParticipant}
          onParticipantChange={handleParticipantChange}
          showError={participantError}
        />

        <RoundSelector
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
          isDisabled={isLoading || isSaving}
        />
      </div>

      {isLoading ? (
        <LoadingMatches />
      ) : (
        <MatchesGrid 
          matches={matches}
          guesses={guesses}
          onGuessChange={updateGuess}
          isDisabled={isSaving}
        />
      )}

      <FormControls 
        isLoading={isLoading}
        isSaving={isSaving}
        hasMatches={matches.length > 0}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default GuessingFormNew;
