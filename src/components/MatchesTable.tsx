
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface MatchesTableProps {
  className?: string;
}

const MatchesTable = ({ className }: MatchesTableProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [times, setTimes] = useState<{ id: string; nome: string }[]>([]);
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedTime, setSelectedTime] = useState<string>("todos");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar rodadas disponíveis
  useEffect(() => {
    const fetchRodadas = async () => {
      try {
        const { data, error } = await supabase
          .from('partidas')
          .select('rodada')
          .order('rodada');
        
        if (error) throw error;
        
        // Extrair rodadas únicas
        const uniqueRodadas = [...new Set(data?.map(item => item.rodada))].filter(Boolean) as number[];
        setRodadas(uniqueRodadas);
      } catch (err) {
        console.error("Erro ao buscar rodadas:", err);
        setError("Não foi possível carregar as rodadas");
      }
    };

    fetchRodadas();
  }, []);

  // Buscar times
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const { data, error } = await supabase
          .from('times')
          .select('id, nome')
          .order('nome');
        
        if (error) throw error;
        
        setTimes(data || []);
      } catch (err) {
        console.error("Erro ao buscar times:", err);
        setError("Não foi possível carregar os times");
      }
    };

    fetchTimes();
  }, []);

  // Buscar partidas com filtros
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('partidas')
          .select(`
            id,
            rodada,
            data,
            local,
            placar_casa,
            placar_visitante,
            time_casa:times!time_casa_id(id, nome, sigla),
            time_visitante:times!time_visitante_id(id, nome, sigla)
          `);
        
        // Aplicar filtro de rodada se selecionado
        if (selectedRodada !== "todas") {
          query = query.eq('rodada', parseInt(selectedRodada));
        }
        
        // Aplicar filtro de time se selecionado
        if (selectedTime !== "todos") {
          query = query.or(`time_casa_id.eq.${selectedTime},time_visitante_id.eq.${selectedTime}`);
        }
        
        // Ordenar por rodada e data
        query = query.order('rodada').order('data');
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        console.log("Dados brutos das partidas:", data);
        
        // Formatar os dados para o formato necessário para a tabela
        const formattedData = (data || []).map(item => ({
          id: item.id,
          rodada: item.rodada,
          data: item.data,
          local: item.local || 'A definir',
          time_casa: {
            id: item.time_casa?.id || '',
            nome: item.time_casa?.nome || 'N/A',
            sigla: item.time_casa?.sigla || 'N/A'
          },
          time_visitante: {
            id: item.time_visitante?.id || '',
            nome: item.time_visitante?.nome || 'N/A',
            sigla: item.time_visitante?.sigla || 'N/A'
          },
          placar_casa: item.placar_casa,
          placar_visitante: item.placar_visitante
        }));
        
        console.log("Dados formatados das partidas:", formattedData);
        
        setMatches(formattedData);
      } catch (err) {
        console.error("Erro ao buscar partidas:", err);
        setError("Não foi possível carregar as partidas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedRodada, selectedTime]);

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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="rodada-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rodada:
          </label>
          <Select value={selectedRodada} onValueChange={setSelectedRodada}>
            <SelectTrigger id="rodada-select" className="w-[160px]">
              <SelectValue placeholder="Selecionar rodada" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as rodadas</SelectItem>
              {rodadas.map(rodada => (
                <SelectItem key={`rodada-${rodada}`} value={rodada.toString()}>
                  Rodada {rodada}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="time-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Time:
          </label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger id="time-select" className="w-[200px]">
              <SelectValue placeholder="Selecionar time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os times</SelectItem>
              {times.map(time => (
                <SelectItem key={time.id} value={time.id}>
                  {time.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
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
        )}
      </div>
    </div>
  );
};

export default MatchesTable;
