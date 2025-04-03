
import React from "react";
import ApiFootballTester from "../components/ApiFootballTester";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Kichute Bolão</h1>
        <p className="text-xl text-center mb-12">
          Bem-vindo ao Kichute Bolão, o bolão do Brasileirão!
        </p>
        
        <ApiFootballTester />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Como funciona</h2>
            <p>
              Faça seus palpites para cada rodada do Brasileirão e concorra a prêmios!
              Os pontos são calculados com base na precisão dos seus palpites.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Regras de pontuação</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acertar o placar exato: 10 pontos</li>
              <li>Acertar o vencedor e diferença de gols: 5 pontos</li>
              <li>Acertar apenas o vencedor: 3 pontos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
