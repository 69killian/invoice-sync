import * as React from "react"
import { cn } from "../../lib/utils"

const TopClientsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 rounded-none border bg-background text-card-foreground space-y-6", className)}
    {...props}
  />
))
TopClientsCard.displayName = "TopClientsCard"

const TopClientsCardHeader = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-medium", className)}
    style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}
    {...props}
  />
))
TopClientsCardHeader.displayName = "TopClientsCardHeader"

interface TopClientItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colorClass?: string
  initials: string
  name: string
  email: string
  revenue: string
}

const TopClientItem = React.forwardRef<HTMLDivElement, TopClientItemProps>(({ colorClass = "bg-chart-1", initials, name, email, revenue, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-between", className)} {...props}>
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-none flex items-center justify-center", colorClass)}>
        <span className="text-xs font-medium text-white">{initials}</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-normal" style={{ color: 'white' }}>{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
    <span className="text-sm font-normal" style={{ color: 'white' }}>{revenue}</span>
  </div>
))
TopClientItem.displayName = "TopClientItem"

export { TopClientsCard, TopClientsCardHeader, TopClientItem } 