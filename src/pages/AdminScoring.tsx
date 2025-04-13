
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScoringSystem } from "@/types";
import { SCORING_SYSTEM } from "@/utils/mockData";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ScoreSettingsForm } from "@/components/admin/scoring/ScoreSettingsForm";
import RulesView from "@/components/rules/RulesView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminScoring = () => {
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>(SCORING_SYSTEM);
  const { toast } = useToast();

  const handleSaveScoring = (values: ScoringSystem) => {
    setScoringSystem(values);
    
    // In a real application, we would save this to a database
    toast({
      title: "Pontuação atualizada",
      description: "O sistema de pontuação foi atualizado com sucesso."
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Gerenciamento de Pontuação</h1>
          <p className="text-muted-foreground mt-2">
            Configure o sistema de pontuação para os kichutes do Brasileirão 2025
          </p>
        </div>

        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="rules">Regras Atuais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Pontuação</CardTitle>
                <CardDescription>
                  Define quantos pontos são concedidos para cada tipo de acerto nos kichutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreSettingsForm 
                  initialValues={scoringSystem} 
                  onSubmit={handleSaveScoring} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rules">
            <RulesView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminScoring;
