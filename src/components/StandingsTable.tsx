
import { useMemo } from "react";
import { Player } from "../types";
import { Table, TableBody, TableCell, TableRow, TableFooter } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StandingsTableHeader } from "./standings/StandingsTableHeader";
import { useSortedPlayers } from "@/hooks/standings/useSortedPlayers";

interface StandingsTableProps {
  players: Player[];
  showRoundPoints?: boolean;
  selectedRound?: number;
}

const StandingsTable = ({ 
  players, 
  showRoundPoints = false,
  selectedRound
}: StandingsTableProps) => {
  const { sortField, sortDirection, handleSort, sortedPlayers } = useSortedPlayers(players, selectedRound);

  const allRounds = useMemo(() => {
    const rounds = new Set<number>();
    players.forEach(player => {
      Object.keys(player.roundPoints).forEach(round => {
        rounds.add(parseInt(round));
      });
    });
    return Array.from(rounds).sort((a, b) => a - b);
  }, [players]);

  // Calculate round totals
  const roundTotals = useMemo(() => {
    const totals: { [key: number]: number } = {};
    
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

  return (
    <div className="overflow-hidden rounded-lg border border-border/50 shadow-subtle animate-fadeIn">
      <ScrollArea className="h-[calc(100vh-16rem)] w-full">
        <Table>
          <StandingsTableHeader
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            showRoundPoints={showRoundPoints}
            allRounds={allRounds}
            selectedRound={selectedRound}
          />
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow 
                key={player.id}
                className={`${
                  index % 2 === 0 ? 'bg-white dark:bg-gray-950/50' : 'bg-gray-50 dark:bg-gray-900/30'
                } hover:bg-muted/30`}
              >
                <TableCell 
                  className="sticky left-0 z-10 bg-inherit px-4 py-3 text-left"
                >
                  {index + 1}
                </TableCell>
                <TableCell 
                  className="sticky left-[65px] z-10 bg-inherit px-4 py-3 text-left font-medium"
                >
                  {player.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-center font-semibold">
                  {player.totalPoints}
                </TableCell>
                
                {showRoundPoints && allRounds.map(round => (
                  <TableCell 
                    key={`${player.id}-round-${round}`} 
                    className={`px-3 py-3 text-center ${
                      selectedRound === round ? 'font-medium' : ''
                    }`}
                  >
                    {player.roundPoints[round] || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
              <TableCell 
                className="sticky left-0 z-10 bg-inherit px-4 py-3 text-left"
              >
                -
              </TableCell>
              <TableCell 
                className="sticky left-[65px] z-10 bg-inherit px-4 py-3 text-left"
              >
                Total
              </TableCell>
              <TableCell className="px-4 py-3 text-center">
                {totalPoints}
              </TableCell>
              {showRoundPoints && allRounds.map(round => (
                <TableCell 
                  key={`total-round-${round}`}
                  className="px-3 py-3 text-center"
                >
                  {roundTotals[round] || '-'}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default StandingsTable;
