import * as React from "react"
import { X, Trash2 } from "lucide-react"
import { cn } from "../../lib/utils"

const DeleteModal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "fixed inset-0 flex items-center justify-center fadeInBlur",
      className
    )}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10002,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    {...props}
  />
))
DeleteModal.displayName = "DeleteModal"

const DeleteModalOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur",
      className
    )}
    style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 10001,
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      transition: 'backdrop-filter 0.3s ease-out, opacity 0.3s ease-out'
    }}
    {...props}
  />
))
DeleteModalOverlay.displayName = "DeleteModalOverlay"

const DeleteModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "w-96 bg-card border border-border shadow-xl rounded-none",
      className
    )}
    onClick={(e) => e.stopPropagation()}
    {...props}
  />
))
DeleteModalContent.displayName = "DeleteModalContent"

const DeleteModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "p-6 border-b border-border",
      className
    )}
    {...props}
  />
))
DeleteModalHeader.displayName = "DeleteModalHeader"

const DeleteModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 
    ref={ref}
    className={cn(
      "text-lg font-medium",
      className
    )}
    style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}
    {...props}
  />
))
DeleteModalTitle.displayName = "DeleteModalTitle"

const DeleteModalCloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button 
    ref={ref}
    className={cn(
      "text-muted-foreground hover:text-foreground",
      className
    )}
    {...props}
  >
    <X size={16} />
  </button>
))
DeleteModalCloseButton.displayName = "DeleteModalCloseButton"

const DeleteModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "p-6 space-y-4",
      className
    )}
    {...props}
  />
))
DeleteModalBody.displayName = "DeleteModalBody"

const DeleteModalIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "w-12 h-12 bg-red-100 rounded-none flex items-center justify-center",
      className
    )}
    {...props}
  >
    <Trash2 size={24} className="text-red-600" />
  </div>
))
DeleteModalIcon.displayName = "DeleteModalIcon"

const DeleteModalDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "bg-muted/20 p-4 rounded-none",
      className
    )}
    {...props}
  />
))
DeleteModalDescription.displayName = "DeleteModalDescription"

const DeleteModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "flex gap-3 pt-4",
      className
    )}
    {...props}
  />
))
DeleteModalFooter.displayName = "DeleteModalFooter"

const DeleteModalCancelButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button 
    ref={ref}
    className={cn(
      "flex-1 px-4 py-2 text-xs rounded-none transition-colors border",
      className
    )}
    style={{
      backgroundColor: 'transparent',
      color: 'white',
      fontFamily: 'Bricolage Grotesque, sans-serif',
      border: '1px solid #374151'
    }}
    {...props}
  />
))
DeleteModalCancelButton.displayName = "DeleteModalCancelButton"

const DeleteModalConfirmButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button 
    ref={ref}
    className={cn(
      "flex-1 px-4 py-2 text-xs rounded-none transition-colors border",
      className
    )}
    style={{
      backgroundColor: '#ef4444',
      color: 'white',
      fontFamily: 'Bricolage Grotesque, sans-serif',
      border: '1px solid #ef4444'
    }}
    {...props}
  />
))
DeleteModalConfirmButton.displayName = "DeleteModalConfirmButton"

export {
  DeleteModal,
  DeleteModalOverlay,
  DeleteModalContent,
  DeleteModalHeader,
  DeleteModalTitle,
  DeleteModalCloseButton,
  DeleteModalBody,
  DeleteModalIcon,
  DeleteModalDescription,
  DeleteModalFooter,
  DeleteModalCancelButton,
  DeleteModalConfirmButton,
} 