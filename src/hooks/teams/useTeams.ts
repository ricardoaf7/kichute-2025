
import { useState, useEffect } from "react";
import { Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('times')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      
      const transformedTeams: Team[] = data.map(team => ({
        id: team.id,
        name: team.nome,
        shortName: team.sigla,
        homeStadium: "",
        city: "",
        logoUrl: team.escudo_url
      }));
      
      setTeams(transformedTeams);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
      toast({
        title: "Erro ao carregar times",
        description: "Não foi possível carregar a lista de times.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    setTeams,
    isLoading,
    fetchTeams
  };
};
