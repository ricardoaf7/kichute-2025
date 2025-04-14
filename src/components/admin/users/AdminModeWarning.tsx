
import { AlertTriangle } from "lucide-react";

export const AdminModeWarning = () => {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800 dark:text-amber-300">Modo Participante</h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            Você está no modo participante. Algumas ações estão restritas apenas para administradores.
          </p>
        </div>
      </div>
    </div>
  );
};
