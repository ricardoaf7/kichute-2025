
import React from "react";
import DynamicTable from "./DynamicTable";

interface StandingsContentProps {
  viewMode: "table" | "dynamic";
  selectedRound: number | undefined;
  isLoaded: boolean;
}

const StandingsContent: React.FC<StandingsContentProps> = ({
  viewMode,
  selectedRound,
  isLoaded,
}) => {
  return (
    <div className={`transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      <DynamicTable 
        viewMode={viewMode}
        selectedRodada={selectedRound ? selectedRound.toString() : "todas"}
      />
    </div>
  );
};

export default StandingsContent;
