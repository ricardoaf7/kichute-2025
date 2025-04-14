
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import AppLogo from "@/components/AppLogo";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || "/";

  // If already logged in, redirect
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !senha) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(nome, senha);
      // Navigate happens in the login function
    } catch (error) {
      console.error("Erro no formulário de login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <AppLogo />
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Insira suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome de usuário</Label>
              <Input
                id="nome"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="text-sm text-green-700 hover:text-green-800 hover:underline"
                onClick={() => setShowRecoveryInfo(!showRecoveryInfo)}
              >
                Esqueceu sua senha?
              </button>
              
              {showRecoveryInfo && (
                <Alert className="mt-2 bg-gray-100 dark:bg-gray-800">
                  <AlertDescription>
                    Caso esqueça sua senha, fale com o organizador para redefinição.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-700 hover:bg-green-800" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center justify-center text-sm text-muted-foreground">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/register")}
          >
            Registrar-se
          </Button>
          <p>Participe do Kichute na temporada 2025</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
