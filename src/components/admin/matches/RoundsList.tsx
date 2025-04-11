
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMatches } from "@/contexts/MatchesContext";

export const RoundsList = () => {
  const { rounds, handleAddRound, handleDeleteRound } = useMatches();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Rodadas</CardTitle>
          <Button onClick={handleAddRound}>Nova Rodada</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rounds.map((round) => (
            <Card key={round.number} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Rodada {round.number}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteRound(round.number)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div>Partidas: {round.matches.length}</div>
                  <div>{round.closed ? "Fechada" : "Aberta"}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
