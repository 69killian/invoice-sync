import * as React from "react"
import { cn } from "../../lib/utils"

const RecentActivityCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 rounded-none border bg-background text-card-foreground space-y-6", className)}
    {...props}
  />
))
RecentActivityCard.displayName = "RecentActivityCard"

const RecentActivityCardHeader = React.forwardRef<
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
RecentActivityCardHeader.displayName = "RecentActivityCardHeader"

interface RecentActivityItemProps extends React.HTMLAttributes<HTMLDivElement> {
  bulletClass?: string
  title: string
  description: string
  time: string
}

const RecentActivityItem = React.forwardRef<HTMLDivElement, RecentActivityItemProps>(({ bulletClass = "bg-chart-1", title, description, time, className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-start gap-3", className)} {...props}>
    <div className={cn("w-2 h-2 rounded-full mt-2", bulletClass)}></div>
    <div className="flex-1 space-y-1">
      <p className="text-sm font-normal" style={{ color: 'white' }}>{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <span className="text-xs text-muted-foreground">{time}</span>
  </div>
))
RecentActivityItem.displayName = "RecentActivityItem"

export { RecentActivityCard, RecentActivityCardHeader, RecentActivityItem } 