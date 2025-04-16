
export interface AuthContextType {
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  login: (nome: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

