
import { Player } from "../../types";

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
