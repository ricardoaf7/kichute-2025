
import { useState } from "react";
import { useDynamicTableDataReal } from "@/hooks/standings/useDynamicTableDataReal";
import { useSortedPlayers } from "@/hooks/standings/useSortedPlayers";
import { TableFilters } from "./TableFilters";
import { TableLoading } from "./table/TableLoading";
import { TableError } from "./table/TableError";
import { DynamicTableContent } from "./table/DynamicTableContent";

const DynamicTable = () => {
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedMes, setSelectedMes] = useState<string>("todos");
  const [selectedAno, setSelectedAno] = useState<string>("2025");

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

  const calcularTotalPorRodada = () => {
    const totais: Record<string, number> = {};
    todasRodadas.forEach(rodada => {
      totais[rodada] = jogadores.reduce((sum, jogador) => {
        return sum + (jogador.rodadas[rodada] || 0);
      }, 0);
    });
    return totais;
  };

  const totaisPorRodada = calcularTotalPorRodada();
  const totalGeral = jogadores.reduce((sum, jogador) => sum + jogador.pontos_total, 0);

  return (
    <div className="space-y-4">
      <TableFilters
        rodadas={rodadas}
        selectedRodada={selectedRodada}
        selectedMes={selectedMes}
        selectedAno={selectedAno}
        onRodadaChange={setSelectedRodada}
        onMesChange={setSelectedMes}
        onAnoChange={setSelectedAno}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <TableLoading />
        ) : error ? (
          <TableError message={error} />
        ) : (
          <DynamicTableContent
            sortedPlayers={sortedPlayers}
            todasRodadas={todasRodadas}
            totaisPorRodada={totaisPorRodada}
            totalGeral={totalGeral}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedRodada={selectedRodada}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
