
import { useState } from "react";
import { Match } from "@/types";
import { MatchFormValues } from "./types";

export const useMatchForm = () => {
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const resetForm = () => {
    setEditingMatch(null);
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
  };

  return {
    editingMatch,
    setEditingMatch,
    resetForm,
    handleEditMatch
  };
};
