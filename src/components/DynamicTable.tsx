
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { RotateCw } from "lucide-react";

interface JogadorData {
  id: string;
  nome: string;
  pontos_total: number;
  rodadas: Record<string, number>;
}

interface DynamicTableProps {
  className?: string;
}

const DynamicTable = ({ className }: DynamicTableProps) => {
  const [jogadores, setJogadores] = useState<JogadorData[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedMes, setSelectedMes] = useState<string>("todos");
  const [selectedAno, setSelectedAno] = useState<string>("2025");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar rodadas disponíveis no Supabase
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

  // Buscar jogadores e seus pontos
  useEffect(() => {
    const fetchJogadores = async () => {
      setIsLoading(true);
      try {
        // Buscar os jogadores
        const { data: jogadoresData, error: jogadoresError } = await supabase
          .from('jogadores')
          .select('id, nome, pagamento_total');
        
        if (jogadoresError) throw jogadoresError;

        // Buscar kichutes dos jogadores para calcular pontos por rodada
        const { data: kichutesData, error: kichutesError } = await supabase
          .from('kichutes')
          .select('jogador_id, partida_id, pontos')
          .eq('pontos', selectedRodada !== "todas" ? parseInt(selectedRodada) : undefined);
        
        if (kichutesError) throw kichutesError;

        // Buscar informações das partidas para saber a rodada de cada kichute
        const { data: partidasData, error: partidasError } = await supabase
          .from('partidas')
          .select('id, rodada, data');
        
        if (partidasError) throw partidasError;

        // Criar mapa de partidas por ID
        const partidasPorId = partidasData.reduce((acc, partida) => {
          acc[partida.id] = partida;
          return acc;
        }, {} as Record<string, any>);

        // Extrair meses únicos das datas das partidas
        const mesesDisponiveis = [...new Set(partidasData
          .map(partida => {
            const data = new Date(partida.data);
            return `${data.getMonth() + 1}-${data.getFullYear()}`;
          }))];
        
        setMeses(mesesDisponiveis);

        // Agrupar pontos por jogador e rodada
        const pontosPorJogador: Record<string, Record<string, number>> = {};
        const pontosTotaisPorJogador: Record<string, number> = {};

        kichutesData.forEach(kichute => {
          const partida = partidasPorId[kichute.partida_id];
          if (!partida) return;

          const rodada = `r${partida.rodada}`;
          const jogadorId = kichute.jogador_id;
          const pontos = kichute.pontos || 0;

          // Filtrar por mês se selecionado
          if (selectedMes !== "todos") {
            const dataPartida = new Date(partida.data);
            const mesPartida = `${dataPartida.getMonth() + 1}-${dataPartida.getFullYear()}`;
            if (mesPartida !== selectedMes) return;
          }

          // Inicializar estruturas de dados se necessário
          if (!pontosPorJogador[jogadorId]) {
            pontosPorJogador[jogadorId] = {};
          }
          if (!pontosPorJogador[jogadorId][rodada]) {
            pontosPorJogador[jogadorId][rodada] = 0;
          }
          
          // Acumular pontos
          pontosPorJogador[jogadorId][rodada] += pontos;
          
          // Acumular total de pontos
          if (!pontosTotaisPorJogador[jogadorId]) {
            pontosTotaisPorJogador[jogadorId] = 0;
          }
          pontosTotaisPorJogador[jogadorId] += pontos;
        });

        // Mapear dados para o formato da tabela
        const jogadoresFormatados = jogadoresData.map(jogador => ({
          id: jogador.id,
          nome: jogador.nome,
          pontos_total: pontosTotaisPorJogador[jogador.id] || 0,
          rodadas: pontosPorJogador[jogador.id] || {}
        }));

        // Ordenar por pontos totais (decrescente)
        jogadoresFormatados.sort((a, b) => b.pontos_total - a.pontos_total);

        setJogadores(jogadoresFormatados);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados dos jogadores");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJogadores();
  }, [selectedRodada, selectedMes, selectedAno]);

  // Obter todas as rodadas disponíveis dos jogadores
  const todasRodadas = Array.from(
    new Set(
      jogadores.flatMap(jogador => 
        Object.keys(jogador.rodadas)
      )
    )
  ).sort((a, b) => {
    // Ordenar por número da rodada
    const numA = parseInt(a.substring(1));
    const numB = parseInt(b.substring(1));
    return numA - numB;
  });

  // Mapear nomes dos meses
  const getNomeMes = (codigoMes: string) => {
    if (codigoMes === "todos") return "Todos os meses";
    
    const [mes, ano] = codigoMes.split('-');
    const nomesMeses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    
    return `${nomesMeses[parseInt(mes) - 1]} de ${ano}`;
  };

  return (
    <div className="space-y-4">
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
          <label htmlFor="mes-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mês:
          </label>
          <Select value={selectedMes} onValueChange={setSelectedMes}>
            <SelectTrigger id="mes-select" className="w-[180px]">
              <SelectValue placeholder="Selecionar mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os meses</SelectItem>
              {meses.map(mes => (
                <SelectItem key={`mes-${mes}`} value={mes}>
                  {getNomeMes(mes)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ano-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ano:
          </label>
          <Select value={selectedAno} onValueChange={setSelectedAno}>
            <SelectTrigger id="ano-select" className="w-[120px]">
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
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
                <TableHead className="w-10 text-left">#</TableHead>
                <TableHead className="text-left">Jogador</TableHead>
                <TableHead className="text-left font-semibold">Total</TableHead>
                {todasRodadas.map(rodada => (
                  <TableHead key={rodada} className="text-left">
                    {rodada.toUpperCase()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {jogadores.map((jogador, index) => (
                <TableRow 
                  key={jogador.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{jogador.nome}</TableCell>
                  <TableCell className="font-bold">{jogador.pontos_total}</TableCell>
                  {todasRodadas.map(rodada => (
                    <TableCell key={`${jogador.id}-${rodada}`}>
                      {jogador.rodadas[rodada] || '-'}
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
          </Table>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;
