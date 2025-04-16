
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
      console.log("Iniciando busca de times...");
      
      const { data, error } = await supabase
        .from('times')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      
      console.log("Dados recebidos do Supabase:", data);
      
      const transformedTeams: Team[] = data.map(team => ({
        id: team.id,
        name: team.nome,
        shortName: team.sigla,
        homeStadium: team.estadio || "",
        city: team.cidade || "",
        logoUrl: team.escudo_url
      }));
      
      console.log("Times transformados:", transformedTeams);
      
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
    console.log("useEffect do useTeams executado");
    fetchTeams();
  }, []);

  return {
    teams,
    setTeams,
    isLoading,
    fetchTeams
  };
};
