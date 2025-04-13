
import React, { useState } from "react";
import PaymentsFilter from "./payments/PaymentsFilter";
import PaymentsTable from "./payments/PaymentsTable";

const PaymentsView: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <PaymentsFilter
          onPlayerChange={setSelectedPlayer}
          onMonthChange={setSelectedMonth}
          onStatusChange={setSelectedStatus}
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-6">
        <h2 className="text-xl font-semibold mb-4">Tabela de Pagamentos</h2>
        <PaymentsTable
          selectedPlayer={selectedPlayer}
          selectedMonth={selectedMonth}
          selectedStatus={selectedStatus}
        />
      </div>
    </div>
  );
};

export default PaymentsView;
