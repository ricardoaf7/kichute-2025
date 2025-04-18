import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKichuteData } from "@/hooks/useKichuteData";

const KichuteTable = () => {
  // Corrigido: passando os dois argumentos obrigatórios para o hook
  const { kichutes, isLoading, error } = useKichuteData("1", "todos");

  // Agrupar pontos por jogador
  const pontosPorJogador: Record<string, number> = {};
  kichutes.forEach((k) => {
    const nome = k.jogador.nome;
    if (!pontosPorJogador[nome]) {
      pontosPorJogador[nome] = 0;
    }
    pontosPorJogador[nome] += k.pontos;
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os dados</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 dark:bg-gray-900 font-poppins">
          <TableHead className="text-center">Rodada</TableHead>
          <TableHead className="text-center">Jogo</TableHead>
          <TableHead className="text-center">Resultado</TableHead>
          <TableHead className="text-center">Jogador</TableHead>
          <TableHead className="text-center">Palpite</TableHead>
          <TableHead className="text-center font-semibold">Pontos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kichutes.length > 0 ? (
          <>
            {kichutes.map((kichute) => (
              <TableRow
                key={kichute.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <TableCell className="text-center font-medium">
                  {kichute.rodada}
                </TableCell>
                <TableCell className="text-center">
                  {kichute.partida.time_casa.sigla} x {kichute.partida.time_visitante.sigla}
                </TableCell>
                <TableCell className="text-center">
                  {kichute.partida.placar_casa !== null &&
                  kichute.partida.placar_visitante !== null
                    ? `${kichute.partida.placar_casa} x ${kichute.partida.placar_visitante}`
                    : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {kichute.jogador.nome}
                </TableCell>
                <TableCell className="text-center">
                  {kichute.palpite_casa} x {kichute.palpite_visitante}
                </TableCell>
                <TableCell className="text-center">
                  {kichute.pontos}
                </TableCell>
              </TableRow>
            ))}

            <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
              <TableCell colSpan={6} className="text-center">
                Total de Pontos por Jogador:
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {Object.entries(pontosPorJogador).map(([jogador, total]) => (
                    <div key={jogador}>
                      {jogador}: {total} pts
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">Nenhum palpite encontrado</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default KichuteTable;
