import * as React from "react"
import { cn } from "../../lib/utils"

const StatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 rounded-none border bg-background text-card-foreground space-y-3",
      className
    )}
    {...props}
  />
))
StatCard.displayName = "StatCard"

const StatCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-row items-center justify-between",
      className
    )}
    {...props}
  />
))
StatCardHeader.displayName = "StatCardHeader"

const StatCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm font-normal text-muted-foreground",
      className
    )}
    {...props}
  />
))
StatCardTitle.displayName = "StatCardTitle"

const StatCardBadge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    trend: "up" | "down"
  }
>(({ className, trend, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xs font-normal border border-gray-700 px-2",
      trend === "up" ? "text-chart-1" : "text-destructive",
      className
    )}
    style={{ color: trend === "up" ? '#10b981' : '#ef4444' }}
    {...props}
  />
))
StatCardBadge.displayName = "StatCardBadge"

const StatCardValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-light",
      className
    )}
    style={{ color: 'white' }}
    {...props}
  />
))
StatCardValue.displayName = "StatCardValue"

const StatCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
))
StatCardDescription.displayName = "StatCardDescription"

export {
  StatCard,
  StatCardHeader,
  StatCardTitle,
  StatCardBadge,
  StatCardValue,
  StatCardDescription,
} 