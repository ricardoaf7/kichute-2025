
interface MatchScoreProps {
  homeScore?: number;
  awayScore?: number;
}

export const MatchScore = ({ homeScore, awayScore }: MatchScoreProps) => {
  if (homeScore === undefined || awayScore === undefined) {
    return (
      <span className="text-muted-foreground italic">
        Não jogado
      </span>
    );
  }

  return (
    <span className="font-bold">
      {homeScore} x {awayScore}
    </span>
  );
};
