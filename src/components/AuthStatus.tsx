
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const AuthStatus = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:flex items-center gap-2 text-sm">
        <User className="h-4 w-4" />
        <span className="font-medium">{user.nome}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={logout}
        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </div>
  );
};

export default AuthStatus;
