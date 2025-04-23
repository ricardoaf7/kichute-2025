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
  initialRound?: string;
}

const GuessingFormNew = ({ onSubmitSuccess, initialRound = "1" }: GuessingFormNewProps) => {
  const [selectedRound, setSelectedRound] = useState<string>(initialRound);
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

  useEffect(() => {
    setSelectedRound(initialRound);
  }, [initialRound]);

  useEffect(() => {
    const fetchExistingGuesses = async () => {
      if (!selectedParticipant) return;

      try {
        const { data: matchesData, error: matchesError } = await supabase
          .from("partidas")
          .select("id")
          .eq("rodada", parseInt(selectedRound));

        if (matchesError) throw matchesError;

        const { data: existingGuesses, error: guessesError } = await supabase
          .from("kichutes")
          .select("*")
          .eq("jogador_id", selectedParticipant)
          .in("partida_id", matchesData.map(m => m.id));

        if (guessesError) throw guessesError;

        console.log("Palpites existentes:", existingGuesses);

        const updatedGuesses = matches.map(match => {
          const existingGuess = existingGuesses.find(g => g.partida_id === match.id);
          return {
            matchId: match.id,
            homeScore: existingGuess ? existingGuess.palpite_casa || 0 : 0,
            awayScore: existingGuess ? existingGuess.palpite_visitante || 0 : 0
          };
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
  }, [selectedParticipant, selectedRound, matches, toast]);

  const isAdmin = user?.role === "Administrador";

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

  useEffect(() => {
    if (!matches || matches.length === 0) return;

    const initialGuesses = matches.map(match => ({
      matchId: match.id,
      homeScore: 0,
      awayScore: 0
    }));

    console.log("Inicializando palpites com valores padrão:", initialGuesses);
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
