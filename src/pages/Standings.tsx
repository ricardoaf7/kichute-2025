import { useState, useEffect } from "react";
import StandingsHeader from "../components/standings/StandingsHeader";
import StandingsContent from "../components/standings/StandingsContent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import RoundScoreTable from "../components/standings/RoundScoreTable";

const Standings = () => {
  const [viewMode, setViewMode] = useState<"table" | "cards" | "dynamic">(
    "dynamic"
  );
  const [selectedRound, setSelectedRound] = useState<number | undefined>(
    undefined
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [useDynamicTable, setUseDynamicTable] = useState<boolean>(true);
  const [availableRounds, setAvailableRounds] = useState<number[]>([]);
  const { toast } = useToast();

  // 1) Buscar rodadas disponíveis do Supabase
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const { data, error } = await supabase
          .from("partidas")
          .select("rodada")
          .order("rodada");

        if (error) throw error;

        const uniqueRounds = [
          ...new Set(data?.map((item) => item.rodada)),
        ].filter(Boolean) as number[];
        setAvailableRounds(uniqueRounds);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas disponíveis",
          variant: "destructive",
        });
      } finally {
        setIsLoaded(true);
      }
    };

    fetchRounds();
  }, [toast]);

  // 2) Sempre que mudar a rodada, chama o /update no Deno Deploy
  useEffect(() => {
    if (selectedRound) {
      fetch(
        `https://kichute-update-endpoint.deno.dev/update?rodada=${selectedRound}`
      )
        .then((res) => res.json())
        .then((data) => console.log("Pontuação atualizada:", data))
        .catch((err) =>
          console.error("Erro ao atualizar pontuação:", err)
        );
    }
  }, [selectedRound]);

  // 3) Handlers de seleção
  const handleRoundChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedRound(
      value === "total" ? undefined : parseInt(value, 10)
    );
    if (value !== "total") {
      setSelectedMonth("all");
    }
  };

  const handleMonthChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMonth(e.target.value);
    if (e.target.value !== "all") {
      setSelectedRound(undefined);
    }
  };

  const handleYearChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedYear(e.target.value);
  };

  // 4) Render da tela de Classificação
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
              <h2 className="text-xl font-semibold mb-4">
                Pontuação da Rodada {selectedRound}
              </h2>
              <RoundScoreTable selectedRound={selectedRound} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Standings;
