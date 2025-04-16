
import { AlertTriangle } from "lucide-react";

const AuthStatus = () => {
  return (
    <div className="flex items-center gap-2 text-yellow-600">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm">Autenticação temporariamente desativada</span>
    </div>
  );
};

export default AuthStatus;
