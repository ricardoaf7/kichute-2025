
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMatches } from "@/contexts/matches";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchesListProps {
  selectedRound: number;
  onSelectRound: (roundNumber: number) => void;
}

export const MatchesList = ({ selectedRound, onSelectRound }: MatchesListProps) => {
  const { 
    rounds, 
    handleEditMatch, 
    handleDeleteMatch
  } = useMatches();
  
  const currentRound = rounds.find(r => r.number === selectedRound);
  
  // Criar um array com todas as 38 rodadas
  const allRounds = Array.from({ length: 38 }, (_, i) => i + 1);

  // Formatar data e hora para o fuso de Brasília
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return 'Data inválida';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Lista de Partidas</CardTitle>
          <Select
            value={selectedRound.toString()}
            onValueChange={(value) => onSelectRound(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a rodada" />
            </SelectTrigger>
            <SelectContent>
              {allRounds.map((roundNumber) => (
                <SelectItem key={roundNumber} value={roundNumber.toString()}>
                  Rodada {roundNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!currentRound || currentRound.matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma partida cadastrada nesta rodada ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {currentRound.matches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(match.date)}
                        </span>
                        {match.stadium && (
                          <span className="text-sm text-muted-foreground">
                            {match.stadium}, {match.city}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-1 items-center gap-2">
                          <span className="font-medium">{match.homeTeam.name}</span>
                        </div>
                        <div className="mx-2 font-bold">
                          x
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-2">
                          <span className="font-medium">{match.awayTeam.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end items-center border-t pt-2 md:pt-0 md:border-t-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditMatch(match)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteMatch(match.id, match.round)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
