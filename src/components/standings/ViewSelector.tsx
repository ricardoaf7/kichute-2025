
import React from "react";

interface ViewSelectorProps {
  viewMode: "table" | "cards" | "dynamic";
  setViewMode: (mode: "table" | "cards" | "dynamic") => void;
  setUseDynamicTable: (value: boolean) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  setViewMode,
  setUseDynamicTable,
}) => {
  return (
    <div className="flex rounded-md overflow-hidden border border-border">
      <button
        onClick={() => { setViewMode("dynamic"); setUseDynamicTable(true); }}
        className={`px-3 py-1.5 text-sm ${
          viewMode === "dynamic"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-muted/50"
        }`}
      >
        Supabase
      </button>
      <button
        onClick={() => { setViewMode("table"); setUseDynamicTable(false); }}
        className={`px-3 py-1.5 text-sm ${
          viewMode === "table"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-muted/50"
        }`}
      >
        Tabela
      </button>
      <button
        onClick={() => { setViewMode("cards"); setUseDynamicTable(false); }}
        className={`px-3 py-1.5 text-sm ${
          viewMode === "cards"
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-muted/50"
        }`}
      >
        Cards
      </button>
    </div>
  );
};

export default ViewSelector;
