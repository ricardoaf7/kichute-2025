
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TableFiltersProps {
  rodadas: number[];
  selectedRodada: string;
  selectedMes: string;
  selectedAno: string;
  onRodadaChange: (value: string) => void;
  onMesChange: (value: string) => void;
  onAnoChange: (value: string) => void;
  months?: { value: string; label: string }[];
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  rodadas,
  selectedRodada,
  selectedMes,
  selectedAno,
  onRodadaChange,
  onMesChange,
  onAnoChange,
  months = []
}) => {
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
        <Select value={selectedMes} onValueChange={onMesChange}>
          <SelectTrigger id="mes-select" className="w-[180px]">
            <SelectValue placeholder="Selecionar mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            {months.map(month => (
              <SelectItem key={`mes-${month.value}`} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
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
