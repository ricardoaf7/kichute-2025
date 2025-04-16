
import { Match } from "@/types";
import { MatchFormValues } from "./types";
import { useMatchDelete } from "./useMatchDelete";
import { useMatchResults } from "./useMatchResults";
import { useMatchSubmit } from "./useMatchSubmit";
import { Round } from "@/types";

export const useMatchActions = (setRounds: React.Dispatch<React.SetStateAction<Round[]>>) => {
  const { handleDeleteMatch } = useMatchDelete(setRounds);
  const { handleUpdateResults } = useMatchResults(setRounds);
  const { handleSubmitMatch } = useMatchSubmit(setRounds);

  return {
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch
  };
};
