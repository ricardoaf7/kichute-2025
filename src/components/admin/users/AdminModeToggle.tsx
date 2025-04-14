
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck, Lock } from "lucide-react";

interface AdminModeToggleProps {
  isAdminMode: boolean;
  onToggle: (value: boolean) => void;
}

export function AdminModeToggle({ isAdminMode, onToggle }: AdminModeToggleProps) {
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={isAdminMode ? "default" : "outline"} 
              onClick={() => onToggle(true)}
              className="mr-2"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modo Administrador</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={!isAdminMode ? "default" : "outline"} 
              onClick={() => onToggle(false)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Participante
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modo Participante</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
