
import React from "react";

interface FilterSelectorProps {
  selectedRound: number | undefined;
  selectedMonth: string;
  selectedYear: string;
  allRounds: number[];
  handleRoundChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  selectedRound,
  selectedMonth,
  selectedYear,
  allRounds,
  handleRoundChange,
  handleMonthChange,
  handleYearChange,
}) => {
  const months = [
    { value: "all", label: "Todos" },
    { value: "mar-apr", label: "Março/Abril" },
    { value: "may", label: "Maio" },
    { value: "jun", label: "Junho" },
    { value: "jul", label: "Julho" },
    { value: "aug", label: "Agosto" },
    { value: "sep", label: "Setembro" },
    { value: "oct", label: "Outubro" },
    { value: "nov", label: "Novembro" },
    { value: "dec", label: "Dezembro" },
  ];

  const years = [
    { value: "2025", label: "2025" },
  ];

  return (
    <>
      <div className="flex items-center space-x-3">
        <label htmlFor="round-select" className="text-sm font-medium">
          Rodada:
        </label>
        <select
          id="round-select"
          value={selectedRound ? selectedRound.toString() : "total"}
          onChange={handleRoundChange}
          className="form-input"
        >
          <option value="total">Todas</option>
          {allRounds.map(round => (
            <option key={round} value={round.toString()}>
              Rodada {round}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-3">
        <label htmlFor="month-select" className="text-sm font-medium">
          Mês:
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="form-input"
          disabled={selectedRound !== undefined}
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-3">
        <label htmlFor="year-select" className="text-sm font-medium">
          Ano:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className="form-input"
        >
          {years.map(year => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default FilterSelector;
