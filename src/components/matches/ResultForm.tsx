
import { useState } from "react";
import { Match } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScoreInput } from "../match/ScoreInput";

interface ResultFormProps {
  match: Match;
  onResultSaved: () => void;
}

export const ResultForm = ({ match, onResultSaved }: ResultFormProps) => {
  const [homeScore, setHomeScore] = useState<number>(match.homeScore || 0);
  const [awayScore, setAwayScore] = useState<number>(match.awayScore || 0);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('partidas')
        .update({
          placar_casa: homeScore,
          placar_visitante: awayScore
        })
        .eq('id', match.id);

      if (error) throw error;

      toast({
        title: "Resultado salvo",
        description: "O resultado da partida foi atualizado com sucesso."
      });
      
      onResultSaved();
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o resultado da partida.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex flex-col items-center">
          <span className="font-medium mb-2">{match.homeTeam.name}</span>
          <ScoreInput
            teamName={match.homeTeam.name}
            score={homeScore}
            onChange={setHomeScore}
            isDisabled={isSaving}
          />
        </div>
        
        <span className="text-lg font-bold">x</span>
        
        <div className="flex flex-col items-center">
          <span className="font-medium mb-2">{match.awayTeam.name}</span>
          <ScoreInput
            teamName={match.awayTeam.name}
            score={awayScore}
            onChange={setAwayScore}
            isDisabled={isSaving}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={isSaving}
        className="w-full"
      >
        Salvar Resultado
      </Button>
    </div>
  );
};
