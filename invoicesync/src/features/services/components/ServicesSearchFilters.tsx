import * as React from "react"
import { cn } from "../../../lib/utils"

interface ServicesSearchFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  searchTerm: string;
  recurrenceFilter: string;
  onSearchTermChange: (val: string) => void;
  onRecurrenceFilterChange: (val: string) => void;
}

const ServicesSearchFilters: React.FC<ServicesSearchFiltersProps> = ({
  className,
  searchTerm,
  recurrenceFilter,
  onSearchTermChange,
  onRecurrenceFilterChange,
  ...props
}) => (
  <div className={cn("px-8 mb-4", className)} {...props}>
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Recherche nom..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground w-64"
      />
      <select
        value={recurrenceFilter}
        onChange={(e) => onRecurrenceFilterChange(e.target.value)}
        className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground"
      >
        <option value="">Toutes récurrences</option>
        <option value="Ponctuel">Ponctuel</option>
        <option value="Mensuel">Mensuel</option>
        <option value="Annuel">Annuel</option>
      </select>
    </div>
  </div>
)

export default ServicesSearchFilters 