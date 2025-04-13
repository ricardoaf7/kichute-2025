
import { useState, useEffect } from "react";
import { PLAYERS, ROUNDS } from "../utils/mockData";
import StandingsTable from "../components/StandingsTable";
import PlayerCard from "../components/PlayerCard";
import DynamicTable from "../components/DynamicTable";
import KichuteTable from "../components/KichuteTable";

const Standings = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards" | "dynamic" | "kichutes">("dynamic");
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

  const months = [
    { value: "all", label: "Todos" },
    { value: "mar-apr", label: "Março/Abril" },
    { value: "may", label: "Maio" },
    { value: "jun", label: "Junho" },
    { value: "jul", label: "Julho" },
    { value: "aug", label: "Agosto" },
    { value: "sep", label: "Setembro" },
    { value: "oct", label: "Outubro" },
    { value: "nov", label: "Novembro" },
    { value: "dec", label: "Dezembro" },
  ];

  const years = [
    { value: "2025", label: "2025" },
  ];

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
              {!useDynamicTable && (
                <>
                  <div className="flex items-center space-x-3">
                    <label htmlFor="round-select" className="text-sm font-medium">
                      Rodada:
                    </label>
                    <select
                      id="round-select"
                      value={selectedRound ? selectedRound.toString() : "total"}
                      onChange={handleRoundChange}
                      className="form-input"
                    >
                      <option value="total">Todas</option>
                      {allRounds.map(round => (
                        <option key={round} value={round.toString()}>
                          Rodada {round}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label htmlFor="month-select" className="text-sm font-medium">
                      Mês:
                    </label>
                    <select
                      id="month-select"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      className="form-input"
                      disabled={selectedRound !== undefined}
                    >
                      {months.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label htmlFor="year-select" className="text-sm font-medium">
                      Ano:
                    </label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="form-input"
                    >
                      {years.map(year => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="flex rounded-md overflow-hidden border border-border">
                <button
                  onClick={() => { setViewMode("dynamic"); setUseDynamicTable(true); }}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === "dynamic"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Supabase
                </button>
                <button
                  onClick={() => { setViewMode("kichutes"); setUseDynamicTable(true); }}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === "kichutes"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Kichutes
                </button>
                <button
                  onClick={() => { setViewMode("table"); setUseDynamicTable(false); }}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted/50"
                  }`}
                >
                  Tabela
                </button>
                <button
                  onClick={() => { setViewMode("cards"); setUseDynamicTable(false); }}
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
          {viewMode === "dynamic" ? (
            <DynamicTable />
          ) : viewMode === "kichutes" ? (
            <KichuteTable />
          ) : viewMode === "table" ? (
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
