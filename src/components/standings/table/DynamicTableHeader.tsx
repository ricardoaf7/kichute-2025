
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { SortIcon } from "./SortIcon";
import { SortDirection, SortField } from "@/hooks/standings/useSortedPlayers";

interface DynamicTableHeaderProps {
  handleSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  todasRodadas: string[];
  selectedRodada: string;
}

export const DynamicTableHeader = ({
  handleSort,
  sortField,
  sortDirection,
  todasRodadas,
  selectedRodada
}: DynamicTableHeaderProps) => (
  <TableHeader>
    <TableRow className="bg-muted font-poppins">
      <TableHead className="w-10 text-left font-medium text-muted-foreground">#</TableHead>
      <TableHead 
        className="text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
        onClick={() => handleSort("nome")}
      >
        Jogador <SortIcon field="nome" currentSortField={sortField} sortDirection={sortDirection} />
      </TableHead>
      <TableHead 
        className="text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
        onClick={() => handleSort("pontos_total")}
      >
        Total <SortIcon field="pontos_total" currentSortField={sortField} sortDirection={sortDirection} />
      </TableHead>
      {todasRodadas.map(rodada => (
        <TableHead 
          key={rodada} 
          className={`text-center font-medium text-muted-foreground ${
            selectedRodada === rodada.substring(1) ? 'cursor-pointer hover:bg-muted/80' : ''
          }`}
          onClick={() => selectedRodada === rodada.substring(1) ? handleSort("rodada") : null}
        >
          {rodada.toUpperCase()}
          {selectedRodada === rodada.substring(1) && 
            <SortIcon field="rodada" currentSortField={sortField} sortDirection={sortDirection} />
          }
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
);
