
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { TableFilters } from "./TableFilters";
import { useDynamicTableDataReal } from "@/hooks/useDynamicTableDataReal";
import { useDynamicTableSort } from "@/hooks/standings/useDynamicTableSort";
import { DynamicTableHeader } from "./table/DynamicTableHeader";
import { DynamicTableRow } from "./table/DynamicTableRow";
import { DynamicTableFooter } from "./table/DynamicTableFooter";

const DynamicTable = () => {
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedMes, setSelectedMes] = useState<string>("todos");
  const [selectedAno, setSelectedAno] = useState<string>("2025");

  const { jogadores, rodadas, isLoading, error } = useDynamicTableDataReal(
    selectedRodada,
    selectedMes,
    selectedAno
  );

  const { sortField, sortDirection, handleSort } = useDynamicTableSort();

  const todasRodadas = Array.from(
    new Set(jogadores.flatMap(jogador => Object.keys(jogador.rodadas)))
  ).sort((a, b) => {
    const numA = parseInt(a.substring(1));
    const numB = parseInt(b.substring(1));
    return numA - numB;
  });

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

  const sortedPlayers = [...jogadores].sort((a, b) => {
    if (sortField === "nome") {
      return sortDirection === "asc" 
        ? a.nome.localeCompare(b.nome) 
        : b.nome.localeCompare(a.nome);
    } 
    if (sortField === "pontos_total") {
      return sortDirection === "asc" 
        ? a.pontos_total - b.pontos_total 
        : b.pontos_total - a.pontos_total;
    } 
    if (sortField === "rodada" && selectedRodada !== "todas") {
      const rodadaKey = `r${selectedRodada}`;
      const pontosA = a.rodadas[rodadaKey] || 0;
      const pontosB = b.rodadas[rodadaKey] || 0;
      return sortDirection === "asc" ? pontosA - pontosB : pontosB - pontosA;
    }
    return 0;
  });

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
          <div className="flex justify-center items-center p-8">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <div className="max-h-[calc(100vh-16rem)] overflow-auto rounded-lg border border-border/50 shadow-subtle">
            <Table>
              <DynamicTableHeader
                handleSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
                todasRodadas={todasRodadas}
                selectedRodada={selectedRodada}
              />
              <TableBody>
                {sortedPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={3 + todasRodadas.length} className="text-center py-8 text-gray-500">
                      Nenhum resultado encontrado
                    </td>
                  </tr>
                ) : (
                  sortedPlayers.map((jogador, index) => (
                    <DynamicTableRow
                      key={jogador.id}
                      jogador={jogador}
                      index={index}
                      todasRodadas={todasRodadas}
                    />
                  ))
                )}
              </TableBody>
              <DynamicTableFooter
                jogadores={jogadores}
                todasRodadas={todasRodadas}
                totaisPorRodada={totaisPorRodada}
                totalGeral={totalGeral}
              />
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
