
import { Guess } from "../../types";

export const GUESSES: Guess[] = [
  // Round 1, Match 1
  {
    id: "1",
    matchId: "1",
    playerId: "1",
    homeScore: 2,
    awayScore: 1,
    points: 7, // exact score
  },
  {
    id: "2",
    matchId: "1",
    playerId: "2",
    homeScore: 3,
    awayScore: 1,
    points: 4, // right winner with wrong score
  },
  {
    id: "3",
    matchId: "1",
    playerId: "3",
    homeScore: 1,
    awayScore: 0,
    points: 4, // right winner with wrong score
  },
  // Add more guesses for other players and matches
];
