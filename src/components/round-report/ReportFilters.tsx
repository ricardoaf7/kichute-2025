
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportFiltersProps {
  selectedRound: number;
  setSelectedRound: (value: number) => void;
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedYear: string;
  setSelectedYear: (value: string) => void;
  rounds: number[];
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  selectedRound,
  setSelectedRound,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  rounds,
}) => {
  const months = [
    { value: "all", label: "Todos os meses" },
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
    { value: "12", label: "Dezembro" },
  ];

  const years = [{ value: "2025", label: "2025" }];

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <div className="w-full sm:w-auto">
        <Select 
          value={selectedRound.toString()} 
          onValueChange={(value) => setSelectedRound(Number(value))}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Rodada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todas as rodadas</SelectItem>
            {rounds.map((round) => (
              <SelectItem key={`round-${round}`} value={round.toString()}>
                Rodada {round}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-auto">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-[120px]">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
