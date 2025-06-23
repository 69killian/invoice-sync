import * as React from "react"
import { cn } from "../../../lib/utils"

const InvoicesSearchFilters: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("px-8 mb-4", className)} {...props}>
    <div className="flex gap-4">
      <select className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground">
        <option>Statut</option>
        <option>Payé</option>
        <option>En attente</option>
      </select>
      <input type="date" className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground" />
      <input
        type="text"
        placeholder="Client..."
        className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground w-64"
      />
    </div>
  </div>
)

export default InvoicesSearchFilters 