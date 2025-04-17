
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Participant = {
  id: string;
  nome: string;
};

export const useParticipants = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data, error } = await supabase
          .from('jogadores')
          .select('id, nome')
          .order('nome');

        if (error) throw error;
        setParticipants(data || []);
      } catch (err) {
        console.error("Erro ao buscar participantes:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a lista de participantes",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [toast]);

  return { participants, isLoading };
};
