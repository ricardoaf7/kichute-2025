
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RoundSelectorProps {
  selectedRound: string;
  onRoundChange: (round: string) => void;
  isDisabled?: boolean;
}

export const RoundSelector = ({ selectedRound, onRoundChange, isDisabled }: RoundSelectorProps) => {
  const [rounds, setRounds] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) throw error;
        
        const uniqueRounds = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setRounds(uniqueRounds);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas",
          variant: "destructive"
        });
      }
    };

    fetchRounds();
  }, [toast]);

  return (
    <div className="w-full md:w-48">
      <Label htmlFor="round-select">Rodada</Label>
      <Select 
        value={selectedRound} 
        onValueChange={onRoundChange}
        disabled={isDisabled}
      >
        <SelectTrigger id="round-select">
          <SelectValue placeholder="Selecione a rodada" />
        </SelectTrigger>
        <SelectContent>
          {rounds.map((round) => (
            <SelectItem key={`round-${round}`} value={round.toString()}>
              Rodada {round}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
