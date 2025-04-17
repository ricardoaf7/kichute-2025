
import { RotateCw } from "lucide-react";

export const LoadingMatches = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <RotateCw className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Carregando partidas...</span>
    </div>
  );
};
