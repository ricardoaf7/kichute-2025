
import { createContext, useContext, useState, ReactNode } from "react";
import { Match, Round } from "@/types";
import { useTeams } from "@/hooks/teams/useTeams";
import { useRounds } from "./useRounds";
import { useMatchForm } from "./useMatchForm";
import { useMatchActions } from "./useMatchActions";
import { MatchesContextType, MatchFormValues } from "./types";

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const { teams } = useTeams();
  
  const { 
    rounds, 
    setRounds, 
    isLoading,
    handleAddRound, 
    handleDeleteRound 
  } = useRounds();
  
  const {
    editingMatch,
    setEditingMatch,
    resetForm,
    handleEditMatch
  } = useMatchForm();
  
  const {
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch: submitMatch
  } = useMatchActions(setRounds);

  const handleSubmitMatch = (values: MatchFormValues) => {
    const result = submitMatch(values, editingMatch);
    if (result) {
      resetForm();
    }
    return result;
  };

  const value: MatchesContextType = {
    rounds,
    selectedRound,
    editingMatch,
    isLoading,
    setRounds,
    setSelectedRound,
    setEditingMatch,
    handleAddRound,
    handleDeleteRound,
    handleEditMatch,
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch,
    resetForm
  };

  return (
    <MatchesContext.Provider value={value}>
      {children}
    </MatchesContext.Provider>
  );
};
