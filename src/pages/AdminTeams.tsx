
import { useState } from "react";
import { TeamForm } from "@/components/admin/teams/TeamForm";
import { TeamsList } from "@/components/admin/teams/TeamsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsView from "../components/teams/TeamsView";

const AdminTeams = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab("edit");
  };

  const handleCreateNew = () => {
    setSelectedTeamId(null);
    setActiveTab("edit");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "overview") {
      setSelectedTeamId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Gerenciar Times</h1>
          <p className="text-muted-foreground mt-2">
            Adicione e edite times para o Brasileirão 2025
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="edit">
              {selectedTeamId ? "Editar Time" : "Novo Time"}
            </TabsTrigger>
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <TeamsList onSelectTeam={handleSelectTeam} onCreateNew={handleCreateNew} />
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <TeamForm teamId={selectedTeamId} onSaved={() => setActiveTab("overview")} />
          </TabsContent>
          
          <TabsContent value="database" className="space-y-4">
            <TeamsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminTeams;
