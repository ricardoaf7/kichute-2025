
import React, { useRef, useState } from "react";
import { useMatches, MatchesProvider } from "@/contexts/MatchesContext";
import { useParticipants } from "@/hooks/useParticipants";
import { useCurrentRound } from "@/hooks/useCurrentRound";
import { ReportFilters } from "@/components/round-report/ReportFilters";
import { ReportContent } from "@/components/round-report/ReportContent";
import { ReportActions } from "@/components/round-report/ReportActions";
import { useReportData } from "@/hooks/useReportData";

const RoundReportContent = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { rounds, selectedRound, setSelectedRound } = useMatches();
  const { participants } = useParticipants();
  const { currentRound, isLoading: isLoadingCurrentRound } = useCurrentRound();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2025");

  React.useEffect(() => {
    if (!isLoadingCurrentRound && currentRound > 1) {
      setSelectedRound(currentRound - 1);
    }
  }, [isLoadingCurrentRound, currentRound, setSelectedRound]);

  const { matches, kichutes, isLoading, reportTitle } = useReportData(
    selectedRound,
    selectedMonth,
    selectedYear
  );

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
              rounds={rounds}
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
          <ReportContent
            matches={matches}
            participants={participants}
            kichutes={kichutes}
            isLoading={isLoading}
            reportTitle={reportTitle}
          />
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
