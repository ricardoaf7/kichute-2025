
import { useState } from "react";
import { RotateCw, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { useDynamicTableData } from "@/hooks/standings/useDynamicTableData";
import { useTableSort, SortField } from "@/hooks/standings/useTableSort";
import { TableFilters } from "./TableFilters";

const DynamicTable = () => {
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedMes, setSelectedMes] = useState<string>("todos");
  const [selectedAno, setSelectedAno] = useState<string>("2025");
  
  const { jogadores, rodadas, isLoading, error } = useDynamicTableData(
    selectedRodada,
    selectedMes,
    selectedAno
  );
  
  const { sortField, sortDirection, handleSort, sortPlayers } = useTableSort();
  
  // Get all unique rounds from players data
  const todasRodadas = Array.from(
    new Set(
      jogadores.flatMap(jogador => 
        Object.keys(jogador.rodadas)
      )
    )
  ).sort((a, b) => {
    const numA = parseInt(a.substring(1));
    const numB = parseInt(b.substring(1));
    return numA - numB;
  });

  // Calculate totals
  const calcularTotalPorRodada = () => {
    const totais: Record<string, number> = {};
    todasRodadas.forEach(rodada => {
      totais[rodada] = jogadores.reduce((sum, jogador) => {
        return sum + (jogador.rodadas[rodada] || 0);
      }, 0);
    });
    return totais;
  };
  
  const totaisPorRodada = calcularTotalPorRodada();
  const totalGeral = jogadores.reduce((sum, jogador) => sum + jogador.pontos_total, 0);

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex ml-1 text-muted-foreground">
      {sortField === field ? (
        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4 opacity-30" />
      )}
    </span>
  );

  const sortedPlayers = sortPlayers(jogadores, selectedRodada);

  return (
    <div className="space-y-4">
      <TableFilters
        rodadas={rodadas}
        selectedRodada={selectedRodada}
        selectedMes={selectedMes}
        selectedAno={selectedAno}
        onRodadaChange={setSelectedRodada}
        onMesChange={setSelectedMes}
        onAnoChange={setSelectedAno}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <RotateCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : (
          <div className="max-h-[calc(100vh-16rem)] overflow-auto rounded-lg border border-border/50 shadow-subtle">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted font-poppins">
                  <TableHead className="w-10 text-left font-medium text-muted-foreground">#</TableHead>
                  <TableHead 
                    className="text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                    onClick={() => handleSort("nome")}
                  >
                    Jogador <SortIcon field="nome" />
                  </TableHead>
                  <TableHead 
                    className="text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                    onClick={() => handleSort("pontos_total")}
                  >
                    Total <SortIcon field="pontos_total" />
                  </TableHead>
                  {todasRodadas.map(rodada => (
                    <TableHead 
                      key={rodada} 
                      className="text-center font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                      onClick={() => {
                        handleSort("rodada");
                        setSelectedRodada(rodada.substring(1));
                      }}
                    >
                      {rodada.toUpperCase()}
                      {selectedRodada === rodada.substring(1) && <SortIcon field="rodada" />}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((jogador, index) => (
                  <TableRow 
                    key={jogador.id}
                    className={index % 2 === 0 ? 'bg-white dark:bg-gray-950/50' : 'bg-gray-50 dark:bg-gray-900/30'}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{jogador.nome}</TableCell>
                    <TableCell className="font-bold text-center">{jogador.pontos_total}</TableCell>
                    {todasRodadas.map(rodada => (
                      <TableCell key={`${jogador.id}-${rodada}`} className="text-center">
                        {jogador.rodadas[rodada] ?? '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {jogadores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3 + todasRodadas.length} className="text-center py-8 text-gray-500">
                      Nenhum resultado encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              {jogadores.length > 0 && (
                <TableFooter>
                  <TableRow className="border-t-2 border-border bg-muted/30 font-bold">
                    <TableCell>-</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">{totalGeral}</TableCell>
                    {todasRodadas.map(rodada => (
                      <TableCell key={`footer-${rodada}`} className="text-center">
                        {totaisPorRodada[rodada] || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
