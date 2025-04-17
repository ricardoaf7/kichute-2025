
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { useGuesses } from "@/hooks/useGuesses";
import { useMatchesByRound } from "@/hooks/useMatchesByRound";
import { GuessingFormHeader } from "./GuessingFormHeader";
import { GuessingFormContent } from "./GuessingFormContent";

interface GuessingFormNewProps {
  onSubmitSuccess: () => void;
}

const GuessingFormNew = ({ onSubmitSuccess }: GuessingFormNewProps) => {
  const [selectedRound, setSelectedRound] = useState<string>("1");
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [isRoundClosed, setIsRoundClosed] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { matches, isLoading } = useMatchesByRound(selectedRound);
  const {
    guesses,
    setGuesses,
    isSaving,
    updateGuess,
    saveGuesses
  } = useGuesses(onSubmitSuccess);

  // Load existing guesses when participant is selected
  useEffect(() => {
    const fetchExistingGuesses = async () => {
      if (!selectedParticipant) return;

      try {
        // Get partidas for the selected round
        const { data: matchesData, error: matchesError } = await supabase
          .from("partidas")
          .select("id")
          .eq("rodada", parseInt(selectedRound));

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

  const handleRoundChange = (round: string) => {
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

  // Initialize guesses when matches change
  useEffect(() => {
    const initialGuesses = matches.map(match => ({
      matchId: match.id,
      homeScore: 0,
      awayScore: 0
    }));
    
    console.log("Nenhum jogador selecionado. Usando valores iniciais:", initialGuesses);
    setGuesses(initialGuesses);
  }, [matches, setGuesses]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-border/40 shadow-subtle">
        <GuessingFormHeader
          selectedRound={selectedRound}
          selectedParticipant={selectedParticipant}
          onRoundChange={handleRoundChange}
          onParticipantChange={handleParticipantChange}
          isAdmin={isAdmin}
        />

        <GuessingFormContent
          isLoading={isLoading}
          matches={matches}
          guesses={guesses}
          isSaving={isSaving}
          isRoundClosed={isRoundClosed}
          selectedParticipant={selectedParticipant}
          onGuessChange={updateGuess}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default GuessingFormNew;
