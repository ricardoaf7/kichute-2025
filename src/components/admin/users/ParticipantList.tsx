
import { Player } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParticipantActions } from "./ParticipantActions";

interface ParticipantListProps {
  users: Player[];
  onEdit: (userId: string) => void;
  onDelete: (userId: string, userName: string) => void;
  onOpenPayment: (userId: string, userName: string, currentPayment: number) => void;
  calculateMonthsPaid: (amount: number) => number;
  calculateRemainingBalance: (paidAmount: number) => number;
  isCurrentMonthPaid: (paidAmount: number) => boolean;
  getMonthStatus: (paidAmount: number) => string;
}

export function ParticipantList({
  users,
  onEdit,
  onDelete,
  onOpenPayment,
  calculateMonthsPaid,
  calculateRemainingBalance,
  isCurrentMonthPaid,
  getMonthStatus
}: ParticipantListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status de Pagamento</TableHead>
          <TableHead>Valor Pago</TableHead>
          <TableHead>Pontos</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.name}
              {user.role === 'Administrador' && (
                <Badge variant="secondary" className="ml-2">
                  Admin
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {user.paidAmount >= 90 ? (
                <Badge className="bg-green-500">Temporada Completa</Badge>
              ) : isCurrentMonthPaid(user.paidAmount) ? (
                <Badge className="bg-green-500">Em Dia</Badge>
              ) : (
                <Badge variant="destructive">Em Atraso</Badge>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                {getMonthStatus(user.paidAmount)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span>R$ {user.paidAmount.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">
                  Restante: R$ {calculateRemainingBalance(user.paidAmount).toFixed(2)}
                </span>
              </div>
            </TableCell>
            <TableCell>{user.totalPoints}</TableCell>
            <TableCell className="text-right">
              <ParticipantActions
                userId={user.id}
                userName={user.name}
                currentPayment={user.paidAmount}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenPayment={onOpenPayment}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
