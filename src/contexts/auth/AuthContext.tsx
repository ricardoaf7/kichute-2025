
import React, { createContext } from "react";
import { AuthContextType } from "./types";
import { mockAuthData } from "./mockData";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={mockAuthData}>
      {children}
    </AuthContext.Provider>
  );
};

