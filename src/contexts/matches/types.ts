
import { Match, Round, Team } from "@/types";

export interface MatchesContextType {
  rounds: Round[];
  selectedRound: number;
  editingMatch: Match | null;
  setRounds: (rounds: Round[]) => void;
  setSelectedRound: (round: number) => void;
  setEditingMatch: (match: Match | null) => void;
  handleAddRound: () => void;
  handleDeleteRound: (roundNumber: number) => void;
  handleEditMatch: (match: Match) => void;
  handleDeleteMatch: (matchId: string, roundNumber: number) => void;
  handleUpdateResults: (match: Match, homeScore: number, awayScore: number) => void;
  handleSubmitMatch: (values: MatchFormValues) => void;
  resetForm: () => void;
}

export interface MatchFormValues {
  round: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  stadium: string;
  city: string;
}
