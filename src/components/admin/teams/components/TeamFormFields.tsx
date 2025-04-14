
import { Team } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldSelector } from "../ShieldSelector";

interface TeamFormFieldsProps {
  formData: {
    name: string;
    shortName: string;
    logoUrl: string;
    stadium: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoChange: (url: string) => void;
}

const TeamFormFields = ({
  formData,
  onInputChange,
  onLogoChange
}: TeamFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome do Time</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nome completo do time"
          value={formData.name}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="shortName">Sigla</Label>
        <Input
          id="shortName"
          name="shortName"
          placeholder="Abreviação (ex: FLA, PAL)"
          value={formData.shortName}
          onChange={onInputChange}
          maxLength={3}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stadium">Estádio</Label>
        <Input
          id="stadium"
          name="stadium"
          placeholder="Nome do estádio onde o time joga em casa"
          value={formData.stadium}
          onChange={onInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label>Escudo do Time</Label>
        <ShieldSelector
          value={formData.logoUrl}
          onChange={onLogoChange}
        />
      </div>
    </div>
  );
};

export default TeamFormFields;
