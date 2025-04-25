
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DynamicTableFiltersProps {
  rodadas: number[];
  selectedRodada: string;
  selectedMes: string;
  selectedAno: string;
  onRodadaChange: (value: string) => void;
  onMesChange: (value: string) => void;
  onAnoChange: (value: string) => void;
  viewMode: "table" | "dynamic";
}

export const DynamicTableFilters = ({
  rodadas,
  selectedRodada,
  selectedMes,
  selectedAno,
  onRodadaChange,
  onMesChange,
  onAnoChange,
  viewMode
}: DynamicTableFiltersProps) => {
  // Gerar todas as 38 rodadas para o seletor
  const todasRodadas = Array.from({ length: 38 }, (_, i) => i + 1);
  
  // Meses do ano
  const meses = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  return (
    <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="rodada-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Rodada:
        </label>
        <Select value={selectedRodada} onValueChange={onRodadaChange}>
          <SelectTrigger id="rodada-select" className="w-[160px]">
            <SelectValue placeholder="Selecionar rodada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as rodadas</SelectItem>
            {todasRodadas.map(rodada => {
              // Verificar se esta rodada tem dados
              const temDados = rodadas.includes(rodada);
              return (
                <SelectItem 
                  key={`rodada-${rodada}`} 
                  value={rodada.toString()}
                  // Destacar visualmente rodadas com dados
                  className={temDados ? "font-medium" : "opacity-70"}
                >
                  {temDados ? `Rodada ${rodada} ✓` : `Rodada ${rodada}`}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mes-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mês:
        </label>
        <Select 
          value={selectedMes} 
          onValueChange={onMesChange}
          disabled={selectedRodada !== "todas" && selectedRodada !== ""}
        >
          <SelectTrigger id="mes-select" className="w-[180px]">
            <SelectValue placeholder="Selecionar mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            {meses.map(mes => (
              <SelectItem key={`mes-${mes.value}`} value={`${mes.value}-${selectedAno}`}>
                {mes.label} de {selectedAno}
              </SelectItem>
            ))}
            {/* Opção especial para Jan-Jul (primeiro turno) */}
            <SelectItem value="01-07-2025">1º Turno (Jan-Jul)</SelectItem>
            {/* Opção especial para Ago-Dez (segundo turno) */}
            <SelectItem value="08-12-2025">2º Turno (Ago-Dez)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="ano-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Ano:
        </label>
        <Select value={selectedAno} onValueChange={onAnoChange}>
          <SelectTrigger id="ano-select" className="w-[120px]">
            <SelectValue placeholder="Selecionar ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
