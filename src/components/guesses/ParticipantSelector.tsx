
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useParticipants } from "@/hooks/useParticipants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ParticipantSelectorProps {
  selectedParticipant: string;
  onParticipantChange: (participant: string) => void;
  isRequired?: boolean;
  showError?: boolean;
}

export const ParticipantSelector = ({ 
  selectedParticipant, 
  onParticipantChange,
  isRequired = true,
  showError = false
}: ParticipantSelectorProps) => {
  const { participants, isLoading } = useParticipants();

  const handleChange = (value: string) => {
    console.log("Participante selecionado:", value);
    onParticipantChange(value);
  };

  return (
    <div className="w-full space-y-2">
      <div>
        <Label htmlFor="participant-select">Participante</Label>
        <Select 
          value={selectedParticipant} 
          onValueChange={handleChange}
          required={isRequired}
          disabled={isLoading}
        >
          <SelectTrigger id="participant-select" className="w-full md:w-72">
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

      {showError && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            Você precisa selecionar o participante que está fazendo os palpites.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
