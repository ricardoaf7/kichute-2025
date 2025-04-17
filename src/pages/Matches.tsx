
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Match } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import MatchCard from "@/components/MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchesTable from "@/components/MatchesTable";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("cards");
  const [selectedRound, setSelectedRound] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrador";

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('partidas')
        .select(`
          id,
          rodada,
          data,
          local,
          placar_casa,
          placar_visitante,
          played,
          time_casa:times!time_casa_id(id, nome, sigla, estadio),
          time_visitante:times!time_visitante_id(id, nome, sigla)
        `)
        .eq('rodada', selectedRound)
        .order('data');

      if (error) throw error;

      const formattedMatches: Match[] = (data || []).map(match => ({
        id: match.id,
        round: match.rodada,
        homeTeam: {
          id: match.time_casa.id,
          name: match.time_casa.nome,
          shortName: match.time_casa.sigla,
          homeStadium: match.time_casa.estadio,
          city: ''
        },
        awayTeam: {
          id: match.time_visitante.id,
          name: match.time_visitante.nome,
          shortName: match.time_visitante.sigla,
          homeStadium: '',
          city: ''
        },
        homeScore: match.placar_casa,
        awayScore: match.placar_visitante,
        date: match.data,
        played: match.played || (match.placar_casa !== null && match.placar_visitante !== null),
        stadium: match.local ? match.local.split(',')[0].trim() : '',
        city: match.local && match.local.includes(',') 
          ? match.local.split(',').slice(1).join(',').trim() 
          : ''
      }));

      setMatches(formattedMatches);
    } catch (error) {
      console.error('Erro ao carregar partidas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [selectedRound]);

  const handleRoundChange = (round: number) => {
    setSelectedRound(round);
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Partidas</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe todas as partidas do Brasileirão 2025
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Tabela</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-border/40 shadow-subtle mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <button 
                  onClick={() => handleRoundChange(Math.max(1, selectedRound - 1))}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={selectedRound <= 1}
                >
                  ←
                </button>
                <span className="font-semibold">Rodada {selectedRound}</span>
                <button 
                  onClick={() => handleRoundChange(Math.min(38, selectedRound + 1))}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={selectedRound >= 38}
                >
                  →
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">Carregando partidas...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match}
                    showResultForm={isAdmin}
                    onResultSaved={fetchMatches}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="table">
            <MatchesTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Matches;
