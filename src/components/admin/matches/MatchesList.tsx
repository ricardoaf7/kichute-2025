
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { Match, Round } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchesListProps {
  rounds: Round[];
  selectedRound: number;
  onSelectRound: (roundNumber: number) => void;
  onEditMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string, roundNumber: number) => void;
  onUpdateResults: (match: Match, homeScore: number, awayScore: number) => void;
}

export const MatchesList = ({ 
  rounds, 
  selectedRound, 
  onSelectRound, 
  onEditMatch, 
  onDeleteMatch,
  onUpdateResults
}: MatchesListProps) => {
  
  const currentRound = rounds.find(r => r.number === selectedRound);

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
              {rounds.map((round) => (
                <SelectItem key={round.number} value={round.number.toString()}>
                  Rodada {round.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!currentRound || currentRound.matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma partida cadastrada para esta rodada.
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
                          {format(new Date(match.date), "dd/MM/yyyy HH:mm")}
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
                          {match.played
                            ? `${match.homeScore} x ${match.awayScore}`
                            : "x"}
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-2">
                          <span className="font-medium">{match.awayTeam.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end items-center border-t pt-2 md:pt-0 md:border-t-0">
                      {!match.played && (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            placeholder="Casa"
                            className="w-16"
                            id={`home-${match.id}`}
                          />
                          <span className="flex items-center">x</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Fora"
                            className="w-16"
                            id={`away-${match.id}`}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const homeInput = document.getElementById(`home-${match.id}`) as HTMLInputElement;
                              const awayInput = document.getElementById(`away-${match.id}`) as HTMLInputElement;
                              
                              if (homeInput && awayInput) {
                                const homeScore = parseInt(homeInput.value);
                                const awayScore = parseInt(awayInput.value);
                                
                                if (!isNaN(homeScore) && !isNaN(awayScore)) {
                                  onUpdateResults(match, homeScore, awayScore);
                                }
                              }
                            }}
                          >
                            Salvar
                          </Button>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEditMatch(match)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteMatch(match.id, match.round)}
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
