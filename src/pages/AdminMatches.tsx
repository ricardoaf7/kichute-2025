
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchesProvider } from "@/contexts/MatchesContext";
import { MatchesContent } from "@/components/admin/matches/MatchesContent";
import { useAuth } from "@/contexts/auth";

const AdminMatches = () => {
  const { isAdmin } = useAuth();

  return (
    <MatchesProvider>
      <div className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-slide-down">
            <h1 className="text-3xl font-bold">Gerenciar Jogos</h1>
            <p className="text-muted-foreground mt-2">
              Adicione e edite partidas do campeonato
            </p>
          </div>

          <MatchesContent />
        </div>
      </div>
    </MatchesProvider>
  );
};

export default AdminMatches;
