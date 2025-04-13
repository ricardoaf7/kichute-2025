
import { useState } from "react";
import MatchCard from "@/components/MatchCard";
import RoundSelector from "@/components/RoundSelector";
import MatchesTable from "@/components/MatchesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Matches = () => {
  const [activeTab, setActiveTab] = useState("cards");
  const [selectedRound, setSelectedRound] = useState(1);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleRoundChange = (round: number) => {
    setSelectedRound(round);
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Partidas</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe todas as partidas do Brasileirão 2025
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="table">Tabela</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-border/40 shadow-subtle mb-8">
              <RoundSelector 
                currentRound={selectedRound} 
                onSelectRound={handleRoundChange} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 5 }, (_, i) => (
                <MatchCard key={i} round={selectedRound} matchIndex={i} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <MatchesTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Matches;
