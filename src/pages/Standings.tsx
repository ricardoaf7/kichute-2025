
import { useState, useEffect } from "react";
import { PLAYERS, ROUNDS } from "../utils/mockData";
import StandingsHeader from "../components/standings/StandingsHeader";
import StandingsContent from "../components/standings/StandingsContent";

const Standings = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards" | "dynamic" | "kichutes" | "matches">("dynamic");
  const [selectedRound, setSelectedRound] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isLoaded, setIsLoaded] = useState(false);
  const [useDynamicTable, setUseDynamicTable] = useState(true);

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
    // Reset month when selecting a specific round
    if (value !== "total") {
      setSelectedMonth("all");
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    // Reset round when selecting a specific month
    if (e.target.value !== "all") {
      setSelectedRound(undefined);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
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

        <StandingsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedRound={selectedRound}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          allRounds={allRounds}
          handleRoundChange={handleRoundChange}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          useDynamicTable={useDynamicTable}
          setUseDynamicTable={setUseDynamicTable}
        />

        <StandingsContent
          viewMode={viewMode}
          sortedPlayers={sortedPlayers}
          selectedRound={selectedRound}
          isLoaded={isLoaded}
        />
      </div>
    </div>
  );
};

export default Standings;
