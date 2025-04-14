
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Use useEffect to show toast notification
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Acesso restrito",
          description: "Você precisa estar logado para acessar esta página",
          variant: "destructive",
        });
        setShouldRedirect(true);
      } else if (adminOnly && !isAdmin) {
        toast({
          title: "Acesso negado",
          description: "Apenas administradores podem acessar esta página",
          variant: "destructive",
        });
        setShouldRedirect(true);
      }
    }
  }, [user, isAdmin, isLoading, adminOnly, toast]);

  // While authentication is being checked, show loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!user && shouldRedirect) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && !isAdmin && shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and has required role, show the page
  return <>{children}</>;
};

export default ProtectedRoute;
