import * as React from "react"
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"
import { cn } from "../../lib/utils"

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center justify-between px-2 text-sm text-foreground bg-background ${className || ''}`}
    style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
    {...props}
  />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-6", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
))
PaginationItem.displayName = "PaginationItem"

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean
  }
>(({ className, isDisabled, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center",
      className
    )}
    disabled={isDisabled}
    {...props}
  >
    <ChevronLeft size={14} />
  </button>
))
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean
  }
>(({ className, isDisabled, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center",
      className
    )}
    disabled={isDisabled}
    {...props}
  >
    <ChevronRight size={14} />
  </button>
))
PaginationNext.displayName = "PaginationNext"

const PaginationFirst = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean
  }
>(({ className, isDisabled, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center",
      className
    )}
    disabled={isDisabled}
    {...props}
  >
    <ChevronsLeft size={14} />
  </button>
))
PaginationFirst.displayName = "PaginationFirst"

const PaginationLast = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean
  }
>(({ className, isDisabled, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center",
      className
    )}
    disabled={isDisabled}
    {...props}
  >
    <ChevronsRight size={14} />
  </button>
))
PaginationLast.displayName = "PaginationLast"

const PaginationRowsPerPage = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    options?: number[]
  }
>(({ className, options = [10, 20, 50], ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "bg-muted/5 hover:bg-muted border border-border font-thin rounded-none px-3 py-1 text-foreground min-w-16",
      className
    )}
    {...props}
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
))
PaginationRowsPerPage.displayName = "PaginationRowsPerPage"

const PaginationText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("font-['Bricolage_Grotesque,_sans-serif']", className)}
    {...props}
  />
))
PaginationText.displayName = "PaginationText"

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationRowsPerPage,
  PaginationText,
} 