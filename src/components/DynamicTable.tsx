
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
  TableFooter
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JogadorData {
  id: string;
  nome: string;
  pontos_total: number;
  rodadas: Record<string, number>;
}

type SortDirection = "asc" | "desc";
type SortField = "nome" | "pontos_total" | "rodada";

const DynamicTable = () => {
  const [jogadores, setJogadores] = useState<JogadorData[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [meses, setMeses] = useState<string[]>([]);
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedMes, setSelectedMes] = useState<string>("todos");
  const [selectedAno, setSelectedAno] = useState<string>("2025");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("pontos_total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { toast } = useToast();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Função para obter ícone de ordenação
  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex ml-1 text-muted-foreground">
      {sortField === field ? (
        sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4 opacity-30" />
      )}
    </span>
  );

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
        toast({
          title: "Erro",
          description: "Não foi possível carregar as rodadas",
          variant: "destructive"
        });
      }
    };

    fetchRodadas();
  }, [toast]);

  // Buscar pontuações por rodada para todos os jogadores
  useEffect(() => {
    const fetchPontuacoes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Buscando pontuações com filtro rodada:", selectedRodada);
        
        // 1. Buscar todos os jogadores
        const { data: jogadoresData, error: jogadoresError } = await supabase
          .from('jogadores')
          .select('id, nome')
          .order('nome');
        
        if (jogadoresError) throw jogadoresError;
        
        if (!jogadoresData || jogadoresData.length === 0) {
          setJogadores([]);
          setIsLoading(false);
          setError("Nenhum jogador encontrado");
          return;
        }
        
        console.log("Jogadores encontrados:", jogadoresData.length);

        // 2. Buscar pontuações por rodada
        let query = supabase.from('pontuacao_rodada')
          .select('rodada, jogador_id, pontos');
          
        if (selectedRodada !== "todas") {
          query = query.eq('rodada', parseInt(selectedRodada));
        }
        
        const { data: pontuacoesData, error: pontuacoesError } = await query;
        
        if (pontuacoesError) throw pontuacoesError;
        
        console.log("Pontuações encontradas:", pontuacoesData?.length || 0);
        
        // 3. Organizar dados por jogador
        const jogadoresFormatados: JogadorData[] = jogadoresData.map(jogador => {
          // Filtrar pontuações para este jogador
          const pontuacoesJogador = pontuacoesData?.filter(p => p.jogador_id === jogador.id) || [];
          
          // Mapear rodadas e pontos
          const rodadasObj: Record<string, number> = {};
          let pontosTotais = 0;
          
          pontuacoesJogador.forEach(p => {
            const rodadaKey = `r${p.rodada}`;
            const pontos = typeof p.pontos === 'number' ? p.pontos : parseInt(p.pontos as any, 10) || 0;
            rodadasObj[rodadaKey] = pontos;
            pontosTotais += pontos;
          });
          
          return {
            id: jogador.id,
            nome: jogador.nome,
            pontos_total: pontosTotais,
            rodadas: rodadasObj
          };
        });

        // Ordenar jogadores
        const sortedJogadores = [...jogadoresFormatados].sort((a, b) => {
          if (sortField === "nome") {
            return sortDirection === "asc" 
              ? a.nome.localeCompare(b.nome) 
              : b.nome.localeCompare(a.nome);
          } else if (sortField === "pontos_total") {
            return sortDirection === "asc" 
              ? a.pontos_total - b.pontos_total 
              : b.pontos_total - a.pontos_total;
          } else if (sortField === "rodada" && selectedRodada !== "todas") {
            const rodadaKey = `r${selectedRodada}`;
            const pontosA = a.rodadas[rodadaKey] || 0;
            const pontosB = b.rodadas[rodadaKey] || 0;
            return sortDirection === "asc" ? pontosA - pontosB : pontosB - pontosA;
          }
          return 0;
        });
        
        setJogadores(sortedJogadores);
        console.log("Dados formatados:", sortedJogadores);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados dos jogadores");
        toast({
          title: "Erro",
          description: "Erro ao carregar dados dos jogadores",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPontuacoes();
  }, [selectedRodada, selectedMes, selectedAno, sortField, sortDirection, toast]);

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

  // Calcular o total de pontos por rodada (para o rodapé)
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
                        setSortField("rodada");
                        setSelectedRodada(rodada.substring(1));
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                      }}
                    >
                      {rodada.toUpperCase()}
                      {selectedRodada === rodada.substring(1) && <SortIcon field="rodada" />}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {jogadores.map((jogador, index) => (
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
