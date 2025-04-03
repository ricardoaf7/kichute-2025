
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { testApiFootballFunction } from "../utils/api";
import { Loader2 } from "lucide-react";

const ApiFootballTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean; error?: string} | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const success = await testApiFootballFunction();
      setResult({ success });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 mb-8 border rounded-lg bg-muted/20">
      <h2 className="text-lg font-medium mb-4">Teste da API Football</h2>
      
      <Button onClick={handleTest} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testando...
          </>
        ) : (
          "Testar API Football"
        )}
      </Button>
      
      {result && (
        <div className="mt-4 p-3 rounded-md border border-border">
          {result.success ? (
            <p className="text-green-600">Conexão estabelecida com sucesso!</p>
          ) : (
            <p className="text-red-600">Falha na conexão: {result.error || "Erro desconhecido"}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiFootballTester;
