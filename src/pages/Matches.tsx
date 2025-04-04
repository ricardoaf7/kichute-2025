
import { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import RoundSelector from "../components/RoundSelector";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchFixtures, groupMatchesByRound, loadRoundsFromStorage } from "../utils/api";
import { Round, Match } from "../types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Matches = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roundParam = searchParams.get("round");
  const [currentRound, setCurrentRound] = useState(roundParam ? parseInt(roundParam) : 1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update URL when round changes
    setSearchParams({ round: currentRound.toString() });
  }, [currentRound, setSearchParams]);

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError(null);
        
        // Primeiro carregamos as rodadas do localStorage (ou valores padrão)
        const storedRounds = loadRoundsFromStorage();
        setRounds(storedRounds);
        
        // Verificar se temos dados
        if (storedRounds.length === 0) {
          setError("Nenhuma rodada encontrada. Adicione rodadas e partidas no painel administrativo.");
          setLoading(false);
          return;
        }
        
        // Simular carregamento para melhorar UX
        setTimeout(() => {
          setIsLoaded(true);
          setLoading(false);
        }, 300);
      } catch (err) {
        setError("Erro ao carregar partidas. Tente novamente mais tarde.");
        toast({
          title: "Erro ao carregar partidas",
          description: "Não foi possível buscar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
    
    loadMatches();
  }, [currentRound, toast]);

  const handleRoundChange = (round: number) => {
    setCurrentRound(round);
    // Simulate loading between rounds
    setIsLoaded(false);
  };

  const currentRoundData = rounds.find(r => r.number === currentRound);
  const matches = currentRoundData?.matches || [];

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 animate-slide-down">
          <h1 className="text-3xl font-bold">Partidas</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os jogos e resultados de cada rodada
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/matches">
              Gerenciar Partidas
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 mb-8 animate-slide-up">
          <RoundSelector 
            rounds={rounds} 
            currentRound={currentRound} 
            onRoundChange={handleRoundChange} 
          />
        </div>

        {loading && !isLoaded ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive animate-fadeIn">
            <p>{error}</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/admin/matches">
                Ir para o Gerenciador de Partidas
              </Link>
            </Button>
          </div>
        ) : (
          <div className={`flex flex-col space-y-4 max-w-3xl mx-auto transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}>
            {matches.map((match, index) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                className="animate-slide-up w-full"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              />
            ))}

            {matches.length === 0 && (
              <div className="text-center py-12 text-muted-foreground animate-fadeIn">
                Nenhuma partida encontrada para esta rodada.
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link to="/admin/matches">
                      Adicionar Partidas
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
