
import { RotateCw } from "lucide-react";

export const TableLoading = () => (
  <div className="flex justify-center items-center p-8">
    <RotateCw className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2">Carregando dados...</span>
  </div>
);
