
import { useState } from "react";
import { JogadorData } from "./useDynamicTableDataReal";

export type SortDirection = "asc" | "desc";
export type SortField = "nome" | "pontos_total" | "rodada";

export const useSortedPlayers = (jogadores: JogadorData[], selectedRodada: string) => {
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

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedPlayers
  };
};
