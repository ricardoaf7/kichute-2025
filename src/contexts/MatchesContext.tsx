
import { createContext, useContext, useState, ReactNode } from "react";
import { Match, Round, Team } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { TEAMS, ROUNDS } from "@/utils/mockData";

interface MatchesContextType {
  rounds: Round[];
  selectedRound: number;
  editingMatch: Match | null;
  setRounds: (rounds: Round[]) => void;
  setSelectedRound: (round: number) => void;
  setEditingMatch: (match: Match | null) => void;
  handleAddRound: () => void;
  handleDeleteRound: (roundNumber: number) => void;
  handleEditMatch: (match: Match) => void;
  handleDeleteMatch: (matchId: string, roundNumber: number) => void;
  handleUpdateResults: (match: Match, homeScore: number, awayScore: number) => void;
  handleSubmitMatch: (values: MatchFormValues) => void;
  resetForm: () => void;
}

export interface MatchFormValues {
  round: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: Date;
  stadium: string;
  city: string;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};

export const MatchesProvider = ({ children }: { children: ReactNode }) => {
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

  const handleSubmitMatch = (values: MatchFormValues) => {
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

  const value: MatchesContextType = {
    rounds,
    selectedRound,
    editingMatch,
    setRounds,
    setSelectedRound,
    setEditingMatch,
    handleAddRound,
    handleDeleteRound,
    handleEditMatch,
    handleDeleteMatch,
    handleUpdateResults,
    handleSubmitMatch,
    resetForm
  };

  return (
    <MatchesContext.Provider value={value}>
      {children}
    </MatchesContext.Provider>
  );
};
