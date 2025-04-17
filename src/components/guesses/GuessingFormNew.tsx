
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ParticipantSelector } from "./ParticipantSelector";
import { RoundSelector } from "./RoundSelector";
import { MatchesGrid } from "./MatchesGrid";
import { FormControls } from "./FormControls";
import { LoadingMatches } from "./LoadingMatches";
import { useGuesses } from "@/hooks/useGuesses";
import { useAuth } from "@/contexts/auth";

interface GuessingFormNewProps {
  onSubmitSuccess: () => void;
}

const GuessingFormNew = ({ onSubmitSuccess }: GuessingFormNewProps) => {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRoundClosed, setIsRoundClosed] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    guesses,
    setGuesses,
    isSaving,
    updateGuess,
    saveGuesses
  } = useGuesses(onSubmitSuccess);

  // Fetch matches for selected round
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("partidas")
          .select(`
            id,
            rodada,
            data,
            local,
            time_casa:times!time_casa_id(id, nome, sigla),
            time_visitante:times!time_visitante_id(id, nome, sigla)
          `)
          .eq("rodada", selectedRound)
          .order("data");

        if (error) throw error;

        console.log("Partidas encontradas:", data);
        setMatches(data || []);

        // Initialize guesses array with default values
        const initialGuesses = (data || []).map(match => ({
          matchId: match.id,
          homeScore: 0,
          awayScore: 0
        }));
        
        console.log("Nenhum jogador selecionado. Usando valores iniciais:", initialGuesses);
        setGuesses(initialGuesses);
      } catch (err) {
        console.error("Erro ao carregar partidas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as partidas para esta rodada.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedRound, toast, setGuesses]);

  // Load existing guesses when participant is selected
  useEffect(() => {
    const fetchExistingGuesses = async () => {
      if (!selectedParticipant) return;

      setIsLoading(true);
      try {
        // Get partidas for the selected round
        const { data: matchesData, error: matchesError } = await supabase
          .from("partidas")
          .select("id")
          .eq("rodada", selectedRound);

        if (matchesError) throw matchesError;

        // Get existing kichutes
        const { data: existingGuesses, error: guessesError } = await supabase
          .from("kichutes")
          .select("*")
          .eq("jogador_id", selectedParticipant)
          .in("partida_id", matchesData.map(m => m.id));

        if (guessesError) throw guessesError;

        console.log("Palpites existentes:", existingGuesses);

        // Update guesses state with existing guesses
        const updatedGuesses = [...guesses];
        
        existingGuesses.forEach(guess => {
          const index = updatedGuesses.findIndex(g => g.matchId === guess.partida_id);
          if (index !== -1) {
            updatedGuesses[index] = {
              ...updatedGuesses[index],
              homeScore: guess.palpite_casa || 0,
              awayScore: guess.palpite_visitante || 0
            };
          }
        });

        setGuesses(updatedGuesses);
      } catch (err) {
        console.error("Erro ao carregar palpites existentes:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os palpites existentes.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingGuesses();
  }, [selectedParticipant, selectedRound, guesses, setGuesses, toast]);

  // Check if current user is admin
  const isAdmin = user?.role === "Administrador";

  // Set default participant to current user if not admin
  useEffect(() => {
    if (user && !isAdmin && user.id) {
      setSelectedParticipant(user.id);
    }
  }, [user, isAdmin]);

  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipant(participantId);
  };

  const handleRoundChange = (round: number) => {
    setSelectedRound(round);
  };

  const handleSubmit = async () => {
    if (!selectedParticipant) {
      toast({
        title: "Selecione um participante",
        description: "Por favor, selecione um participante antes de salvar os palpites.",
        variant: "destructive"
      });
      return;
    }

    await saveGuesses(selectedParticipant);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-border/40 shadow-subtle">
        <div className="grid gap-6 md:grid-cols-2">
          <RoundSelector selectedRound={selectedRound} onRoundChange={handleRoundChange} />
          
          {isAdmin && (
            <ParticipantSelector 
              selectedParticipant={selectedParticipant} 
              onParticipantChange={handleParticipantChange} 
            />
          )}
        </div>

        {isLoading ? (
          <LoadingMatches />
        ) : (
          <div className="space-y-6">
            <MatchesGrid 
              matches={matches} 
              guesses={guesses} 
              onGuessChange={updateGuess} 
              isDisabled={isSaving || isRoundClosed} 
            />
            
            {!isRoundClosed && (
              <FormControls 
                onSubmit={handleSubmit} 
                isSaving={isSaving} 
                isValid={guesses.length > 0 && selectedParticipant !== ""} 
              />
            )}
            
            {isRoundClosed && (
              <div className="p-4 text-center bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
                <p className="text-yellow-700 dark:text-yellow-300">
                  Kichutes encerrados para esta rodada.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessingFormNew;
