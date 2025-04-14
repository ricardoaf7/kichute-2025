
import { useState, useEffect } from "react";
import { Player } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useParticipants = () => {
  const [users, setUsers] = useState<Player[]>([]);
  const { toast } = useToast();

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('jogadores')
        .select('*');
      
      if (error) {
        console.error("Erro ao buscar participantes:", error);
        toast({
          title: "Erro ao carregar participantes",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      const mappedData = data.map(jogador => ({
        id: jogador.id,
        name: jogador.nome,
        paid: jogador.status_pagamento === 'pago',
        paidAmount: jogador.pagamento_total || 0,
        totalPoints: 0,
        roundPoints: {},
        role: jogador.tipo
      }));
      
      setUsers(mappedData);
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
      toast({
        title: "Erro ao carregar participantes",
        description: "Não foi possível carregar a lista de participantes.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return { users, setUsers, fetchParticipants };
};
