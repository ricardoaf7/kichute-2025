
import { TableRow, TableCell } from "@/components/ui/table";

interface TableEmptyStateProps {
  colSpan: number;
}

export const TableEmptyState = ({ colSpan }: TableEmptyStateProps) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center py-8 text-gray-500">
      Nenhum resultado encontrado
    </TableCell>
  </TableRow>
);
