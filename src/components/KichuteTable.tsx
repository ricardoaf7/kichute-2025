
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { KichuteFilters } from "./kichutes/KichuteFilters";
import { KichutePoints } from "./kichutes/KichutePoints";
import { useKichuteData } from "@/hooks/useKichuteData";

interface KichuteTableProps {
  className?: string;
}

const KichuteTable = ({ className }: KichuteTableProps) => {
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedJogador, setSelectedJogador] = useState<string>("todos");
  const { kichutes, isLoading, error } = useKichuteData(selectedRodada, selectedJogador);

  return (
    <div className={cn("space-y-4", className)}>
      <KichuteFilters
        selectedRodada={selectedRodada}
        selectedJogador={selectedJogador}
        onRodadaChange={setSelectedRodada}
        onJogadorChange={setSelectedJogador}
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
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900 font-poppins">
                <TableHead className="text-center">Rodada</TableHead>
                <TableHead className="text-center">Jogo</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead className="text-center">Jogador</TableHead>
                <TableHead className="text-center">Palpite</TableHead>
                <TableHead className="text-center font-semibold">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kichutes.length > 0 ? (
                kichutes.map((kichute) => (
                  <TableRow 
                    key={kichute.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <TableCell className="text-center font-medium">
                      {kichute.rodada}
                    </TableCell>
                    <TableCell className="text-center">
                      {kichute.partida.time_casa.sigla} x {kichute.partida.time_visitante.sigla}
                    </TableCell>
                    <TableCell className="text-center">
                      {kichute.partida.placar_casa !== null && kichute.partida.placar_visitante !== null ? (
                        `${kichute.partida.placar_casa} x ${kichute.partida.placar_visitante}`
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {kichute.jogador.nome}
                    </TableCell>
                    <TableCell className="text-center">
                      {kichute.palpite_casa} x {kichute.palpite_visitante}
                    </TableCell>
                    <TableCell className="text-center">
                      <KichutePoints points={kichute.pontos} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum kichute encontrado para os filtros selecionados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default KichuteTable;

