import React, { useRef, useEffect, useState } from "react";
import { useMatches, MatchesProvider } from "@/contexts/MatchesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchesReportTable } from "@/components/round-report/MatchesReportTable";
import { ReportActions } from "@/components/round-report/ReportActions";
import { useParticipants } from "@/hooks/useParticipants";
import { useMatchesByRound } from "@/hooks/useMatchesByRound";
import { useCurrentRound } from "@/hooks/useCurrentRound";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const ReportFilters = ({
  selectedRound,
  setSelectedRound,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}) => {
  const { rounds } = useMatches();

  const months = [
    { value: "all", label: "Todos os meses" },
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const years = [
    { value: "2025", label: "2025" }
  ];

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <div className="w-full sm:w-auto">
        <Select value={selectedRound.toString()} onValueChange={(value) => setSelectedRound(Number(value))}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Rodada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todas as rodadas</SelectItem>
            {rounds.map((round) => (
              <SelectItem key={`round-${round}`} value={round.toString()}>
                Rodada {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const RoundReportContent = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { rounds, selectedRound, setSelectedRound } = useMatches();
  const { participants, isLoading: isLoadingParticipants } = useParticipants();
  const [initialReportRound, setInitialReportRound] = useState<number>(1);
  const { currentRound, isLoading: isLoadingCurrentRound } = useCurrentRound();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
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
    if (!isLoadingCurrentRound && currentRound > 1) {
      setInitialReportRound(currentRound - 1);
      setSelectedRound(currentRound - 1);
    }
  }, [isLoadingCurrentRound, currentRound]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
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
          let endDate;
          
          const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
          endDate = `${selectedYear}-${selectedMonth}-${lastDay}`;
          
          matchesQuery = matchesQuery
            .gte("data", startDate)
            .lte("data", endDate);
        } else if (selectedYear) {
          matchesQuery = matchesQuery
            .gte("data", `${selectedYear}-01-01`)
            .lte("data", `${selectedYear}-12-31`);
        }
        
        const { data: matchesData, error: matchesError } = await matchesQuery;
        
        if (matchesError) throw matchesError;
        
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

  const formattedMatches = matches.map(match => ({
    id: match.id,
    rodada: match.rodada,
    time_casa: match.time_casa,
    time_visitante: match.time_visitante,
    placar_casa: match.placar_casa,
    placar_visitante: match.placar_visitante
  }));

  return (
    <div className="container mx-auto px-4 py-8 pt-20 print:pt-8 print:px-0">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Relatório de Palpites</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <ReportFilters 
              selectedRound={selectedRound}
              setSelectedRound={setSelectedRound}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
            <ReportActions 
              reportRef={reportRef}
              selectedRound={selectedRound}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              title={reportTitle}
            />
          </div>
        </div>
        
        <div ref={reportRef} className="bg-background print:bg-white">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-lg text-muted-foreground">Carregando dados...</p>
            </div>
          ) : formattedMatches.length > 0 ? (
            <Card>
              <CardHeader className="bg-muted print:bg-white">
                <CardTitle className="text-xl">{reportTitle}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MatchesReportTable
                  matches={formattedMatches}
                  participants={participants}
                  kichutes={kichutes}
                  fontSize="sm"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8">
              <p className="text-lg text-muted-foreground">
                Nenhuma partida disponível para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RoundReport = () => {
  return (
    <MatchesProvider>
      <RoundReportContent />
    </MatchesProvider>
  );
};

export default RoundReport;
