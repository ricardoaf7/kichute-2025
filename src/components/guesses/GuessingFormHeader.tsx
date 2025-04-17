
import { RoundSelector } from "./RoundSelector";
import { ParticipantSelector } from "./ParticipantSelector";

interface GuessingFormHeaderProps {
  selectedRound: string;
  selectedParticipant: string;
  onRoundChange: (round: string) => void;
  onParticipantChange: (participantId: string) => void;
  isAdmin: boolean;
}

export const GuessingFormHeader = ({
  selectedRound,
  selectedParticipant,
  onRoundChange,
  onParticipantChange,
  isAdmin
}: GuessingFormHeaderProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RoundSelector 
        selectedRound={selectedRound} 
        onRoundChange={onRoundChange} 
      />
      
      {isAdmin && (
        <ParticipantSelector 
          selectedParticipant={selectedParticipant} 
          onParticipantChange={onParticipantChange} 
        />
      )}
    </div>
  );
};
