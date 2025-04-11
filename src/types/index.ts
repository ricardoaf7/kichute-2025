
export interface Match {
  id: string;
  round: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  played: boolean;
  stadium?: string;
  city?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  homeStadium: string;
  city: string;
}

export interface Player {
  id: string;
  name: string;
  paid: boolean;
  paidAmount: number;
  totalPoints: number;
  roundPoints: { [round: number]: number };
}

export interface Guess {
  id: string;
  matchId: string;
  playerId: string;
  homeScore: number;
  awayScore: number;
  points?: number;
}

export interface Round {
  number: number;
  closed: boolean;
  deadline: string;
  matches: Match[];
}

export interface Prize {
  id: string;
  month: string;
  player: Player;
  amount: number;
  paid: boolean;
}

export interface ScoringSystem {
  exactScore: number;
  correctDifferenceOrDraw: number;
  correctWinner: number;
}
