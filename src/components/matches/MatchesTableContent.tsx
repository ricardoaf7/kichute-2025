
import { format } from "date-fns";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RotateCw } from "lucide-react";

interface Match {
  id: string;
  rodada: number;
  data: string;
  local: string;
  time_casa: { 
    id: string;
    nome: string; 
    sigla: string;
  };
  time_visitante: { 
    id: string;
    nome: string; 
    sigla: string;
  };
  placar_casa: number | null;
  placar_visitante: number | null;
}

interface MatchesTableContentProps {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
}

const MatchesTableContent = ({ matches, isLoading, error }: MatchesTableContentProps) => {
  // Função para extrair cidade e estádio do campo local
  const getLocationDetails = (local: string) => {
    if (!local || local === 'A definir') return { estadio: 'A definir', cidade: '' };
    
    const parts = local.split(',').map(part => part.trim());
    if (parts.length === 1) return { estadio: parts[0], cidade: '' };
    
    return {
      estadio: parts[0],
      cidade: parts.slice(1).join(', ')
    };
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: format(date, 'dd/MM/yyyy'),
        time: format(date, 'HH:mm')
      };
    } catch (error) {
      return { date: 'Data inválida', time: '' };
    }
  };

  // Função para formatar o resultado
  const formatResult = (placarCasa: number | null, placarVisitante: number | null) => {
    if (placarCasa === null || placarVisitante === null) {
      return 'Não realizado';
    }
    return `${placarCasa} x ${placarVisitante}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 dark:bg-gray-900 font-poppins">
          <TableHead className="text-center">Rodada</TableHead>
          <TableHead className="text-center">Data</TableHead>
          <TableHead className="text-center">Horário</TableHead>
          <TableHead className="text-center">Estádio</TableHead>
          <TableHead className="text-center">Cidade</TableHead>
          <TableHead className="text-center">Time Casa</TableHead>
          <TableHead className="text-center">Time Visitante</TableHead>
          <TableHead className="text-center">Resultado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {matches.length > 0 ? (
          matches.map((match) => {
            const { estadio, cidade } = getLocationDetails(match.local);
            const { date, time } = formatDate(match.data);
            
            return (
              <TableRow 
                key={match.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <TableCell className="text-center font-medium">
                  {match.rodada}
                </TableCell>
                <TableCell className="text-center">
                  {date}
                </TableCell>
                <TableCell className="text-center">
                  {time}
                </TableCell>
                <TableCell className="text-center">
                  {estadio}
                </TableCell>
                <TableCell className="text-center text-gray-600 dark:text-gray-400">
                  {cidade}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {match.time_casa.nome}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {match.time_visitante.nome}
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {formatResult(match.placar_casa, match.placar_visitante)}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
              Nenhuma partida encontrada para os filtros selecionados
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default MatchesTableContent;
