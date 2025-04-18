import { useEffect, useMemo, useState } from "react";
import { useKichuteData } from "@/hooks/useKichuteData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StandingsTableProps {
  selectedRodada: string;
  selectedJogador: string;
}

export default function StandingsTable({
  selectedRodada,
  selectedJogador,
}: StandingsTableProps) {
  const { kichutes, isLoading, error } = useKichuteData(selectedRodada, selectedJogador);

  const pontosPorJogador = useMemo(() => {
    const mapa: Record<string, number> = {};
    kichutes.forEach((k) => {
      const nome = k.jogador.nome;
      mapa[nome] = (mapa[nome] || 0) + k.pontos;
    });

    // Ordenar decrescente por pontos
    return Object.entries(mapa)
      .sort((a, b) => b[1] - a[1])
      .map(([nome, total], index) => ({
        nome,
        total,
        icone:
          index === 0
            ? "🏆"
            : index === 1
            ? "🥈"
            : index === 2
            ? "⭐"
            : null,
      }));
  }, [kichutes]);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar classificação</div>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">#</TableHead>
            <TableHead className="text-left">Jogador</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pontosPorJogador.map((jogador, idx) => (
            <TableRow key={jogador.nome}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                {jogador.icone && <span className="mr-1">{jogador.icone}</span>}
                {jogador.nome}
              </TableCell>
              <TableCell className="text-center">{jogador.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
