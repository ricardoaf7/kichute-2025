
// src/pages/Index.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, Trophy, BarChart2 } from "lucide-react";
import Boot from "../components/icons/Boot";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
            Kichute do Brasileirão Série A 2025
          </span>
          <h1 className="text-4xl font-bold mb-4 md:text-3xl">
            Faça seus kichutes e acompanhe quem lidera o bolão!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Registre seus palpites, confira resultados e veja quem está na
            liderança a cada rodada, mês ou no geral.
          </p>
        </div>

        {/* Cards de Navegação */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Partidas */}
          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center space-y-4">
              <CalendarIcon className="h-12 w-12 text-blue-600 bg-blue-100 p-2 rounded-lg" />
              <h2 className="text-xl font-semibold">Partidas</h2>
              <Link to="/matches" className="text-blue-600 hover:underline">
                Ver partidas →
              </Link>
            </CardContent>
          </Card>

          {/* Kichutes */}
          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center space-y-4">
              <Boot className="h-12 w-12 text-green-600 bg-green-100 p-2 rounded-lg" />
              <h2 className="text-xl font-semibold">Kichutes</h2>
              <Link to="/kichutes" className="text-green-600 hover:underline">
                Fazer kichutes →
              </Link>
            </CardContent>
          </Card>

          {/* Classificação */}
          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center space-y-4">
              <Trophy className="h-12 w-12 text-amber-600 bg-amber-100 p-2 rounded-lg" />
              <h2 className="text-xl font-semibold">Classificação</h2>
              <Link to="/standings" className="text-amber-600 hover:underline">
                Ver classificação →
              </Link>
            </CardContent>
          </Card>

          {/* Relatório */}
          <Card className="border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center space-y-4">
              <BarChart2 className="h-12 w-12 text-purple-600 bg-purple-100 p-2 rounded-lg" />
              <h2 className="text-xl font-semibold">Relatório</h2>
              <Link to="/round-report" className="text-purple-600 hover:underline">
                Ver relatório →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Seção de classificação removida temporariamente */}
      </div>
    </div>
  );
};

export default Index;
