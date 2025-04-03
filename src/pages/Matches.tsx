
import { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import RoundSelector from "../components/RoundSelector";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fetchFixtures, groupMatchesByRound } from "../utils/api";
import { Round, Match } from "../types";

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
        
        // Buscar partidas da rodada atual e de todas as rodadas
        const matches = await fetchFixtures(currentRound.toString());
        
        if (matches.length === 0) {
          setError("Nenhuma partida encontrada. Verifique a conexão com a API.");
          return;
        }
        
        // Agrupar partidas por rodada
        const groupedRounds = groupMatchesByRound(matches);
        setRounds(groupedRounds);
        
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
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Partidas</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os jogos e resultados de cada rodada
          </p>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
