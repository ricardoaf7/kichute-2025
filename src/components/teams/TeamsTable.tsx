
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTeamImagePath } from "@/utils/teamImages";

interface Team {
  id: string;
  nome: string;
  sigla: string;
  escudo_url: string | null;
}

const TeamsTable: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from("times")
          .select("id, nome, sigla, escudo_url")
          .order("nome");

        if (error) {
          console.error("Error fetching teams:", error.message);
        } else {
          setTeams(data || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-subtle border border-border/40 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead>Nome do Time</TableHead>
            <TableHead>Sigla</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                Nenhum time encontrado
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img
                      src={team.escudo_url || getTeamImagePath(team.nome)}
                      alt={`Escudo ${team.nome}`}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{team.nome}</TableCell>
                <TableCell>{team.sigla}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamsTable;
