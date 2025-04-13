
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
import { RotateCw, Star, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Kichute {
  id: string;
  rodada: number;
  partida: {
    id: string;
    time_casa: { nome: string; sigla: string };
    time_visitante: { nome: string; sigla: string };
  };
  jogador: { id: string; nome: string };
  palpite_casa: number;
  palpite_visitante: number;
  pontos: number;
}

interface KichuteTableProps {
  className?: string;
}

const KichuteTable = ({ className }: KichuteTableProps) => {
  const [kichutes, setKichutes] = useState<Kichute[]>([]);
  const [rodadas, setRodadas] = useState<number[]>([]);
  const [jogadores, setJogadores] = useState<{ id: string; nome: string }[]>([]);
  const [selectedRodada, setSelectedRodada] = useState<string>("todas");
  const [selectedJogador, setSelectedJogador] = useState<string>("todos");
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

  // Buscar jogadores
  useEffect(() => {
    const fetchJogadores = async () => {
      try {
        const { data, error } = await supabase
          .from('jogadores')
          .select('id, nome')
          .order('nome');
        
        if (error) throw error;
        
        setJogadores(data || []);
      } catch (err) {
        console.error("Erro ao buscar jogadores:", err);
        setError("Não foi possível carregar os jogadores");
      }
    };

    fetchJogadores();
  }, []);

  // Buscar kichutes com filtros
  useEffect(() => {
    const fetchKichutes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('kichutes')
          .select(`
            id,
            palpite_casa,
            palpite_visitante,
            pontos,
            jogador_id,
            partida_id,
            jogador:jogadores(id, nome),
            partida:partidas(
              id,
              rodada,
              time_casa:times!time_casa_id(nome, sigla),
              time_visitante:times!time_visitante_id(nome, sigla)
            )
          `);
        
        // Aplicar filtro de rodada se selecionado
        if (selectedRodada !== "todas") {
          query = query.eq('partida.rodada', parseInt(selectedRodada));
        }
        
        // Aplicar filtro de jogador se selecionado
        if (selectedJogador !== "todos") {
          query = query.eq('jogador_id', selectedJogador);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        console.log("Dados brutos dos kichutes:", data);
        
        // Formatar os dados para o formato necessário para a tabela
        const formattedData = (data || []).map(item => ({
          id: item.id,
          rodada: item.partida?.rodada,
          partida: {
            id: item.partida_id,
            time_casa: {
              nome: item.partida?.time_casa?.nome || 'N/A',
              sigla: item.partida?.time_casa?.sigla || 'N/A'
            },
            time_visitante: {
              nome: item.partida?.time_visitante?.nome || 'N/A',
              sigla: item.partida?.time_visitante?.sigla || 'N/A'
            }
          },
          jogador: {
            id: item.jogador_id,
            nome: item.jogador?.nome || 'N/A'
          },
          palpite_casa: item.palpite_casa || 0,
          palpite_visitante: item.palpite_visitante || 0,
          pontos: item.pontos || 0
        }));
        
        console.log("Dados formatados dos kichutes:", formattedData);
        
        // Ordenar por rodada e então por pontos (decrescente)
        formattedData.sort((a, b) => {
          if (a.rodada !== b.rodada) {
            return a.rodada - b.rodada;
          }
          return b.pontos - a.pontos;
        });
        
        setKichutes(formattedData);
      } catch (err) {
        console.error("Erro ao buscar kichutes:", err);
        setError("Não foi possível carregar os kichutes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKichutes();
  }, [selectedRodada, selectedJogador]);

  // Função para renderizar ícone de pontuação
  const getPontosIcon = (pontos: number) => {
    if (pontos >= 7) return <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />;
    if (pontos >= 4) return <Medal className="h-4 w-4 text-blue-500 inline mr-1" />;
    if (pontos >= 2) return <Star className="h-4 w-4 text-green-500 inline mr-1" />;
    return null;
  };

  // Função para obter classe CSS com base na pontuação
  const getPontosClass = (pontos: number) => {
    if (pontos >= 7) return "font-bold text-yellow-600 dark:text-yellow-400";
    if (pontos >= 4) return "font-semibold text-blue-600 dark:text-blue-400";
    if (pontos >= 2) return "font-medium text-green-600 dark:text-green-400";
    return "text-gray-600 dark:text-gray-400";
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
          <label htmlFor="jogador-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Jogador:
          </label>
          <Select value={selectedJogador} onValueChange={setSelectedJogador}>
            <SelectTrigger id="jogador-select" className="w-[200px]">
              <SelectValue placeholder="Selecionar jogador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os jogadores</SelectItem>
              {jogadores.map(jogador => (
                <SelectItem key={jogador.id} value={jogador.id}>
                  {jogador.nome}
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
                <TableHead className="text-center">Jogo</TableHead>
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
                      {kichute.jogador.nome}
                    </TableCell>
                    <TableCell className="text-center">
                      {kichute.palpite_casa} x {kichute.palpite_visitante}
                    </TableCell>
                    <TableCell className={cn("text-center", getPontosClass(kichute.pontos))}>
                      {getPontosIcon(kichute.pontos)}
                      {kichute.pontos}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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
