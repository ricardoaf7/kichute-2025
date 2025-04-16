
import { Match } from "@/types";
import { MatchFormValues } from "./types";
import { useMatchDelete } from "./useMatchDelete";
import { useMatchResults } from "./useMatchResults";
import { useMatchSubmit } from "./useMatchSubmit";

export const useMatchActions = (setRounds: (rounds: any) => void) => {
  const { handleDeleteMatch } = useMatchDelete(setRounds);
  const { handleUpdateResults } = useMatchResults(setRounds);
  const { handleSubmitMatch } = useMatchSubmit(setRounds);

  return {
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch
  };
};
