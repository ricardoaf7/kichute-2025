
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children
}) => {
  // Temporarily allow all access
  return <>{children}</>;
};

export default ProtectedRoute;
