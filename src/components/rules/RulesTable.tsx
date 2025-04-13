
import React from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Rule {
  id: number;
  tipo: string;
  valor: number;
  exato?: number;
  diferenca?: number;
  vencedor?: number;
}

// Função para mapear os campos da tabela para nomes mais amigáveis
const mapFieldNameToLabel = (fieldName: string): string => {
  switch (fieldName) {
    case "exato":
      return "Placar Exato";
    case "diferenca":
      return "Diferença Correta";
    case "vencedor":
      return "Vencedor Correto";
    default:
      return fieldName;
  }
};

const RulesTable: React.FC = () => {
  const fetchRules = async () => {
    // Buscar dados da tabela regras
    const { data, error } = await supabase
      .from("regras")
      .select("*");

    if (error) {
      console.error("Erro ao buscar regras:", error);
      throw new Error("Não foi possível carregar as regras.");
    }

    // Transformamos os dados para o formato desejado para exibição
    const formattedRules: Rule[] = [];
    
    // Se existir apenas um registro com todos os campos
    if (data && data.length > 0) {
      const rule = data[0];
      
      if (rule.exato !== null && rule.exato !== undefined) {
        formattedRules.push({
          id: 1,
          tipo: "Placar Exato",
          valor: rule.exato
        });
      }
      
      if (rule.diferenca !== null && rule.diferenca !== undefined) {
        formattedRules.push({
          id: 2,
          tipo: "Diferença Correta",
          valor: rule.diferenca
        });
      }
      
      if (rule.vencedor !== null && rule.vencedor !== undefined) {
        formattedRules.push({
          id: 3,
          tipo: "Vencedor Correto",
          valor: rule.vencedor
        });
      }
    } else {
      // Caso não haja dados, retornamos um array vazio
      return [];
    }

    return formattedRules;
  };

  const { data: rules, isLoading, error } = useQuery({
    queryKey: ["rules"],
    queryFn: fetchRules,
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">Sistema de Pontuação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            Erro ao carregar as regras. Tente novamente mais tarde.
          </div>
        ) : rules?.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Nenhuma regra encontrada.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-semibold">Tipo de Acerto</TableHead>
                <TableHead className="text-center font-semibold">Pontuação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules?.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="text-center">{rule.tipo}</TableCell>
                  <TableCell className="text-center font-medium">{rule.valor} pontos</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RulesTable;
