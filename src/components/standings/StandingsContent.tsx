
import React from "react";
import { Player } from "../../types";
import StandingsTable from "../StandingsTable";
import PlayerCard from "../PlayerCard";
import DynamicTable from "../DynamicTable";

interface StandingsContentProps {
  viewMode: "table" | "cards" | "dynamic";
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
      ) : viewMode === "table" ? (
        <StandingsTable 
          selectedRodada={selectedRound ? selectedRound.toString() : "todas"} 
          selectedJogador="todos"
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
  );
};

export default StandingsContent;
