
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RotateCw } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { RoundSelector } from "./RoundSelector";
import { ParticipantSelector } from "./ParticipantSelector";
import { MatchGuessCard } from "./MatchGuessCard";

interface GuessingFormNewProps {
  onSubmitSuccess: () => void;
}

const GuessingFormNew = ({ onSubmitSuccess }: GuessingFormNewProps) => {
  const [selectedRound, setSelectedRound] = useState<string>("1");
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [participantError, setParticipantError] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
        
        // Buscar palpites existentes para o jogador selecionado ou autenticado
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
              if (existing) {
                return {
                  ...guess,
                  homeScore: existing.palpite_casa || 0,
                  awayScore: existing.palpite_visitante || 0
                };
              }
              return guess;
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
        toast({
          title: "Erro",
          description: "Não foi possível carregar as partidas",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedRound, selectedParticipant, user, toast]);

  const handleParticipantChange = (participantId: string) => {
    setSelectedParticipant(participantId);
    
    // Limpar erro quando um participante é selecionado
    if (participantId) {
      setParticipantError(false);
    }
  };

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

  const validateGuesses = () => {
    // Validar se um participante foi selecionado quando não há usuário autenticado
    if (!user && !selectedParticipant) {
      setParticipantError(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateGuesses()) return;
    
    setIsSaving(true);
    try {
      const participantId = user?.id || selectedParticipant;
      
      if (!participantId) {
        throw new Error("ID do participante não encontrado");
      }
      
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {!user && (
            <ParticipantSelector
              selectedParticipant={selectedParticipant}
              onParticipantChange={handleParticipantChange}
              showError={participantError}
            />
          )}

          <RoundSelector
            selectedRound={selectedRound}
            onRoundChange={setSelectedRound}
            isDisabled={isLoading || isSaving}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando partidas...</span>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/50">
            Nenhuma partida encontrada para esta rodada.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((match) => {
              const guess = guesses.find(g => g.matchId === match.id);
              return (
                <MatchGuessCard
                  key={match.id}
                  match={match}
                  homeScore={guess?.homeScore || 0}
                  awayScore={guess?.awayScore || 0}
                  onScoreChange={updateGuess}
                  isDisabled={isSaving}
                />
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            disabled={isLoading || isSaving || matches.length === 0}
            className="w-full md:w-auto"
          >
            {isSaving ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Enviar Palpites'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default GuessingFormNew;
