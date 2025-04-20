import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MatchHeader } from "./MatchHeader";
import { ScoreInput } from "./ScoreInput";

interface MatchGuessCardProps {
  match: {
    id: string;
    rodada: number;
    data: string;
    local: string;
    time_casa: { nome: string; sigla: string };
    time_visitante: { nome: string; sigla: string };
  };
  homeScore: number;
  awayScore: number;
  onScoreChange: (matchId: string, type: "home" | "away", value: number) => void;
  isDisabled: boolean;
}

export const MatchGuessCard = ({
  match,
  homeScore,
  awayScore,
  onScoreChange,
  isDisabled,
}: MatchGuessCardProps) => {
  const handleScoreChange = (type: "home" | "away", value: number) => {
    onScoreChange(match.id, type, value);
  };

  return (
    <Card className="border hover:shadow-md transition-shadow">
      <CardContent>
        {/* Cabeçalho com rodada e data */}
        <MatchHeader round={match.rodada} date={match.data} />

        {/* Linha com as siglas dos times */}
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold">{match.time_casa.sigla}</span>
          <span className="text-muted-foreground">x</span>
          <span className="font-semibold">{match.time_visitante.sigla}</span>
        </div>

        {/* Controles de placar */}
        <div className="flex justify-between items-center mt-2">
          <ScoreInput
            teamName={match.time_casa.nome}
            score={homeScore}
            onChange={(v) => handleScoreChange("home", v)}
            isDisabled={isDisabled}
          />
          <ScoreInput
            teamName={match.time_visitante.nome}
            score={awayScore}
            onChange={(v) => handleScoreChange("away", v)}
            isDisabled={isDisabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};
