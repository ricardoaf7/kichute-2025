
import { useState, useEffect } from "react";
import { Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Iniciando busca de times...");
      
      const { data, error } = await supabase
        .from('times')
        .select('*')
        .order('nome');
      
      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }
      
      console.log("Dados recebidos do Supabase:", data);
      
      // Verificação adicional para garantir que data é um array
      if (!Array.isArray(data)) {
        console.error("Dados não são um array:", data);
        throw new Error("Formato de dados inválido");
      }
      
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
    } catch (error: any) {
      console.error('Erro detalhado ao carregar times:', error);
      setError(error.message || "Erro ao carregar times");
      toast({
        title: "Erro ao carregar times",
        description: error.message || "Não foi possível carregar a lista de times.",
        variant: "destructive"
      });
      
      // Definir um array vazio para garantir que a UI possa renderizar mesmo com erro
      setTeams([]);
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
    error,
    fetchTeams
  };
};
