
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReportData {
  matches: any[];
  kichutes: any[];
  isLoading: boolean;
  reportTitle: string;
}

export const useReportData = (
  selectedRound: number,
  selectedMonth: string,
  selectedYear: string
): ReportData => {
  const [matches, setMatches] = useState<any[]>([]);
  const [kichutes, setKichutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reportTitle, setReportTitle] = useState<string>("");

  useEffect(() => {
    let title = "";
    if (selectedRound > 0) {
      title = `Rodada ${selectedRound} - Relatório de Palpites`;
    } else if (selectedMonth !== "all") {
      const monthNames = {
        "01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril",
        "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
        "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro"
      };
      title = `${monthNames[selectedMonth]} de ${selectedYear} - Relatório de Palpites`;
    } else {
      title = `Relatório Anual de Palpites - ${selectedYear}`;
    }
    setReportTitle(title);
  }, [selectedRound, selectedMonth, selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log("Buscando dados para", {selectedRound, selectedMonth, selectedYear});
      
      try {
        let matchesQuery = supabase.from("partidas").select(`
          id, 
          rodada, 
          time_casa:times!time_casa_id(nome, sigla), 
          time_visitante:times!time_visitante_id(nome, sigla), 
          placar_casa, 
          placar_visitante,
          data
        `);
        
        if (selectedRound > 0) {
          matchesQuery = matchesQuery.eq("rodada", selectedRound);
        }
        
        if (selectedMonth !== "all") {
          const startDate = `${selectedYear}-${selectedMonth}-01`;
          const nextMonth = parseInt(selectedMonth) + 1;
          const nextMonthStr = nextMonth > 12 ? "01" : nextMonth.toString().padStart(2, "0");
          const nextYear = nextMonth > 12 ? parseInt(selectedYear) + 1 : parseInt(selectedYear);
          const endDate = `${nextYear}-${nextMonthStr}-01`;
          
          matchesQuery = matchesQuery
            .gte("data", startDate)
            .lt("data", endDate);
        } else if (selectedYear) {
          matchesQuery = matchesQuery
            .gte("data", `${selectedYear}-01-01`)
            .lt("data", `${parseInt(selectedYear) + 1}-01-01`);
        }
        
        matchesQuery = matchesQuery.order('rodada').order('data');
        const { data: matchesData, error: matchesError } = await matchesQuery;
        
        if (matchesError) throw matchesError;
        
        console.log("Partidas encontradas:", matchesData?.length || 0);
        
        if (matchesData && matchesData.length > 0) {
          setMatches(matchesData);
          
          const matchIds = matchesData.map(m => m.id);
          
          const { data: kichutesData, error: kichutesError } = await supabase
            .from("kichutes")
            .select(`
              id, 
              palpite_casa, 
              palpite_visitante, 
              pontos, 
              jogador_id,
              jogador:jogadores(id, nome),
              partida_id
            `)
            .in("partida_id", matchIds);
          
          if (kichutesError) throw kichutesError;
          
          console.log("Kichutes encontrados:", kichutesData?.length || 0);
          setKichutes(kichutesData || []);
        } else {
          setMatches([]);
          setKichutes([]);
        }
      } catch (err) {
        console.error("Erro ao buscar dados para o relatório:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedRound, selectedMonth, selectedYear]);

  return { matches, kichutes, isLoading, reportTitle };
};
