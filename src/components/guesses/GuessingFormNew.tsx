import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RotateCw } from "lucide-react";
import { useParticipants } from "@/hooks/useParticipants";
import { useAuth } from "@/contexts/auth";

interface Match {
  id: string;
  rodada: number;
  data: string;
  local: string;
  time_casa: { 
    id: string;
    nome: string; 
    sigla: string;
  };
  time_visitante: { 
    id: string;
    nome: string; 
    sigla: string;
  };
  placar_casa: number | null;
  placar_visitante: number | null;
}

interface Guess {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

interface GuessingFormNewProps {
  onSubmitSuccess: () => void;
}

const GuessingFormNew = ({ onSubmitSuccess }: GuessingFormNewProps) => {
  const [selectedRound, setSelectedRound] = useState<string>("1");
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [rounds, setRounds] = useState<number[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { participants } = useParticipants();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) throw error;
        
        const uniqueRounds = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setRounds(uniqueRounds);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas",
          variant: "destructive"
        });
      }
    };

    fetchRounds();
  }, [toast]);

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
            placar_casa,
            placar_visitante,
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
        
        const { data: existingGuesses, error: guessesError } = await supabase
          .from('kichutes')
          .select('partida_id, palpite_casa, palpite_visitante')
          .eq('jogador_id', await getUserId())
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
  }, [selectedRound, toast]);

  const getUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id;
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
    if (!user && !selectedParticipant) {
      toast({
        title: "Participante não selecionado",
        description: "Por favor, selecione um participante para enviar os palpites.",
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return 'Data inválida';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {!user && (
            <div className="w-full md:w-48">
              <Label htmlFor="participant-select">Participante</Label>
              <Select 
                value={selectedParticipant} 
                onValueChange={setSelectedParticipant}
                required
              >
                <SelectTrigger id="participant-select">
                  <SelectValue placeholder="Selecione o participante" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="w-full md:w-48">
            <Label htmlFor="round-select">Rodada</Label>
            <Select 
              value={selectedRound} 
              onValueChange={setSelectedRound}
              disabled={isLoading || isSaving}
            >
              <SelectTrigger id="round-select">
                <SelectValue placeholder="Selecione a rodada" />
              </SelectTrigger>
              <SelectContent>
                {rounds.map((round) => (
                  <SelectItem key={`round-${round}`} value={round.toString()}>
                    Rodada {round}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Rodada {match.rodada}</span>
                      <span>{formatDate(match.data)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center space-y-2 w-2/5">
                        <span className="font-semibold text-center">{match.time_casa.nome}</span>
                        <Input
                          type="number"
                          min="0"
                          className="w-16 text-center"
                          value={guesses.find(g => g.matchId === match.id)?.homeScore || 0}
                          onChange={(e) => updateGuess(match.id, 'home', parseInt(e.target.value) || 0)}
                          disabled={isSaving}
                        />
                      </div>
                      
                      <div className="flex-shrink-0 text-center w-1/5">
                        <span className="text-xl font-bold">X</span>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-2 w-2/5">
                        <span className="font-semibold text-center">{match.time_visitante.nome}</span>
                        <Input
                          type="number"
                          min="0"
                          className="w-16 text-center"
                          value={guesses.find(g => g.matchId === match.id)?.awayScore || 0}
                          onChange={(e) => updateGuess(match.id, 'away', parseInt(e.target.value) || 0)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
