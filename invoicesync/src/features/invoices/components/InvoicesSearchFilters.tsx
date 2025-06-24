import * as React from "react"
import { cn } from "../../../lib/utils"

interface InvoicesSearchFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  searchTerm: string;
  statusFilter: string;
  onSearchTermChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
}

const InvoicesSearchFilters: React.FC<InvoicesSearchFiltersProps> = ({
  className,
  searchTerm,
  statusFilter,
  onSearchTermChange,
  onStatusFilterChange,
  ...props
}) => (
  <div className={cn('px-8 mb-4', className)} {...props}>
    <div className="flex gap-4">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground"
      >
        <option value="">Tous statuts</option>
        <option value="paid">Payé</option>
        <option value="unpaid">En attente</option>
      </select>
      <input
        type="text"
        placeholder="Rechercher client..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground w-64"
      />
    </div>
  </div>
)

export default InvoicesSearchFilters 