
import { MatchFormValues } from "@/contexts/MatchesContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UseFormReturn, UseFormSetError } from "react-hook-form";
import { useState, useEffect } from "react";

export const useMatchValidation = (
  form: UseFormReturn<MatchFormValues>,
  selectedRound: number,
  editingMatchId: string | null
) => {
  const { toast } = useToast();
  const [matchesInRound, setMatchesInRound] = useState(0);
  
  // Fetch matches in current round to check for duplicates and count
  const fetchRoundMatches = async () => {
    const { data, error } = await supabase
      .from('partidas')
      .select('*')
      .eq('rodada', selectedRound);
    
    if (error) {
      toast({
        title: "Erro ao carregar partidas",
        description: "Não foi possível verificar as partidas da rodada.",
        variant: "destructive"
      });
      return;
    }
    
    setMatchesInRound(data ? data.length : 0);
  };

  useEffect(() => {
    fetchRoundMatches();
  }, [selectedRound]);
  
  // Verificar se há times duplicados selecionados
  const validateTeamSelection = async () => {
    const homeTeam = form.getValues("homeTeam");
    const awayTeam = form.getValues("awayTeam");
    
    // Check for team duplication in the same round
    const { data: duplicateMatches, error } = await supabase
      .from('partidas')
      .select('*')
      .eq('rodada', selectedRound)
      .or(`time_casa_id.eq.${homeTeam},time_casa_id.eq.${awayTeam},time_visitante_id.eq.${homeTeam},time_visitante_id.eq.${awayTeam}`);
    
    if (error) {
      toast({
        title: "Erro de validação",
        description: "Não foi possível verificar times duplicados.",
        variant: "destructive"
      });
      return false;
    }
    
    if (homeTeam === awayTeam) {
      form.setError("awayTeam", {
        type: "manual",
        message: "O time visitante deve ser diferente do time da casa"
      });
      return false;
    }
    
    // Se estiver editando, precisamos filtrar o próprio match da validação
    const filteredMatches = editingMatchId 
      ? duplicateMatches?.filter(match => match.id !== editingMatchId) 
      : duplicateMatches;
    
    if (filteredMatches && filteredMatches.length > 0) {
      form.setError("awayTeam", {
        type: "manual",
        message: "Este time já está cadastrado nesta rodada"
      });
      return false;
    }
    
    // Check round match limit
    if (matchesInRound >= 10 && !editingMatchId) {
      toast({
        title: "Limite de partidas excedido",
        description: "Só é possível cadastrar 10 partidas por rodada.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  return { 
    validateTeamSelection, 
    matchesInRound
  };
};
