
import { useState, useMemo } from "react";
import { Player } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StandingsTableProps {
  players: Player[];
  showRoundPoints?: boolean;
  selectedRound?: number;
}

type SortDirection = "asc" | "desc";
type SortField = "name" | "totalPoints" | "roundPoints";

const StandingsTable = ({ 
  players, 
  showRoundPoints = false,
  selectedRound
}: StandingsTableProps) => {
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

  // Get all rounds across all players
  const allRounds = useMemo(() => {
    const rounds = new Set<number>();
    players.forEach(player => {
      Object.keys(player.roundPoints).forEach(round => {
        rounds.add(parseInt(round));
      });
    });
    return Array.from(rounds).sort((a, b) => a - b);
  }, [players]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex ml-1 text-muted-foreground">
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ChevronDown className="h-4 w-4 opacity-30" />
      )}
    </span>
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50 shadow-subtle animate-fadeIn">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
            <th
              className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort("name")}
            >
              Jogador
              <SortIcon field="name" />
            </th>
            <th
              className="px-4 py-3 text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
              onClick={() => handleSort("totalPoints")}
            >
              Total
              <SortIcon field="totalPoints" />
            </th>
            
            {showRoundPoints && allRounds.map(round => (
              <th 
                key={`round-${round}`} 
                className={`px-3 py-3 text-center font-medium text-muted-foreground ${
                  selectedRound === round ? 'cursor-pointer hover:bg-muted/80' : ''
                }`}
                onClick={() => selectedRound === round ? handleSort("roundPoints") : null}
              >
                R{round}
                {selectedRound === round && <SortIcon field="roundPoints" />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr 
              key={player.id} 
              className={`border-t border-border/30 transition-colors ${
                index % 2 === 0 ? 'bg-white dark:bg-gray-950/50' : 'bg-gray-50 dark:bg-gray-900/30'
              } hover:bg-muted/30`}
            >
              <td className="px-4 py-3 text-left">{index + 1}</td>
              <td className="px-4 py-3 text-left font-medium">{player.name}</td>
              <td className="px-4 py-3 text-center font-semibold">{player.totalPoints}</td>
              
              {showRoundPoints && allRounds.map(round => (
                <td 
                  key={`${player.id}-round-${round}`} 
                  className={`px-3 py-3 text-center ${
                    selectedRound === round ? 'font-medium' : ''
                  }`}
                >
                  {player.roundPoints[round] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
