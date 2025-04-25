
import { useState, useEffect } from "react";
import { useDynamicTableDataReal } from "@/hooks/standings/useDynamicTableDataReal";
import { useSortedPlayers } from "@/hooks/standings/useSortedPlayers";
import { useTotalsCalculation } from "@/hooks/standings/useTotalsCalculation";
import { DynamicTableFilters } from "./table/DynamicTableFilters";
import { TableLoading } from "./table/TableLoading";
import { TableError } from "./table/TableError";
import { DynamicTableContent } from "./table/DynamicTableContent";

interface DynamicTableProps {
  viewMode: "table" | "dynamic";
  selectedRodada: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ viewMode, selectedRodada: initialRodada }) => {
  const [selectedRodada, setSelectedRodada] = useState<string>(initialRodada);
  const [selectedMes, setSelectedMes] = useState<string>("todos");
  const [selectedAno, setSelectedAno] = useState<string>("2025");
  
  // Quando o initialRodada mudar, atualizar o estado interno
  useEffect(() => {
    if (initialRodada !== selectedRodada) {
      setSelectedRodada(initialRodada);
    }
  }, [initialRodada]);

  const { jogadores, rodadas, isLoading, error } = useDynamicTableDataReal(
    selectedRodada,
    selectedMes,
    selectedAno
  );

  const todasRodadas = Array.from(
    new Set(jogadores.flatMap(jogador => Object.keys(jogador.rodadas)))
  ).sort((a, b) => {
    const numA = parseInt(a.substring(1));
    const numB = parseInt(b.substring(1));
    return numA - numB;
  });

  const { sortField, sortDirection, handleSort, sortedPlayers } = useSortedPlayers(
    jogadores,
    selectedRodada
  );

  const { totaisPorRodada, totalGeral } = useTotalsCalculation(jogadores, todasRodadas);

  const handleRodadaChange = (value: string) => {
    setSelectedRodada(value);
    // Se estamos em modo "table", não permitir selecionar rodada específica
    if (viewMode === "table") {
      setSelectedMes("todos");
    }
  };

  const handleMesChange = (value: string) => {
    setSelectedMes(value);
    // Quando selecionar um mês específico, resetar a rodada
    if (value !== "todos") {
      setSelectedRodada("todas");
    }
  };

  return (
    <div className="space-y-4">
      <DynamicTableFilters
        rodadas={rodadas}
        selectedRodada={selectedRodada}
        selectedMes={selectedMes}
        selectedAno={selectedAno}
        onRodadaChange={handleRodadaChange}
        onMesChange={handleMesChange}
        onAnoChange={setSelectedAno}
        viewMode={viewMode}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <TableLoading />
        ) : error ? (
          <TableError message={error} />
        ) : (
          <DynamicTableContent
            sortedPlayers={sortedPlayers}
            todasRodadas={viewMode === "table" ? [] : todasRodadas}
            totaisPorRodada={totaisPorRodada}
            totalGeral={totalGeral}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedRodada={selectedRodada}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
