
import { TableRow, TableCell } from "@/components/ui/table";
import { KichutePoints } from "@/components/kichutes/KichutePoints";

interface DynamicTableRowProps {
  jogador: any;
  index: number;
  todasRodadas: string[];
}

export const DynamicTableRow = ({ jogador, index, todasRodadas }: DynamicTableRowProps) => (
  <TableRow className={index % 2 === 0 ? 'bg-white dark:bg-gray-950/50' : 'bg-gray-50 dark:bg-gray-900/30'}>
    <TableCell className="font-medium">{index + 1}</TableCell>
    <TableCell>{jogador.nome}</TableCell>
    <TableCell className="text-center">
      <KichutePoints 
        points={jogador.pontos_total}
        viewType="annual"
        position={index <= 2 ? index : -1}
      />
    </TableCell>
    {todasRodadas.map(rodada => (
      <TableCell key={`${jogador.id}-${rodada}`} className="text-center">
        <KichutePoints 
          points={jogador.rodadas[rodada] || 0}
          viewType="round"
          position={index === 0 ? 0 : -1}
        />
      </TableCell>
    ))}
  </TableRow>
);
