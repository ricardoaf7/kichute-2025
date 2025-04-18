import { useState, useMemo, useEffect } from "react";
import { Player } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "totalPoints") {
        return sortDirection === "asc"
          ? a.totalPoints - b.totalPoints
          : b.totalPoints - a.totalPoints;
      } else if (sortField === "roundPoints" && selectedRound) {
        const aPoints = a.roundPoints[selectedRound] || 0;
        const bPoints = b.roundPoints[selectedRound] || 0;
        return sortDirection === "asc" ? aPoints - bPoints : bPoints - aPoints;
      }
      return 0;
    });
  }, [players, sortField, sortDirection, selectedRound]);

  const allRounds = useMemo(() => {
    const rounds = new Set<number>();
    players.forEach(player => {
      Object.keys(player.roundPoints).forEach(round => {
        rounds.add(parseInt(round, 10));
      });
    });
    return Array.from(rounds).sort((a, b) => a - b);
  }, [players]);

  // Calculate round totals
  const roundTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    if (showRoundPoints) {
      allRounds.forEach(round => {
        totals[round] = players.reduce((sum, player) => {
          return sum + (player.roundPoints[round] || 0);
        }, 0);
      });
    }
    return totals;
  }, [players, allRounds, showRoundPoints]);

  const totalPoints = useMemo(() => {
    return players.reduce((sum, player) => sum + player.totalPoints, 0);
  }, [players]);

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
    <div className="overflow-hidden rounded-lg border border-border/50 shadow-subtle animate-fadeIn">
      <ScrollArea className="h-[calc(100vh-16rem)] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="sticky top-0 left-0 z-20 bg-muted/50 px-4 py-3 text-left font-medium text-muted-foreground"
                style={{ minWidth: "65px" }}
              >
                #
              </TableHead>
              <TableHead
                className="sticky top-0 left-[65px] z-20 bg-muted/50 px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                style={{ minWidth: "200px" }}
                onClick={() => handleSort("name")}
              >
                Nome<SortIcon field="name" />
              </TableHead>
              <TableHead
                className="sticky top-0 z-20 px-4 py-3 text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort("totalPoints")}
              >
                Total<SortIcon field="totalPoints" />
              </TableHead>

              {showRoundPoints && allRounds.map(round => (
                <TableHead
                  key={`round-${round}`}
                  className={`sticky top-0 px-3 py-3 text-center font-medium text-muted-foreground ${
                    selectedRound === round ? 'cursor-pointer hover:bg-muted/80' : ''
                  }`}
                  onClick={() => selectedRound === round && handleSort("roundPoints")}
                >
                  R{round}{selectedRound === round && <SortIcon field="roundPoints" />}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow
                key={player.id}
                className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-950/50' : 'bg-gray-50 dark:bg-gray-900/30'} hover:bg-muted/30`}
              >
                <TableCell className="sticky left-0 z-10 bg-inherit px-4 py-3 text-left">
                  {index + 1}
                </TableCell>
                <TableCell className="sticky left-[65px] z-10 bg-inherit px-4 py-3 text-left font-medium">
                  {player.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-center font-semibold">
                  {player.totalPoints}
                </TableCell>

                {showRoundPoints && allRounds.map(round => (
                  <TableCell
                    key={`${player.id}-round-${round}`}
                    className={`px-3 py-3 text-center ${selectedRound === round ? 'font-medium' : ''}`}
                  >
                    {player.roundPoints[round] ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          {showRoundPoints && (
            <TableFooter>
              <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
                <TableCell className="sticky bottom-0 left-0 z-20 bg-muted/30 px-4 py-3 text-left">
                  -
                </TableCell>
                <TableCell className="sticky bottom-0 left-[65px] z-20 bg-muted/30 px-4 py-3 text-left">
                  Total
                </TableCell>
                <TableCell className="sticky bottom-0 z-20 px-4 py-3 text-center">
                  {totalPoints}
                </TableCell>
                {allRounds.map(round => (
                  <TableCell
                    key={`total-round-${round}`}
                    className="sticky bottom-0 z-20 px-3 py-3 text-center"
                  >
                    {roundTotals[round] ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </ScrollArea>
    </div>
  );
}
