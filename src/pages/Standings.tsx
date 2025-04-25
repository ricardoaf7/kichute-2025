
import { useState, useEffect } from "react";
import StandingsHeader from "../components/standings/StandingsHeader";
import StandingsContent from "../components/standings/StandingsContent";
import RoundScoreTable from "../components/standings/RoundScoreTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentRound } from "@/hooks/useCurrentRound";

const Standings = () => {
  const [viewMode, setViewMode] =
    useState<"table" | "dynamic">("dynamic");
  const [selectedRound, setSelectedRound] =
    useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [availableRounds, setAvailableRounds] = useState<number[]>([]);
  const { toast } = useToast();
  const { currentRound, isLoading: isLoadingCurrentRound } = useCurrentRound();

  // 1) Carregar rodadas disponíveis
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

        // Inicializa a rodada para classificação: usar última rodada FINALIZADA
        if (!selectedRound && !isLoadingCurrentRound && uniqueRounds.length > 0 && currentRound > 1) {
          setSelectedRound(currentRound - 1);
        }
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas",
          variant: "destructive",
        });
      } finally {
        setIsLoaded(true);
      }
    };
    fetchRounds();
    // eslint-disable-next-line
  }, [toast, isLoadingCurrentRound, currentRound]);

  // 2) Auto-update ao mudar selectedRound (escolha A)
  useEffect(() => {
    if (selectedRound !== undefined) {
      fetch(
        `https://kichute-update-endpoint.deno.dev/update?rodada=${selectedRound}`
      )
        .then((res) => res.json())
        .then((json) => console.log("Update automático:", json))
        .catch((err) => console.error("Erro update automático:", err));
    }
  }, [selectedRound]);

  // 3) Quando o usuário muda a rodada manualmente
  const handleRoundChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    const round =
      value === "total" ? undefined : parseInt(value, 10);

    if (round !== undefined) {
      toast({ title: "Atualizando pontuação...", variant: "default" });
      try {
        const res = await fetch(
          `https://kichute-update-endpoint.deno.dev/update?rodada=${round}`
        );
        const json = await res.json();
        console.log("Pontuação atualizada:", json);
      } catch (err) {
        console.error("Erro ao atualizar pontuação:", err);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar pontuação.",
          variant: "destructive",
        });
      }
    }

    setSelectedRound(round);
    if (value !== "total") {
      setSelectedMonth("all");
    }
  };

  // 4) Handlers de mês e ano
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

  // 5) Render da tela
  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Classificação</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe a pontuação de cada jogador no bolão
          </p>
        </div>

        {/* Pontuação da rodada vem antes do filtro */}
        {selectedRound && (
          <div className="mt-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Pontuação da Rodada {selectedRound}
            </h2>
            <RoundScoreTable selectedRound={selectedRound} />
          </div>
        )}

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
        />

        <div className="space-y-8">
          <StandingsContent
            viewMode={viewMode}
            selectedRound={selectedRound}
            isLoaded={isLoaded}
          />
        </div>
      </div>
    </div>
  );
};
export default Standings;
