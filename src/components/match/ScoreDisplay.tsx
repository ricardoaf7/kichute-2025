
interface ScoreDisplayProps {
  homeScore: number | null;
  awayScore: number | null;
  isMatchPlayed: boolean;
}

export const ScoreDisplay = ({ homeScore, awayScore, isMatchPlayed }: ScoreDisplayProps) => {
  if (isMatchPlayed) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold">{homeScore}</span>
        <span className="text-muted-foreground">x</span>
        <span className="text-lg font-bold">{awayScore}</span>
      </div>
    );
  }
  
  return (
    <div className="text-sm text-muted-foreground px-2 py-1 bg-muted rounded-md">
      Aguardando
    </div>
  );
};
