
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUsersHeaderProps {
  onNewUser: () => void;
}

export const AdminUsersHeader = ({ onNewUser }: AdminUsersHeaderProps) => {
  return (
    <div className="text-center mb-8 animate-slide-down">
      <h1 className="text-3xl font-bold">Gerenciar Participantes</h1>
      <p className="text-muted-foreground mt-2">
        Adicione, edite e remova participantes do Brasileirão 2025
      </p>
    </div>
  );
};
