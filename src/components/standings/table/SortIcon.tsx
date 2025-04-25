
import { ChevronDown, ChevronUp } from "lucide-react";
import { SortDirection, SortField } from "@/hooks/standings/useDynamicTableSort";

interface SortIconProps {
  field: SortField;
  currentSortField: SortField;
  sortDirection: SortDirection;
}

export const SortIcon = ({ field, currentSortField, sortDirection }: SortIconProps) => (
  <span className="inline-flex ml-1 text-muted-foreground">
    {currentSortField === field ? (
      sortDirection === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )
    ) : (
      <ChevronDown className="h-4 w-4 opacity-30" />
    )}
  </span>
);
