
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { PLAYERS } from "@/utils/mockData";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const AdminUsers = () => {
  const [users, setUsers] = useState(PLAYERS);
  const { toast } = useToast();

  const handleAddUser = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de novos usuários será implementada em breve."
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do usuário ID ${userId} será implementada em breve.`
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Remoção do usuário ID ${userId} será implementada em breve.`
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold">Gerenciar Participantes</h1>
          <p className="text-muted-foreground mt-2">
            Adicione, edite e remova participantes do Brasileirão 2025
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={handleAddUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Participante
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
            <CardDescription>
              Lista de todos os jogadores participantes do Kichute FC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status de Pagamento</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.paid ? 'Pago' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>{user.totalPoints}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
