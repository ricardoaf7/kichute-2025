
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (nome: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user data from jogadores table
          const { data: jogador, error } = await supabase
            .from('jogadores')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          setUser(jogador);
          setIsAdmin(jogador.tipo === 'Administrador');
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Fetch user data when session changes
          const { data: jogador, error } = await supabase
            .from('jogadores')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (!error && jogador) {
            setUser(jogador);
            setIsAdmin(jogador.tipo === 'Administrador');
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (nome: string, senha: string) => {
    try {
      setIsLoading(true);
      
      // Find the user by nome in the jogadores table
      const { data: jogador, error: fetchError } = await supabase
        .from('jogadores')
        .select('*')
        .eq('nome', nome)
        .single();
      
      if (fetchError || !jogador) {
        throw new Error("Usuário não encontrado");
      }
      
      // Check if password matches
      if (jogador.senha !== senha) {
        throw new Error("Senha incorreta");
      }
      
      // Sign in with supabase auth using the jogador's id
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${jogador.id}@kichute.app`, // Using a deterministic email based on ID
        password: senha
      });
      
      if (signInError) {
        // If user doesn't exist in auth, create an account
        if (signInError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: `${jogador.id}@kichute.app`,
            password: senha,
            options: {
              data: {
                nome: jogador.nome
              }
            }
          });
          
          if (signUpError) throw signUpError;
          
          // Try login again after signup
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: `${jogador.id}@kichute.app`,
            password: senha
          });
          
          if (retryError) throw retryError;
        } else {
          throw signInError;
        }
      }
      
      setUser(jogador);
      setIsAdmin(jogador.tipo === 'Administrador');
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${jogador.nome}!`,
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAdmin(false);
      navigate('/login');
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você saiu da sua conta",
      });
    } catch (error: any) {
      console.error("Erro no logout:", error);
      toast({
        title: "Erro no logout",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
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
