
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Payment {
  id: string;
  jogador_id: string;
  valor: number;
  mes: string;
  ano: string;
  status: "Pago" | "Pendente";
  jogador: {
    nome: string;
  };
}

interface PaymentsTableProps {
  selectedPlayer: string | null;
  selectedMonth: string | null;
  selectedStatus: string | null;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  selectedPlayer,
  selectedMonth,
  selectedStatus,
}) => {
  const fetchPayments = async () => {
    let query = supabase
      .from("pagamentos")
      .select(`
        id, 
        jogador_id,
        valor, 
        mes, 
        ano,
        status,
        jogador:jogador_id(nome)
      `);

    if (selectedPlayer) {
      query = query.eq("jogador_id", selectedPlayer);
    }

    if (selectedMonth) {
      query = query.eq("mes", selectedMonth);
    }

    if (selectedStatus) {
      query = query.eq("status", selectedStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erro ao buscar pagamentos:", error);
      throw new Error("Não foi possível carregar os pagamentos.");
    }

    return data as Payment[];
  };

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ["payments", selectedPlayer, selectedMonth, selectedStatus],
    queryFn: fetchPayments,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Jogador</TableHead>
            <TableHead className="font-semibold text-right">Valor Pago</TableHead>
            <TableHead className="font-semibold">Mês</TableHead>
            <TableHead className="font-semibold">Ano</TableHead>
            <TableHead className="font-semibold text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-[80px] mx-auto" /></TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Erro ao carregar pagamentos. Tente novamente mais tarde.
              </TableCell>
            </TableRow>
          ) : payments?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Nenhum pagamento encontrado com os filtros aplicados.
              </TableCell>
            </TableRow>
          ) : (
            payments?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.jogador?.nome || "Jogador não encontrado"}</TableCell>
                <TableCell className="text-right">
                  R$ {payment.valor?.toFixed(2)}
                </TableCell>
                <TableCell>{payment.mes}</TableCell>
                <TableCell>{payment.ano}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`${
                      payment.status === "Pago"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-yellow-100 text-yellow-800 border-yellow-300"
                    }`}
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
