
import { useState, useMemo } from "react";
import { Player } from "@/types";

export type SortDirection = "asc" | "desc";
export type SortField = "name" | "totalPoints" | "roundPoints";

export const useSortedPlayers = (players: Player[], selectedRound?: number) => {
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

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedPlayers
  };
};
