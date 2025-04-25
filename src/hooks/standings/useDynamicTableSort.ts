
import { useState } from "react";

export type SortDirection = "asc" | "desc";
export type SortField = "nome" | "pontos_total" | "rodada" | "name" | "totalPoints" | "roundPoints";

export const useDynamicTableSort = () => {
  const [sortField, setSortField] = useState<SortField>("pontos_total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return {
    sortField,
    sortDirection,
    handleSort
  };
};
