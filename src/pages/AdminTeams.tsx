
import { useState } from "react";
import TeamsList from "@/components/admin/teams/TeamsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsView from "../components/teams/TeamsView";

const AdminTeams = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Times</h1>
          <p className="text-muted-foreground mt-2">
            Adicione e edite times para o Brasileirão 2025
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="overview">Times</TabsTrigger>
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <TeamsList />
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
