
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
import { mockUsers } from "@/utils/mockData";

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const { toast } = useToast();

  const handleAddUser = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de novos usuários será implementada em breve."
    });
  };

  const handleEditUser = (userId: number) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: `Edição do usuário ID ${userId} será implementada em breve.`
    });
  };

  const handleDeleteUser = (userId: number) => {
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
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50 font-medium">
                    <th className="py-3 px-4 text-left">Nome</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.active ? 'Ativo' : 'Pendente'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
