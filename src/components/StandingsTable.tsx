import { usePontuacaoPorJogador } from "@/hooks/usePontuacaoPorJogador";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StandingsTable({
  selectedRodada,
  selectedJogador,
}: {
  selectedRodada: string;
  selectedJogador: string;
}) {
  const { pontuacao, isLoading, error } = usePontuacaoPorJogador(
    selectedRodada,
    selectedJogador
  );

  if (isLoading) return <div>Carregando classificação...</div>;
  if (error) return <div>Erro ao carregar a classificação</div>;

  const medalhas = ["🥇", "🥈", "🥉"];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-4 text-center">#</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pontuacao.map((item, index) => (
            <TableRow key={item.jogador_id}>
              <TableCell className="text-center font-bold">
                {medalhas[index] || "⭐"}
              </TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell className="text-center font-bold">
                {item.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
