
import { TableFooter, TableRow, TableCell } from "@/components/ui/table";

interface DynamicTableFooterProps {
  jogadores: any[];
  todasRodadas: string[];
  totaisPorRodada: Record<string, number>;
  totalGeral: number;
  viewMode: "table" | "dynamic";
}

export const DynamicTableFooter = ({
  jogadores,
  todasRodadas,
  totaisPorRodada,
  totalGeral,
  viewMode
}: DynamicTableFooterProps) => {
  if (jogadores.length === 0) return null;

  return (
    <TableFooter>
      <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
        <TableCell>-</TableCell>
        <TableCell>Total</TableCell>
        <TableCell className="text-center">{totalGeral}</TableCell>
        
        {viewMode === "dynamic" && todasRodadas.map(rodada => (
          <TableCell key={`footer-${rodada}`} className="text-center">
            {totaisPorRodada[rodada] || 0}
          </TableCell>
        ))}
      </TableRow>
    </TableFooter>
  );
};
