
import { useState, useEffect } from "react";
import { Kichute } from "@/types/kichute";
import { useKichuteQuery } from "./useKichuteQuery";
import { formatKichuteData, sortKichutes } from "@/utils/kichute-formatters";

export const useKichuteData = (selectedRodada: string, selectedJogador: string) => {
  const [kichutes, setKichutes] = useState<Kichute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchKichutes } = useKichuteQuery();

  useEffect(() => {
    const loadKichutes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchKichutes(selectedRodada, selectedJogador);
        const formattedData = formatKichuteData(data);
        const sortedData = sortKichutes(formattedData);
        setKichutes(sortedData);
      } catch (err) {
        console.error("Erro ao buscar kichutes:", err);
        setError("Não foi possível carregar os kichutes");
      } finally {
        setIsLoading(false);
      }
    };

    loadKichutes();
  }, [selectedRodada, selectedJogador, fetchKichutes]);

  return { kichutes, isLoading, error };
};
