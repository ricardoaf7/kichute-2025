import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Trophy,
  ListOrdered,
  BarChart2,
} from "lucide-react";
import Boot from "../components/icons/Boot";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface RankingRow {
  position: number;
  player: string;
  points: number;
}

const Index = () => {
  const [rankingType, setRankingType] = useState<
    "round" | "month" | "annual"
  >("round");
  const [rankingData, setRankingData] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(false);

  // 1) Classificação da Rodada
  const fetchRoundRanking = async () => {
    setLoading(true);
    try {
      // última rodada calculada
      const { data: latestArr, error: errL } = await supabase
        .from("pontuacao_rodada")
        .select("rodada", { distinct: true })
        .order("rodada", { ascending: false })
        .limit(1);
      if (errL) throw errL;
      const latest = latestArr?.[0]?.rodada ?? 1;

      // top5 dessa rodada
      const { data: rows, error } = await supabase
        .from("pontuacao_rodada")
        .select("pontos, jogador:jogadores(name)")
        .eq("rodada", latest)
        .order("pontos", { ascending: false })
        .limit(5);
      if (error) throw error;

      setRankingData(
        rows.map((r, i) => ({
          position: i + 1,
          player: r.jogador.name,
          points: r.pontos,
        }))
      );
    } catch (err) {
      console.error(err);
      setRankingData([]);
    } finally {
      setLoading(false);
    }
  };

  // 2) Classificação Mensal (mês/año correntes)
  const fetchMonthlyRanking = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const start = `${year}-${month}-01`;
      // primeiro dia do mês seguinte
      const nextMonth = now.getMonth() === 11 ? "01" : String(now.getMonth() + 2).padStart(2, "0");
      const nextYear = now.getMonth() === 11 ? year + 1 : year;
      const end = `${nextYear}-${nextMonth}-01`;

      // rodadas cujas partidas aconteceram neste mês
      const { data: parts, error: errP } = await supabase
        .from("partidas")
        .select("rodada")
        .gte("data", start)
        .lt("data", end);
      if (errP) throw errP;
      const roundIds = [...new Set(parts.map((p) => p.rodada))];

      // pontuação agregada para essas rodadas
      const { data: pts, error: errR } = await supabase
        .from("pontuacao_rodada")
        .select("pontos, jogador:jogadores(name)")
        .in("rodada", roundIds);
      if (errR) throw errR;

      // soma total por jogador
      const sums: Record<string, { name: string; points: number }> = {};
      pts.forEach((r) => {
        const name = r.jogador.name;
        sums[name] = sums[name] || { name, points: 0 };
        sums[name].points += r.pontos;
      });

      // formata e ordena top5
      const formatted = Object.values(sums)
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
        .map((r, i) => ({ position: i + 1, player: r.name, points: r.points }));
      setRankingData(formatted);
    } catch (err) {
      console.error(err);
      setRankingData([]);
    } finally {
      setLoading(false);
    }
  };

  // 3) Classificação Anual (ano corrente)
  const fetchAnnualRanking = async () => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const start = `${year}-01-01`;
      const end = `${year + 1}-01-01`;

      const { data: parts, error: errP } = await supabase
        .from("partidas")
        .select("rodada")
        .gte("data", start)
        .lt("data", end);
      if (errP) throw errP;
      const roundIds = [...new Set(parts.map((p) => p.rodada))];

      const { data: pts, error: errR } = await supabase
        .from("pontuacao_rodada")
        .select("pontos, jogador:jogadores(name)")
        .in("rodada", roundIds);
      if (errR) throw errR;

      const sums: Record<string, { name: string; points: number }> = {};
      pts.forEach((r) => {
        const name = r.jogador.name;
        sums[name] = sums[name] || { name, points: 0 };
        sums[name].points += r.pontos;
      });

      const formatted = Object.values(sums)
        .sort((a, b) => b.points - a.points)
        .slice(0, 5)
        .map((r, i) => ({ position: i + 1, player: r.name, points: r.points }));
      setRankingData(formatted);
    } catch (err) {
      console.error(err);
      setRankingData([]);
    } finally {
      setLoading(false);
    }
  };

  // dispara a busca certa ao mudar o tipo
  useEffect(() => {
    if (rankingType === "round") fetchRoundRanking();
    else if (rankingType === "month") fetchMonthlyRanking();
    else fetchAnnualRanking();
  }, [rankingType]);

  const getRankingTitle = () => {
    switch (rankingType) {
      case "round":
        return "Classificação da Rodada";
      case "month":
        return "Classificação Mensal";
      case "annual":
        return "Classificação Anual";
    }
  };
  const getRankingIcon = () => {
    switch (rankingType) {
      case "round":
        return <ListOrdered className="h-4 w-4 mr-2" />;
      case "month":
        return <CalendarIcon className="h-4 w-4 mr-2" />;
      case "annual":
        return <Trophy className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {/* Navegação por cards (mantém igual) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Partidas */}
        <Card className="border hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Partidas</h2>
              <Link to="/matches" className="text-blue-600 hover:underline">
                Ver partidas →
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Kichutes */}
        <Card className="border hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Boot className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold">Kichutes</h2>
              <Link to="/kichutes" className="text-green-600 hover:underline">
                Fazer kichutes →
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Classificação */}
        <Card className="border hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Trophy className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-semibold">Classificação</h2>
              <Link to="/standings" className="text-amber-600 hover:underline">
                Ver classificação →
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Relatório */}
        <Card className="border hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <BarChart2 className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Relatório</h2>
              <Link to="/round-report" className="text-purple-600 hover:underline">
                Ver relatório →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controle de tipo + título */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          {getRankingIcon()}
          {getRankingTitle()}
        </h2>
        <div className="flex items-center gap-4">
          <Select
            value={rankingType}
            onValueChange={(v) =>
              setRankingType(v as "round" | "month" | "annual")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Classificação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="round">Rodada</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
            </SelectContent>
          </Select>
          <Link
            to="/standings"
            className="text-green-600 hover:underline whitespace-nowrap"
          >
            Ver classificação completa →
          </Link>
        </div>
      </div>

      {/* Tabela de resultados */}
      <Card className="border mb-8">
        {loading ? (
          <div className="p-8 text-center">Carregando classificação…</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Jogador</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankingData.map((row) => (
                <TableRow key={row.position}>
                  <TableCell className="font-medium">
                    {row.position}
                  </TableCell>
                  <TableCell>{row.player}</TableCell>
                  <TableCell className="text-right">
                    {row.points}
                  </TableCell>
                </TableRow>
              ))}
              {rankingData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Nenhum dado disponível.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default Index;
