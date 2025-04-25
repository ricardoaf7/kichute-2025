
import { PointsDisplay } from "./PointsDisplay";

interface GuessScoreProps {
  homeGuess?: number;
  awayGuess?: number;
  points: number;
}

export const GuessScore = ({ homeGuess, awayGuess, points }: GuessScoreProps) => {
  if (homeGuess === undefined || awayGuess === undefined) {
    return <span className="text-muted-foreground print:text-gray-400">-</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <span>
        {homeGuess} x {awayGuess}
      </span>
      <PointsDisplay points={points} />
    </div>
  );
};
