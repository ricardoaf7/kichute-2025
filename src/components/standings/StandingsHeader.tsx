
import React from "react";
import FilterSelector from "./FilterSelector";
import ViewSelector from "./ViewSelector";

interface StandingsHeaderProps {
  viewMode: "table" | "cards" | "dynamic" | "kichutes" | "matches" | "payments" | "rules";
  setViewMode: (mode: "table" | "cards" | "dynamic" | "kichutes" | "matches" | "payments" | "rules") => void;
  selectedRound: number | undefined;
  selectedMonth: string;
  selectedYear: string;
  allRounds: number[];
  handleRoundChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  useDynamicTable: boolean;
  setUseDynamicTable: (value: boolean) => void;
}

const StandingsHeader: React.FC<StandingsHeaderProps> = ({
  viewMode,
  setViewMode,
  selectedRound,
  selectedMonth,
  selectedYear,
  allRounds,
  handleRoundChange,
  handleMonthChange,
  handleYearChange,
  useDynamicTable,
  setUseDynamicTable,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6 mb-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Tabela de Classificação</h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {!useDynamicTable && (
            <FilterSelector
              selectedRound={selectedRound}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              allRounds={allRounds}
              handleRoundChange={handleRoundChange}
              handleMonthChange={handleMonthChange}
              handleYearChange={handleYearChange}
            />
          )}

          <ViewSelector
            viewMode={viewMode}
            setViewMode={setViewMode}
            setUseDynamicTable={setUseDynamicTable}
          />
        </div>
      </div>
    </div>
  );
};

export default StandingsHeader;
