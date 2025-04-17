
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { RoundSelector } from "./RoundSelector";
import { ParticipantSelector } from "./ParticipantSelector";
import { LoadingMatches } from "./LoadingMatches";
import { MatchesGrid } from "./MatchesGrid";
import { FormControls } from "./FormControls";
import { useGuesses } from "@/hooks/useGuesses";

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

  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedRound) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
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
        
        if (error) throw error;
        
        setMatches(data || []);
        
        const initialGuesses = (data || []).map(match => ({
          matchId: match.id,
          homeScore: 0,
          awayScore: 0
        }));
        
        const playerId = user?.id || selectedParticipant;
        
        if (playerId) {
          const { data: existingGuesses, error: guessesError } = await supabase
            .from('kichutes')
            .select('partida_id, palpite_casa, palpite_visitante')
            .eq('jogador_id', playerId)
            .in('partida_id', (data || []).map(m => m.id));
          
          if (guessesError) {
            console.error("Erro ao buscar palpites existentes:", guessesError);
          } else if (existingGuesses && existingGuesses.length > 0) {
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
            setGuesses(updatedGuesses);
          } else {
            setGuesses(initialGuesses);
          }
        } else {
          setGuesses(initialGuesses);
        }
      } catch (err) {
        console.error("Erro ao buscar partidas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedRound, selectedParticipant, user, setGuesses]);

  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipant(participantId);
    if (participantId) {
      setParticipantError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user && !selectedParticipant) {
      setParticipantError(true);
      return;
    }

    await saveGuesses(user?.id || selectedParticipant);
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
