
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Trophy, Calendar as CalendarIcon } from "lucide-react";
import Boot from "../components/icons/Boot";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const Index = () => {
  // Sample data for the standings table
  const standingsData = [
    { position: 1, player: "Cortez", points: 32 },
    { position: 2, player: "Álvaro", points: 28 },
    { position: 3, player: "Pezão", points: 26 },
    { position: 4, player: "Uemura", points: 24 },
    { position: 5, player: "Bruno", points: 22 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
            Bolão do Brasileirão
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Faça seus palpites e ganhe prêmios
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acompanhe as rodadas, registre seus palpites e veja quem está liderando a
            competição.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">Partidas</h2>
                <p className="text-center text-gray-600">
                  Veja os jogos da rodada atual e resultados anteriores.
                </p>
                <Link 
                  to="/matches" 
                  className="text-blue-600 flex items-center hover:underline"
                >
                  Ver partidas
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Boot className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Palpites</h2>
                <p className="text-center text-gray-600">
                  Registre seus palpites para a próxima rodada.
                </p>
                <Link 
                  to="/guesses" 
                  className="text-green-600 flex items-center hover:underline"
                >
                  Fazer palpites
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold">Classificação</h2>
                <p className="text-center text-gray-600">
                  Veja quem está liderando o bolão neste momento.
                </p>
                <Link 
                  to="/standings" 
                  className="text-amber-600 flex items-center hover:underline"
                >
                  Ver classificação
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Classificação</h2>
          <Link 
            to="/standings" 
            className="text-green-600 flex items-center hover:underline"
          >
            Ver classificação completa
            <span className="ml-1">→</span>
          </Link>
        </div>

        <Card className="border mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Jogador</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standingsData.map((row) => (
                <TableRow key={row.position}>
                  <TableCell className="font-medium">{row.position}</TableCell>
                  <TableCell>{row.player}</TableCell>
                  <TableCell className="text-right">{row.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Index;
