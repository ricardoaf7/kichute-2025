
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GuessingFormNew from "@/components/guesses/GuessingFormNew";
import KichuteTable from "@/components/KichuteTable";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentRound } from "@/hooks/useCurrentRound";

const Kichutes = () => {
  const { toast } = useToast();
  // Novidade: usar rodada atual para tab inicial
  const { currentRound, isLoading } = useCurrentRound();
  const [selectedTab, setSelectedTab] = useState('form');
  const [initialRound, setInitialRound] = useState<string>("1");

  useEffect(() => {
    if (!isLoading && currentRound) {
      setInitialRound(currentRound.toString());
    }
  }, [isLoading, currentRound]);

  const handleGuessSubmitSuccess = () => {
    toast({
      title: "Palpites salvos com sucesso!",
      description: "Seus kichutes foram registrados.",
      variant: "default",
    });
    setSelectedTab('view');
  };

  return (
    <div className="container py-6 pt-24">
      <h1 className="text-3xl font-bold mb-6">Kichutes</h1>
      <Separator className="mb-6" />

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="form">Fazer Kichutes</TabsTrigger>
          <TabsTrigger value="view">Ver Todos os Kichutes</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-6">
          <div className="bg-card rounded-lg shadow">
            {/* Passa a rodada inicial como prop */}
            <GuessingFormNew onSubmitSuccess={handleGuessSubmitSuccess} initialRound={initialRound} />
          </div>
        </TabsContent>

        <TabsContent value="view">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Todos os Kichutes</h2>
            <KichuteTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Kichutes;
