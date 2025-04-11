
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoundsList } from "@/components/admin/matches/RoundsList";
import { MatchesList } from "@/components/admin/matches/MatchesList";
import { MatchForm } from "@/components/admin/matches/MatchForm";
import { MatchesProvider } from "@/contexts/MatchesContext";
import { MatchesContent } from "@/components/admin/matches/MatchesContent";

const AdminMatches = () => {
  return (
    <MatchesProvider>
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-slide-down">
            <h1 className="text-3xl font-bold">Gerenciar Jogos</h1>
            <p className="text-muted-foreground mt-2">
              Adicione e edite rodadas e partidas manualmente
            </p>
          </div>

          <Tabs defaultValue="rounds" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rounds">Rodadas</TabsTrigger>
              <TabsTrigger value="matches">Partidas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rounds" className="space-y-4 mt-4">
              <RoundsList />
            </TabsContent>
            
            <TabsContent value="matches" className="space-y-6 mt-4">
              <MatchesContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MatchesProvider>
  );
};

export default AdminMatches;
