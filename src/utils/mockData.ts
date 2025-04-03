
import { Match, Player, Guess, Round, Prize, Team } from "../types";

export const TEAMS: Team[] = [
  { id: "1", name: "Atlético-MG", shortName: "CAM" },
  { id: "2", name: "Athletico-PR", shortName: "CAP" },
  { id: "3", name: "Bahia", shortName: "BAH" },
  { id: "4", name: "Botafogo", shortName: "BOT" },
  { id: "5", name: "Corinthians", shortName: "COR" },
  { id: "6", name: "Cruzeiro", shortName: "CRU" },
  { id: "7", name: "Cuiabá", shortName: "CUI" },
  { id: "8", name: "Flamengo", shortName: "FLA" },
  { id: "9", name: "Fluminense", shortName: "FLU" },
  { id: "10", name: "Fortaleza", shortName: "FOR" },
  { id: "11", name: "Grêmio", shortName: "GRE" },
  { id: "12", name: "Internacional", shortName: "INT" },
  { id: "13", name: "Juventude", shortName: "JUV" },
  { id: "14", name: "Palmeiras", shortName: "PAL" },
  { id: "15", name: "Red Bull Bragantino", shortName: "RBB" },
  { id: "16", name: "São Paulo", shortName: "SAO" },
  { id: "17", name: "Vasco", shortName: "VAS" },
  { id: "18", name: "Vitória", shortName: "VIT" },
  { id: "19", name: "Criciúma", shortName: "CRI" },
  { id: "20", name: "Atlético-GO", shortName: "ACG" },
];

export const ROUNDS: Round[] = [
  {
    number: 1,
    closed: true,
    deadline: "2023-04-15T16:00:00Z",
    matches: [
      {
        id: "1",
        round: 1,
        homeTeam: TEAMS[0],
        awayTeam: TEAMS[1],
        homeScore: 2,
        awayScore: 1,
        date: "2023-04-16T16:00:00Z",
        played: true,
      },
      {
        id: "2",
        round: 1,
        homeTeam: TEAMS[2],
        awayTeam: TEAMS[3],
        homeScore: 1,
        awayScore: 1,
        date: "2023-04-16T18:30:00Z",
        played: true,
      },
      {
        id: "3",
        round: 1,
        homeTeam: TEAMS[4],
        awayTeam: TEAMS[5],
        homeScore: 0,
        awayScore: 2,
        date: "2023-04-16T16:00:00Z",
        played: true,
      },
    ],
  },
  {
    number: 2,
    closed: true,
    deadline: "2023-04-22T16:00:00Z",
    matches: [
      {
        id: "4",
        round: 2,
        homeTeam: TEAMS[6],
        awayTeam: TEAMS[7],
        homeScore: 0,
        awayScore: 3,
        date: "2023-04-23T16:00:00Z",
        played: true,
      },
      {
        id: "5",
        round: 2,
        homeTeam: TEAMS[8],
        awayTeam: TEAMS[9],
        homeScore: 2,
        awayScore: 0,
        date: "2023-04-23T18:30:00Z",
        played: true,
      },
    ],
  },
  {
    number: 3,
    closed: false,
    deadline: "2023-04-29T16:00:00Z",
    matches: [
      {
        id: "6",
        round: 3,
        homeTeam: TEAMS[10],
        awayTeam: TEAMS[11],
        homeScore: null,
        awayScore: null,
        date: "2023-04-30T16:00:00Z",
        played: false,
      },
      {
        id: "7",
        round: 3,
        homeTeam: TEAMS[12],
        awayTeam: TEAMS[13],
        homeScore: null,
        awayScore: null,
        date: "2023-04-30T18:30:00Z",
        played: false,
      },
      {
        id: "8",
        round: 3,
        homeTeam: TEAMS[14],
        awayTeam: TEAMS[15],
        homeScore: null,
        awayScore: null,
        date: "2023-04-30T16:00:00Z",
        played: false,
      },
    ],
  },
];

export const PLAYERS: Player[] = [
  {
    id: "1",
    name: "Álvaro",
    paid: true,
    paidAmount: 40.00,
    totalPoints: 28,
    roundPoints: {
      1: 11,
      2: 17,
    },
  },
  {
    id: "2",
    name: "Bruno",
    paid: false,
    paidAmount: 0.00,
    totalPoints: 22,
    roundPoints: {
      1: 9,
      2: 13,
    },
  },
  {
    id: "3",
    name: "Cortez",
    paid: true,
    paidAmount: 90.00,
    totalPoints: 32,
    roundPoints: {
      1: 15,
      2: 17,
    },
  },
  {
    id: "4",
    name: "Fugivara",
    paid: false,
    paidAmount: 0.00,
    totalPoints: 20,
    roundPoints: {
      1: 11,
      2: 9,
    },
  },
  {
    id: "5",
    name: "Pezão",
    paid: true,
    paidAmount: 60.00,
    totalPoints: 26,
    roundPoints: {
      1: 12,
      2: 14,
    },
  },
  {
    id: "6",
    name: "Uemura",
    paid: true,
    paidAmount: 30.00,
    totalPoints: 24,
    roundPoints: {
      1: 13,
      2: 11,
    },
  },
  {
    id: "7",
    name: "Ricardo",
    paid: true,
    paidAmount: 70.00,
    totalPoints: 21,
    roundPoints: {
      1: 10,
      2: 11,
    },
  },
];

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

export const PRIZES: Prize[] = [
  {
    id: "1",
    month: "Janeiro 2023",
    player: PLAYERS[2], // Cortez
    amount: 150.00,
    paid: true,
  },
  {
    id: "2",
    month: "Fevereiro 2023",
    player: PLAYERS[0], // Álvaro
    amount: 150.00,
    paid: true,
  },
  {
    id: "3",
    month: "Março 2023",
    player: PLAYERS[5], // Uemura
    amount: 150.00,
    paid: false,
  },
];

// Default scoring system
export const SCORING_SYSTEM = {
  exactScore: 7,
  correctDifferenceOrDraw: 4,
  correctWinner: 2,
};
