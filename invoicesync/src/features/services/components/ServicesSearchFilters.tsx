import * as React from "react"
import { cn } from "../../../lib/utils"

const ServicesSearchFilters: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("px-8 mb-4", className)} {...props}>
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Recherche nom..."
        className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground w-64"
      />
      <select className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground">
        <option>Filtrer</option>
        <option>Nom</option>
        <option>Récurrence</option>
      </select>
    </div>
  </div>
)

export default ServicesSearchFilters 