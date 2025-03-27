
import { useState, useEffect } from "react";
import { PLAYERS, ROUNDS } from "../utils/mockData";
import StandingsTable from "../components/StandingsTable";
import PlayerCard from "../components/PlayerCard";

const Standings = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedRound, setSelectedRound] = useState<number | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Sort players by total points
  const sortedPlayers = [...PLAYERS].sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Get all rounds across all players
  const allRounds = ROUNDS.map(round => round.number).sort((a, b) => a - b);

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRound(value === "total" ? undefined : parseInt(value));
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Classificação</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe a pontuação de cada jogador no bolão
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Tabela de Classificação</h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-3">
                <label htmlFor="round-select" className="text-sm font-medium">
                  Exibir pontos:
                </label>
                <select
                  id="round-select"
                  value={selectedRound ? selectedRound.toString() : "total"}
                  onChange={handleRoundChange}
                  className="form-input"
                >
                  <option value="total">Total</option>
                  {allRounds.map(round => (
                    <option key={round} value={round.toString()}>
                      Rodada {round}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex rounded-md overflow-hidden border border-border">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Tabela
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === "cards"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          {viewMode === "table" ? (
            <StandingsTable 
              players={sortedPlayers} 
              showRoundPoints={true}
              selectedRound={selectedRound}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPlayers.map((player, index) => (
                <PlayerCard 
                  key={player.id} 
                  player={player} 
                  position={index + 1} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Standings;
