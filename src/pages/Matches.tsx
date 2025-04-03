
import { useState, useEffect } from "react";
import { ROUNDS } from "../utils/mockData";
import MatchCard from "../components/MatchCard";
import RoundSelector from "../components/RoundSelector";
import { useSearchParams } from "react-router-dom";

const Matches = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roundParam = searchParams.get("round");
  const [currentRound, setCurrentRound] = useState(roundParam ? parseInt(roundParam) : 1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Update URL when round changes
    setSearchParams({ round: currentRound.toString() });
  }, [currentRound, setSearchParams]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRoundChange = (round: number) => {
    setCurrentRound(round);
    // Simulate loading between rounds
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 300);
  };

  const currentRoundData = ROUNDS.find(r => r.number === currentRound);
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
            rounds={ROUNDS} 
            currentRound={currentRound} 
            onRoundChange={handleRoundChange} 
          />
        </div>

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
      </div>
    </div>
  );
};

export default Matches;
