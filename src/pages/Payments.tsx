
import React from "react";
import PaymentsView from "../components/PaymentsView";

const Payments = () => {
  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe os pagamentos e taxas do bolão
          </p>
        </div>

        <PaymentsView />
      </div>
    </div>
  );
};

export default Payments;
