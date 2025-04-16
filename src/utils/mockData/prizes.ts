
import { Prize } from "../../types";
import { PLAYERS } from "./players";

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
