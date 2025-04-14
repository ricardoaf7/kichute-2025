
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RegistrationForm } from "@/components/auth/RegistrationForm";
import AppLogo from "@/components/AppLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <AppLogo />
          </div>
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Cadastre-se para participar do Kichute 2025
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-green-700 hover:text-green-800 hover:underline"
          >
            Já tem uma conta? Faça login
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
