import * as React from "react"
import { Trash2 } from "lucide-react"
import { cn } from "../../../lib/utils"

type SettingsHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  onDeleteClick: () => void
}

const SettingsHeader = React.forwardRef<HTMLDivElement, SettingsHeaderProps>(({ className, onDeleteClick, ...props }, ref) => (
  <div ref={ref} className={cn("px-8", className)} {...props}>
    <div className="flex items-center justify-between px-8">
      <p className="font-normal text-sm py-3" style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
        Profil utilisateur
      </p>
      <button
        onClick={onDeleteClick}
        className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground cursor-pointer bg-card hover:bg-muted hover:text-foreground transition-colors"
        style={{ border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none', color: '#ef4444' }}
      >
        <Trash2 size={14} />
        Supprimer le compte
      </button>
    </div>
    <div className="border-b border-gray-700 mb-4"></div>
  </div>
))
SettingsHeader.displayName = "SettingsHeader"

export default SettingsHeader 