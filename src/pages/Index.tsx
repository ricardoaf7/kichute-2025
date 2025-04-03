
import React from "react";
import ApiFootballTester from "../components/ApiFootballTester";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Kichute Bolão</h1>
        <p className="text-xl text-center mb-8">
          Bem-vindo ao Kichute Bolão, o bolão do Brasileirão!
        </p>
        
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Teste da API Football</AlertTitle>
          <AlertDescription>
            Use o painel abaixo para testar a conexão com a API Football e verificar rodadas e partidas.
            Certifique-se de que a Supabase Edge Function esteja implantada corretamente.
          </AlertDescription>
        </Alert>
        
        <ApiFootballTester />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-3">Como funciona</h2>
              <p>
                Faça seus palpites para cada rodada do Brasileirão e concorra a prêmios!
                Os pontos são calculados com base na precisão dos seus palpites.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-3">Regras de pontuação</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Acertar o placar exato: 10 pontos</li>
                <li>Acertar o vencedor e diferença de gols: 5 pontos</li>
                <li>Acertar apenas o vencedor: 3 pontos</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
