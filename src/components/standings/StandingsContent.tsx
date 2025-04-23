
import React from "react";
import { Player } from "../../types";
import StandingsTable from "../StandingsTable";
import DynamicTable from "./DynamicTable";

interface StandingsContentProps {
  viewMode: "table" | "dynamic";
  sortedPlayers: Player[];
  selectedRound: number | undefined;
  isLoaded: boolean;
}

const StandingsContent: React.FC<StandingsContentProps> = ({
  viewMode,
  sortedPlayers,
  selectedRound,
  isLoaded,
}) => {
  return (
    <div className={`transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {viewMode === "dynamic" ? (
        <DynamicTable />
      ) : (
        <StandingsTable 
          selectedRodada={selectedRound ? selectedRound.toString() : "todas"} 
          selectedJogador="todos"
        />
      )}
    </div>
  );
};

export default StandingsContent;
