
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { SortIcon } from "./SortIcon";
import { SortField, SortDirection } from "@/hooks/standings/useSortedPlayers";

interface StandingsTableHeaderProps {
  handleSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  showRoundPoints: boolean;
  allRounds: number[];
  selectedRound?: number;
}

export const StandingsTableHeader = ({
  handleSort,
  sortField,
  sortDirection,
  showRoundPoints,
  allRounds,
  selectedRound
}: StandingsTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      <TableHead 
        className="sticky left-0 z-20 bg-muted/50 px-4 py-3 text-left font-medium text-muted-foreground"
        style={{ minWidth: "200px" }}
      >
        #
      </TableHead>
      <TableHead
        className="sticky left-[65px] z-20 bg-muted/50 px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
        style={{ minWidth: "200px" }}
        onClick={() => handleSort("name")}
      >
        Nome
        <SortIcon field="name" currentSortField={sortField} sortDirection={sortDirection} />
      </TableHead>
      <TableHead
        className="px-4 py-3 text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
        onClick={() => handleSort("totalPoints")}
      >
        Total
        <SortIcon field="totalPoints" currentSortField={sortField} sortDirection={sortDirection} />
      </TableHead>
      
      {showRoundPoints && allRounds.map(round => (
        <TableHead 
          key={`round-${round}`} 
          className={`px-3 py-3 text-center font-medium text-muted-foreground ${
            selectedRound === round ? 'cursor-pointer hover:bg-muted/80' : ''
          }`}
          onClick={() => selectedRound === round ? handleSort("roundPoints") : null}
        >
          R{round}
          {selectedRound === round && 
            <SortIcon 
              field="roundPoints" 
              currentSortField={sortField} 
              sortDirection={sortDirection} 
            />
          }
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
);
