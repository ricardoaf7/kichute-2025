
import { Guess, Match, ScoringSystem } from "../types";
import { SCORING_SYSTEM } from "./mockData";

export const calculatePoints = (
  guess: Pick<Guess, "homeScore" | "awayScore">,
  match: Pick<Match, "homeScore" | "awayScore">,
  scoringSystem: ScoringSystem = SCORING_SYSTEM
): number => {
  // If match results aren't available yet
  if (match.homeScore === null || match.awayScore === null || 
      match.homeScore === undefined || match.awayScore === undefined) {
    return 0;
  }

  // Exact score
  if (guess.homeScore === match.homeScore && guess.awayScore === match.awayScore) {
    return scoringSystem.exactScore;
  }

  const guessHomeWins = guess.homeScore > guess.awayScore;
  const guessAwayWins = guess.homeScore < guess.awayScore;
  const guessDraw = guess.homeScore === guess.awayScore;

  const matchHomeWins = match.homeScore > match.awayScore;
  const matchAwayWins = match.homeScore < match.awayScore;
  const matchDraw = match.homeScore === match.awayScore;

  // Correct difference or draw
  if (
    (guessHomeWins && matchHomeWins && 
     (guess.homeScore - guess.awayScore) === (match.homeScore - match.awayScore)) ||
    (guessAwayWins && matchAwayWins && 
     (guess.awayScore - guess.homeScore) === (match.awayScore - match.homeScore)) ||
    (guessDraw && matchDraw)
  ) {
    return scoringSystem.correctDifferenceOrDraw;
  }

  // Correct winner
  if (
    (guessHomeWins && matchHomeWins) ||
    (guessAwayWins && matchAwayWins) ||
    (guessDraw && matchDraw)
  ) {
    return scoringSystem.correctWinner;
  }

  // No points
  return 0;
};

// Get a pretty string representation of the scoring result based on points
export const getScoringDescription = (points: number, scoringSystem: ScoringSystem = SCORING_SYSTEM): string => {
  switch (points) {
    case scoringSystem.exactScore:
      return "Placar exato! 🎯";
    case scoringSystem.correctDifferenceOrDraw:
      return "Acertou a diferença/empate! 👍";
    case scoringSystem.correctWinner:
      return "Acertou o vencedor! 👌";
    default:
      return "Sem pontos";
  }
};

// Get colored badge class based on points
export const getPointsBadgeClass = (points: number, scoringSystem: ScoringSystem = SCORING_SYSTEM): string => {
  let baseClass = "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  switch (points) {
    case scoringSystem.exactScore:
      return `${baseClass} bg-green-100 text-green-800`;
    case scoringSystem.correctDifferenceOrDraw:
      return `${baseClass} bg-blue-100 text-blue-800`;
    case scoringSystem.correctWinner:
      return `${baseClass} bg-yellow-100 text-yellow-800`;
    default:
      return `${baseClass} bg-gray-100 text-gray-800`;
  }
};
