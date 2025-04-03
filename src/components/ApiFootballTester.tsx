import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Calendar, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { testApiFootballFunction, fetchRounds, fetchFixtures } from "../utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ApiFootballTester: React.FC = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{success?: boolean; error?: string} | null>(null);
  
  const [isLoadingRounds, setIsLoadingRounds] = useState(false);
  const [rounds, setRounds] = useState<string[]>([]);
  
  const [selectedRound, setSelectedRound] = useState<string>("");
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);
  const [fixtures, setFixtures] = useState<any[]>([]);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionResult(null);
    
    try {
      const success = await testApiFootballFunction();
      setConnectionResult({ success });
      if (success) {
        toast.success("Conexão com API-Football estabelecida!");
      } else {
        toast.error("Falha na conexão com API-Football");
      }
    } catch (error) {
      setConnectionResult({ error: error.message });
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleFetchRounds = async () => {
    setIsLoadingRounds(true);
    
    try {
      const roundsData = await fetchRounds();
      setRounds(roundsData);
      
      if (roundsData.length > 0) {
        toast.success(`${roundsData.length} rodadas encontradas!`);
      } else {
        toast.warning("Nenhuma rodada encontrada");
      }
    } catch (error) {
      toast.error(`Erro ao buscar rodadas: ${error.message}`);
    } finally {
      setIsLoadingRounds(false);
    }
  };

  const handleFetchFixtures = async (round: string) => {
    if (!round) return;
    
    setIsLoadingFixtures(true);
    setSelectedRound(round);
    
    try {
      const roundNumber = round.split(" - ")[1];
      const fixturesData = await fetchFixtures(roundNumber);
      setFixtures(fixturesData);
      
      if (fixturesData.length > 0) {
        toast.success(`${fixturesData.length} partidas encontradas!`);
      } else {
        toast.warning("Nenhuma partida encontrada para esta rodada");
      }
    } catch (error) {
      toast.error(`Erro ao buscar partidas: ${error.message}`);
    } finally {
      setIsLoadingFixtures(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Teste da API Football - Brasileirão 2024
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Conexão</TabsTrigger>
            <TabsTrigger value="rounds">Rodadas</TabsTrigger>
            <TabsTrigger value="fixtures">Partidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4">
            <div className="flex flex-col space-y-4 my-4">
              <Button onClick={handleTestConnection} disabled={isTestingConnection}>
                {isTestingConnection ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  "Testar API Football"
                )}
              </Button>
              
              {connectionResult && (
                <div className={`p-3 rounded-md border ${connectionResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  {connectionResult.success ? (
                    <p className="text-green-700">✅ Conexão estabelecida com sucesso!</p>
                  ) : (
                    <div>
                      <p className="text-red-700">❌ Falha na conexão</p>
                      {connectionResult.error && <p className="text-sm text-red-600">{connectionResult.error}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rounds" className="space-y-4">
            <div className="flex flex-col space-y-4 my-4">
              <Button onClick={handleFetchRounds} disabled={isLoadingRounds} className="mb-4">
                {isLoadingRounds ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Buscar Rodadas do Brasileirão
                  </>
                )}
              </Button>
              
              {isLoadingRounds ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div>
                  {rounds.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {rounds.map((round, index) => (
                        <Button 
                          key={index} 
                          variant="outline" 
                          onClick={() => handleFetchFixtures(round)}
                          className={selectedRound === round ? "border-primary bg-primary/10" : ""}
                        >
                          {round.replace("Regular Season - ", "Rodada ")}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Clique no botão acima para carregar as rodadas
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="fixtures" className="space-y-4">
            <div className="flex flex-col space-y-4 my-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {selectedRound ? 
                    selectedRound.replace("Regular Season - ", "Rodada ") : 
                    "Selecione uma rodada"}
                </h3>
                
                {isLoadingFixtures && (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Carregando partidas...</span>
                  </div>
                )}
              </div>
              
              {!selectedRound && (
                <p className="text-muted-foreground text-center py-8">
                  Vá para a aba "Rodadas" e selecione uma rodada para ver as partidas
                </p>
              )}
              
              {isLoadingFixtures ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {fixtures.length > 0 ? (
                    fixtures.map((fixture, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            {formatDate(fixture.date)} • {fixture.stadium}, {fixture.city}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center text-center w-5/12">
                              <div className="font-medium">{fixture.homeTeam.name}</div>
                              <div className="text-2xl font-bold mt-1">
                                {fixture.homeScore !== null ? fixture.homeScore : "-"}
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground w-2/12 text-center">
                              {fixture.played ? "Finalizado" : "Não iniciado"}
                            </div>
                            
                            <div className="flex flex-col items-center text-center w-5/12">
                              <div className="font-medium">{fixture.awayTeam.name}</div>
                              <div className="text-2xl font-bold mt-1">
                                {fixture.awayScore !== null ? fixture.awayScore : "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    selectedRound && (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhuma partida encontrada para esta rodada
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiFootballTester;
