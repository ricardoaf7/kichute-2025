
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TEAMS, ROUNDS } from "../utils/mockData";
import { Match, Round, Team } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchForm, MatchFormValues } from "@/components/admin/matches/MatchForm";
import { RoundsList } from "@/components/admin/matches/RoundsList";
import { MatchesList } from "@/components/admin/matches/MatchesList";

const AdminMatches = () => {
  const [rounds, setRounds] = useState<Round[]>(ROUNDS);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setEditingMatch(null);
  };

  const handleAddRound = () => {
    const newRoundNumber = rounds.length > 0 
      ? Math.max(...rounds.map(r => r.number)) + 1 
      : 1;
    
    const newRound: Round = {
      number: newRoundNumber,
      matches: [],
      closed: false,
      deadline: new Date().toISOString(),
    };
    
    setRounds(prev => [...prev, newRound]);
    toast({
      title: "Rodada adicionada",
      description: `Rodada ${newRoundNumber} criada com sucesso.`
    });
  };

  const handleDeleteRound = (roundNumber: number) => {
    if (confirm(`Tem certeza que deseja excluir a Rodada ${roundNumber}?`)) {
      setRounds(prev => prev.filter(r => r.number !== roundNumber));
      toast({
        title: "Rodada excluída",
        description: `Rodada ${roundNumber} foi removida com sucesso.`
      });
    }
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
  };

  const handleDeleteMatch = (matchId: string, roundNumber: number) => {
    if (confirm("Tem certeza que deseja excluir esta partida?")) {
      setRounds(prev => 
        prev.map(round => {
          if (round.number === roundNumber) {
            return {
              ...round,
              matches: round.matches.filter(match => match.id !== matchId)
            };
          }
          return round;
        })
      );
      
      toast({
        title: "Partida excluída",
        description: "A partida foi removida com sucesso."
      });
    }
  };

  const onSubmit = (values: MatchFormValues) => {
    const homeTeam = TEAMS.find(team => team.id === values.homeTeam);
    const awayTeam = TEAMS.find(team => team.id === values.awayTeam);
    const roundNumber = parseInt(values.round);

    if (!homeTeam || !awayTeam) {
      toast({
        title: "Erro ao salvar partida",
        description: "Times selecionados inválidos.",
        variant: "destructive"
      });
      return;
    }

    if (homeTeam.id === awayTeam.id) {
      toast({
        title: "Erro ao salvar partida",
        description: "Os times da casa e visitante não podem ser os mesmos.",
        variant: "destructive"
      });
      return;
    }

    let round = rounds.find(r => r.number === roundNumber);
    if (!round) {
      round = {
        number: roundNumber,
        matches: [],
        closed: false,
        deadline: new Date().toISOString(),
      };
      setRounds(prev => [...prev, round!]);
    }

    if (editingMatch) {
      setRounds(prev => 
        prev.map(r => {
          if (r.number === roundNumber) {
            return {
              ...r,
              matches: r.matches.map(m => 
                m.id === editingMatch.id
                  ? {
                      ...m,
                      round: roundNumber,
                      homeTeam,
                      awayTeam,
                      date: values.matchDate.toISOString(),
                      stadium: values.stadium || "",
                      city: values.city || "",
                    }
                  : m
              )
            };
          }
          return r;
        })
      );

      toast({
        title: "Partida atualizada",
        description: "A partida foi atualizada com sucesso."
      });
    } else {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        round: roundNumber,
        homeTeam,
        awayTeam,
        homeScore: null,
        awayScore: null,
        date: values.matchDate.toISOString(),
        played: false,
        stadium: values.stadium || "",
        city: values.city || "",
      };

      setRounds(prev => 
        prev.map(r => {
          if (r.number === roundNumber) {
            return {
              ...r,
              matches: [...r.matches, newMatch]
            };
          }
          return r;
        })
      );

      toast({
        title: "Partida adicionada",
        description: "A partida foi adicionada com sucesso."
      });
    }

    resetForm();
  };

  const handleUpdateResults = (match: Match, homeScore: number, awayScore: number) => {
    setRounds(prev => 
      prev.map(round => {
        if (round.number === match.round) {
          return {
            ...round,
            matches: round.matches.map(m => 
              m.id === match.id
                ? {
                    ...m,
                    homeScore,
                    awayScore,
                    played: true
                  }
                : m
            )
          };
        }
        return round;
      })
    );

    toast({
      title: "Resultado atualizado",
      description: "O resultado da partida foi atualizado com sucesso."
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Gerenciar Jogos</h1>
          <p className="text-muted-foreground mt-2">
            Adicione e edite rodadas e partidas manualmente
          </p>
        </div>

        <Tabs defaultValue="rounds" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rounds">Rodadas</TabsTrigger>
            <TabsTrigger value="matches">Partidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rounds" className="space-y-4 mt-4">
            <RoundsList 
              rounds={rounds} 
              onAddRound={handleAddRound} 
              onDeleteRound={handleDeleteRound} 
            />
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MatchForm 
                  selectedRound={selectedRound}
                  editingMatch={editingMatch}
                  onSubmit={onSubmit}
                  onCancel={resetForm}
                />
              </div>

              <div className="lg:col-span-2">
                <MatchesList 
                  rounds={rounds}
                  selectedRound={selectedRound}
                  onSelectRound={setSelectedRound}
                  onEditMatch={handleEditMatch}
                  onDeleteMatch={handleDeleteMatch}
                  onUpdateResults={handleUpdateResults}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminMatches;
