import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../lib/utils"

type InvoicesHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  onCreateClick: () => void
}

const InvoicesHeader = React.forwardRef<HTMLDivElement, InvoicesHeaderProps>(({ onCreateClick, className, ...props }, ref) => (
  <div ref={ref} className={cn("px-8", className)} {...props}>
    <div className="flex items-center justify-between px-8">
      <p className="font-normal text-sm py-3" style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
        Factures
      </p>
      <button
        onClick={onCreateClick}
        className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors"
        style={{ border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none' }}
      >
        <Plus size={14} />
        Nouvelle facture
      </button>
    </div>
    <div className="border-b border-gray-700 mb-4"></div>
  </div>
))
InvoicesHeader.displayName = "InvoicesHeader"

export default InvoicesHeader 