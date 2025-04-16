
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GuessingForm from "@/components/GuessingForm";
import GuessingFormNew from "@/components/guesses/GuessingFormNew";
import KichuteTable from "@/components/KichuteTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Guesses = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmitSuccess = () => {
    toast({
      title: "Palpites enviados",
      description: "Seus palpites foram enviados com sucesso!"
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Kichutes</h1>
          <p className="text-muted-foreground mt-2">
            Envie seus palpites para os próximos jogos e visualize palpites anteriores
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="submit">Enviar Palpites</TabsTrigger>
            <TabsTrigger value="view">Visualizar Palpites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit" className="space-y-4">
            <GuessingFormNew onSubmitSuccess={handleSubmitSuccess} />
          </TabsContent>
          
          <TabsContent value="view" className="space-y-4">
            <KichuteTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Guesses;
