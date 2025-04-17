
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useParticipants } from "@/hooks/useParticipants";

interface ParticipantSelectorProps {
  selectedParticipant: string;
  onParticipantChange: (participant: string) => void;
  isRequired?: boolean;
}

export const ParticipantSelector = ({ 
  selectedParticipant, 
  onParticipantChange,
  isRequired = true 
}: ParticipantSelectorProps) => {
  const { participants } = useParticipants();

  return (
    <div className="w-full md:w-48">
      <Label htmlFor="participant-select">Participante</Label>
      <Select 
        value={selectedParticipant} 
        onValueChange={onParticipantChange}
        required={isRequired}
      >
        <SelectTrigger id="participant-select">
          <SelectValue placeholder="Selecione o participante" />
        </SelectTrigger>
        <SelectContent>
          {participants.map((participant) => (
            <SelectItem key={participant.id} value={participant.id}>
              {participant.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
