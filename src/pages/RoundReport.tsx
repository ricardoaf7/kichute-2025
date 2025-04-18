
import React, { useRef } from "react";
import { useMatches, MatchesProvider } from "@/contexts/MatchesContext";
import { RoundSelector } from "@/components/guesses/RoundSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchesReportTable } from "@/components/round-report/MatchesReportTable";
import { ReportActions } from "@/components/round-report/ReportActions";
import { useParticipants } from "@/hooks/useParticipants";
import { useKichutes } from "@/hooks/useKichutes";

const RoundReportContent = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { rounds, selectedRound, setSelectedRound } = useMatches();
  const { participants, isLoading: isLoadingParticipants } = useParticipants();
  const { kichutes, isLoading: isLoadingKichutes } = useKichutes(selectedRound);
  
  const currentRound = rounds.find(r => r.number === selectedRound);
  const isLoading = isLoadingParticipants || isLoadingKichutes;

  return (
    <div className="container mx-auto px-4 py-8 pt-20 print:pt-8 print:px-0">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Relatório da Rodada</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-48">
              <RoundSelector 
                selectedRound={selectedRound.toString()} 
                onRoundChange={(round) => setSelectedRound(Number(round))}
                isDisabled={isLoading}
              />
            </div>
            <ReportActions 
              reportRef={reportRef}
              selectedRound={selectedRound}
            />
          </div>
        </div>
        
        <div ref={reportRef} className="bg-background print:bg-white">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-lg text-muted-foreground">Carregando dados...</p>
            </div>
          ) : currentRound ? (
            <Card>
              <CardHeader className="bg-muted print:bg-white">
                <CardTitle className="text-xl">Rodada {selectedRound} - Relatório de Palpites</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MatchesReportTable
                  matches={currentRound.matches}
                  participants={participants}
                  kichutes={kichutes}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-8">
              <p className="text-lg text-muted-foreground">
                Nenhuma rodada selecionada ou disponível.
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
