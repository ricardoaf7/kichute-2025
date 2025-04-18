import { usePontuacaoPorJogador } from "@/hooks/usePontuacaoPorJogador";
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
  const { jogadores, isLoading, error } = usePontuacaoPorJogador(selectedRodada, selectedJogador);

  if (isLoading) return <div>Carregando classificação...</div>;
  if (error) return <div>Erro ao carregar dados</div>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jogadores.map((j, i) => (
            <TableRow key={j.nome}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>
                {i === 0 && <span className="mr-1">🏆</span>}
                {i === 1 && <span className="mr-1">🥈</span>}
                {i === 2 && <span className="mr-1">⭐</span>}
                {j.nome}
              </TableCell>
              <TableCell className="text-center">{j.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
