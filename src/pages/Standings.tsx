
import { useState, useEffect } from "react";
import StandingsHeader from "../components/standings/StandingsHeader";
import StandingsContent from "../components/standings/StandingsContent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import RoundScoreTable from "../components/standings/RoundScoreTable";

const Standings = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards" | "dynamic">("dynamic");
  const [selectedRound, setSelectedRound] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isLoaded, setIsLoaded] = useState(false);
  const [useDynamicTable, setUseDynamicTable] = useState(true);
  const [availableRounds, setAvailableRounds] = useState<number[]>([]);
  const { toast } = useToast();

  // Buscar rodadas disponíveis
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) {
          throw error;
        }
        
        // Obter rodadas únicas
        const uniqueRounds = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setAvailableRounds(uniqueRounds);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas disponíveis",
          variant: "destructive"
        });
      } finally {
        setIsLoaded(true);
      }
    };

    fetchRounds();
  }, [toast]);

  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRound(value === "total" ? undefined : parseInt(value));
    // Reset month when selecting a specific round
    if (value !== "total") {
      setSelectedMonth("all");
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    // Reset round when selecting a specific month
    if (e.target.value !== "all") {
      setSelectedRound(undefined);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Classificação</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe a pontuação de cada jogador no bolão
          </p>
        </div>

        <StandingsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedRound={selectedRound}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          allRounds={availableRounds}
          handleRoundChange={handleRoundChange}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          useDynamicTable={useDynamicTable}
          setUseDynamicTable={setUseDynamicTable}
        />

        <div className="space-y-8">
          <StandingsContent
            viewMode={viewMode}
            sortedPlayers={[]} // Não usado quando viewMode é dynamic
            selectedRound={selectedRound}
            isLoaded={isLoaded}
          />

          {selectedRound && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Pontuação da Rodada {selectedRound}</h2>
              <RoundScoreTable selectedRound={selectedRound} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Standings;
