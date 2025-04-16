
import React, { createContext, useContext } from "react";

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  login: (nome: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Temporary mock admin user
  const mockUser = {
    id: "temp-admin",
    nome: "Administrador Temporário",
    tipo: "Administrador"
  };

  const mockAuthContext: AuthContextType = {
    user: mockUser,
    isAdmin: true,
    isLoading: false,
    login: async () => {
      console.log("Login temporariamente desativado");
    },
    logout: async () => {
      console.log("Logout temporariamente desativado");
    }
  };

  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
