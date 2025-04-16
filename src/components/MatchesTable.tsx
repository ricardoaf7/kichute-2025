
import { useState } from "react";
import { cn } from "@/lib/utils";
import MatchesFilters from "./matches/MatchesFilters";
import MatchesTableContent from "./matches/MatchesTableContent";
import { useMatches } from "./matches/useMatches";

interface MatchesTableProps {
  className?: string;
}

const MatchesTable = ({ className }: MatchesTableProps) => {
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedTime, setSelectedTime] = useState<string>("todos");
  
  const { matches, isLoading, error } = useMatches(selectedRodada, selectedTime);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filtros */}
      <MatchesFilters 
        selectedRodada={selectedRodada}
        setSelectedRodada={setSelectedRodada}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />

      {/* Tabela */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <MatchesTableContent 
          matches={matches}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default MatchesTable;
