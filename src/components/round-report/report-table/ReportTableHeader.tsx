
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReportTableHeaderProps {
  monthNames: string[];
  isMonthly: boolean;
}

export const ReportTableHeader = ({ monthNames, isMonthly }: ReportTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead className="w-48">Participante</TableHead>
        {isMonthly && monthNames.map((month) => (
          <TableHead key={month} className="text-center w-24">
            {month}
          </TableHead>
        ))}
        <TableHead className="text-center w-32 font-bold">
          Total
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
