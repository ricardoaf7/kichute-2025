
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShieldSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AVAILABLE_SHIELDS = [
  { name: "Atlético-MG", file: "/escudos/atletico_mineiro.png" },
  { name: "Bahia", file: "/escudos/bahia.png" },
  { name: "Botafogo", file: "/escudos/botafogo.png" },
  { name: "Bragantino", file: "/escudos/bragantino.png" },
  { name: "Ceará", file: "/escudos/ceara.png" },
  { name: "Corinthians", file: "/escudos/corinthians.png" },
  { name: "Cruzeiro", file: "/escudos/cruzeiro.png" },
  { name: "Flamengo", file: "/escudos/flamengo.png" },
  { name: "Fluminense", file: "/escudos/fluminense.png" },
  { name: "Fortaleza", file: "/escudos/fortaleza.png" },
  { name: "Grêmio", file: "/escudos/gremio.png" },
  { name: "Internacional", file: "/escudos/internacional.png" },
  { name: "Juventude", file: "/escudos/juventude.png" },
  { name: "Palmeiras", file: "/escudos/palmeiras.png" },
  { name: "Santos", file: "/escudos/santos.png" },
  { name: "São Paulo", file: "/escudos/sao_paulo.png" },
  { name: "Sport", file: "/escudos/sport.png" },
  { name: "Vasco", file: "/escudos/vasco.png" },
  { name: "Vitória", file: "/escudos/vitoria.png" },
];

export const ShieldSelector = ({ value, onChange }: ShieldSelectorProps) => {
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  // Check if current value is a custom URL
  const isCustomValue = !AVAILABLE_SHIELDS.some(shield => shield.file === value);

  // Handle switching to custom URL mode
  const handleCustomUrlToggle = () => {
    setUseCustomUrl(!useCustomUrl);
    if (!useCustomUrl) {
      setCustomUrl(value);
    } else {
      onChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {!useCustomUrl ? (
        <>
          <Select 
            value={isCustomValue ? "" : value}
            onValueChange={onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o escudo do time" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_SHIELDS.map((shield) => (
                <SelectItem key={shield.file} value={shield.file}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 relative flex-shrink-0">
                      <img
                        src={shield.file}
                        alt={shield.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <span>{shield.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="link"
            className="px-0 h-auto font-normal text-sm"
            onClick={handleCustomUrlToggle}
          >
            Usar URL personalizada
          </Button>
        </>
      ) : (
        <>
          <Input
            placeholder="Cole a URL do escudo"
            value={customUrl}
            onChange={(e) => {
              setCustomUrl(e.target.value);
              onChange(e.target.value);
            }}
          />
          <Button
            variant="link"
            className="px-0 h-auto font-normal text-sm"
            onClick={handleCustomUrlToggle}
          >
            Voltar para lista de escudos
          </Button>
        </>
      )}

      {value && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden">
            <img
              src={value}
              alt="Prévia do escudo"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            Prévia do escudo
          </span>
        </div>
      )}
    </div>
  );
};

