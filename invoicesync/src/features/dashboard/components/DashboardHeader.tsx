import * as React from "react"
import { cn } from "../../../lib/utils"

const DashboardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("py-2 px-8", className)} {...props}>
    <p
      className="font-normal text-sm py-1 mb-2 px-6"
      style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}
    >
      Dashboard
    </p>
    <div className="border-b border-gray-700 mb-2"></div>
  </div>
)

export default DashboardHeader 