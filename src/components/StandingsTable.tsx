import { useState, useMemo, useEffect } from "react";
import { Player } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";

interface StandingsTableProps {
  players: Player[];
  showRoundPoints?: boolean;
  selectedRound?: number;
}

type SortDirection = "asc" | "desc";
type SortField = "name" | "totalPoints" | "roundPoints";

export default function StandingsTable({
  players,
  showRoundPoints = false,
  selectedRound
}: StandingsTableProps) {
  const [sortField, setSortField] = useState<SortField>("totalPoints");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Sort players
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortField === "totalPoints") {
        return sortDirection === "asc"
          ? a.totalPoints - b.totalPoints
          : b.totalPoints - a.totalPoints;
      }
      if (sortField === "roundPoints" && selectedRound != null) {
        const aPts = a.roundPoints[selectedRound] || 0;
        const bPts = b.roundPoints[selectedRound] || 0;
        return sortDirection === "asc" ? aPts - bPts : bPts - aPts;
      }
      return 0;
    });
  }, [players, sortField, sortDirection, selectedRound]);

  // Collect all rounds
  const allRounds = useMemo(() => {
    const setRounds = new Set<number>();
    players.forEach(p => {
      Object.keys(p.roundPoints).forEach(key => setRounds.add(Number(key)));
    });
    return Array.from(setRounds).sort((a, b) => a - b);
  }, [players]);

  // Totals calculation
  const roundTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    if (showRoundPoints) {
      allRounds.forEach(r => {
        totals[r] = players.reduce((sum, p) => sum + (p.roundPoints[r] || 0), 0);
      });
    }
    return totals;
  }, [players, allRounds, showRoundPoints]);

  const totalPoints = useMemo(
    () => players.reduce((sum, p) => sum + p.totalPoints, 0),
    [players]
  );

  // Debug logs
  useEffect(() => {
    console.log("Round Totals:", roundTotals);
    console.log("Overall Total:", totalPoints);
  }, [roundTotals, totalPoints]);

  // Icon
  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex ml-1 text-muted-foreground">
      {sortField === field ? (
        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4 opacity-30" />
      )}
    </span>
  );

  return (
    // Use native overflow auto
    <div className="max-h-[calc(100vh-16rem)] overflow-auto rounded-lg border border-border/50 shadow-subtle animate-fadeIn">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 left-0 z-30 bg-muted px-4 py-3 font-medium text-muted-foreground" style={{ minWidth: '65px' }}>#</TableHead>
            <TableHead className="sticky top-0 left-[65px] z-30 bg-muted px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:bg-muted/80" style={{ minWidth: '200px' }} onClick={() => handleSort('name')}>Nome<SortIcon field="name"/></TableHead>
            <TableHead className="sticky top-0 z-30 bg-muted px-4 py-3 text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80" onClick={() => handleSort('totalPoints')}>Total<SortIcon field="totalPoints"/></TableHead>
            {showRoundPoints && allRounds.map(r => (
              <TableHead key={r} className={`sticky top-0 z-30 bg-muted px-3 py-3 text-center font-medium text-muted-foreground ${selectedRound === r ? 'cursor-pointer hover:bg-muted/80' : ''}`} onClick={() => selectedRound === r && handleSort('roundPoints')}>R{r}{selectedRound===r&&<SortIcon field="roundPoints"/>}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPlayers.map((p, idx) => (
            <TableRow key={p.id} className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-950/50' : 'bg-gray-50 dark:bg-gray-900/30'} hover:bg-muted/30`}>
              <TableCell className="sticky left-0 z-20 bg-inherit px-4 py-3">{idx+1}</TableCell>
              <TableCell className="sticky left-[65px] z-20 bg-inherit px-4 py-3 font-medium">{p.name}</TableCell>
              <TableCell className="px-4 py-3 text-center font-semibold">{p.totalPoints}</TableCell>
              {showRoundPoints && allRounds.map(r => (
                <TableCell key={`${p.id}-${r}`} className="px-3 py-3 text-center">{p.roundPoints[r] ?? '-'}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {showRoundPoints && (
          <TableFooter>
            <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
              <TableCell className="sticky bottom-0 left-0 z-30 bg-muted px-4 py-3">-</TableCell>
              <TableCell className="sticky bottom-0 left-[65px] z-30 bg-muted px-4 py-3">Total</TableCell>
              <TableCell className="sticky bottom-0 z-30 px-4 py-3 text-center">{totalPoints}</TableCell>
              {allRounds.map(r => (
                <TableCell key={`total-${r}`} className="sticky bottom-0 z-30 px-3 py-3 text-center">{roundTotals[r] ?? '-'}</TableCell>
              ))}
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
