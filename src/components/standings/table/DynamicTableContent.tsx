
import { Table, TableBody } from "@/components/ui/table";
import { DynamicTableHeader } from "./DynamicTableHeader";
import { DynamicTableRow } from "./DynamicTableRow";
import { DynamicTableFooter } from "./DynamicTableFooter";
import { TableEmptyState } from "./TableEmptyState";
import { JogadorData } from "@/hooks/standings/useDynamicTableDataReal";
import { SortDirection, SortField } from "@/hooks/standings/useSortedPlayers";

interface DynamicTableContentProps {
  sortedPlayers: JogadorData[];
  todasRodadas: string[];
  totaisPorRodada: Record<string, number>;
  totalGeral: number;
  handleSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  selectedRodada: string;
}

export const DynamicTableContent = ({
  sortedPlayers,
  todasRodadas,
  totaisPorRodada,
  totalGeral,
  handleSort,
  sortField,
  sortDirection,
  selectedRodada
}: DynamicTableContentProps) => (
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
          <TableEmptyState colSpan={3 + todasRodadas.length} />
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
      {sortedPlayers.length > 0 && (
        <DynamicTableFooter
          jogadores={sortedPlayers}
          todasRodadas={todasRodadas}
          totaisPorRodada={totaisPorRodada}
          totalGeral={totalGeral}
        />
      )}
    </Table>
  </div>
);
