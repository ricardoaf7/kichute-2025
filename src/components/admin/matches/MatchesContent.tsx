
import { useMatches } from "@/contexts/matches";
import { MatchForm } from "./MatchForm";
import { MatchesList } from "./MatchesList";

export const MatchesContent = () => {
  const { selectedRound, setSelectedRound, editingMatch, resetForm, handleSubmitMatch } = useMatches();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <MatchForm 
          selectedRound={selectedRound}
          editingMatch={editingMatch}
          onSubmit={handleSubmitMatch}
          onCancel={resetForm}
        />
      </div>

      <div className="lg:col-span-2">
        <MatchesList 
          selectedRound={selectedRound}
          onSelectRound={setSelectedRound}
        />
      </div>
    </div>
  );
};
