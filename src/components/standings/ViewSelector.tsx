
import React from "react";
import { Button } from "@/components/ui/button";
import { TableProperties, LineChart } from "lucide-react";

interface ViewSelectorProps {
  viewMode: "table" | "dynamic";
  setViewMode: (mode: "table" | "dynamic") => void;
  setUseDynamicTable: (value: boolean) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ viewMode, setViewMode, setUseDynamicTable }) => {
  const handleModeChange = (mode: "table" | "dynamic") => {
    setViewMode(mode);
    setUseDynamicTable(mode === "dynamic");
  };

  return (
    <div className="flex space-x-2 border border-border/60 rounded-md p-0.5 bg-background">
      <Button
        variant="ghost"
        size="sm"
        className={`${
          viewMode === "dynamic"
            ? "bg-muted/80 text-primary-foreground"
            : "hover:bg-muted/40"
        }`}
        onClick={() => handleModeChange("dynamic")}
      >
        <LineChart className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Tabela Detalhada</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`${
          viewMode === "table"
            ? "bg-muted/80 text-primary-foreground"
            : "hover:bg-muted/40"
        }`}
        onClick={() => handleModeChange("table")}
      >
        <TableProperties className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Tabela Resumida</span>
      </Button>
    </div>
  );
};

export default ViewSelector;
