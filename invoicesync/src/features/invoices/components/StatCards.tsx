import * as React from "react"
import {
  StatCard,
  StatCardHeader,
  StatCardTitle,
  StatCardBadge,
  StatCardValue,
  StatCardDescription,
} from "../../../components/ui/stat-card"
import { useRevenueStats } from "../../dashboard/hooks/useRevenueStats"
import { useInvoices } from "../hooks/useInvoices"
import type { Invoice } from "../types"

const StatCards: React.FC = () => {
  const { currentMonthRevenue, revenueTrend } = useRevenueStats()
  const { data: invoices } = useInvoices()

  // Calculate invoice stats
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const totalInvoices = invoices?.length || 0
  const newInvoicesThisMonth = invoices?.filter(invoice => {
    const invoiceDate = new Date(invoice.dateIssued)
    return invoiceDate.getMonth() === currentMonth && 
           invoiceDate.getFullYear() === currentYear
  }).length || 0

  // Calculate invoice trend (comparing with previous month)
  const lastMonthInvoices = invoices?.filter(invoice => {
    const invoiceDate = new Date(invoice.dateIssued)
    const isLastMonth = invoiceDate.getMonth() === (currentMonth - 1 < 0 ? 11 : currentMonth - 1) &&
                       (currentMonth === 0 ? invoiceDate.getFullYear() === currentYear - 1 : invoiceDate.getFullYear() === currentYear)
    return isLastMonth
  }).length || 0

  const invoiceTrendValue = lastMonthInvoices === 0 
    ? 100 
    : Math.round((newInvoicesThisMonth - lastMonthInvoices) / lastMonthInvoices * 100)
  
  const invoiceTrend = `${invoiceTrendValue >= 0 ? '+' : ''}${invoiceTrendValue}%`

  // Format currency
  const formatAmount = (amount: number) => 
    amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  // Format revenue trend
  const formattedRevenueTrend = `${revenueTrend >= 0 ? '+' : ''}${revenueTrend}%`

  return (
    <div className="px-8 mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard>
          <StatCardHeader>
            <StatCardTitle>Total Factures</StatCardTitle>
            <StatCardBadge trend={invoiceTrendValue >= 0 ? 'up' : 'down'}>
              {invoiceTrend}
            </StatCardBadge>
          </StatCardHeader>
          <StatCardValue>{totalInvoices}</StatCardValue>
          <StatCardDescription>+{newInvoicesThisMonth} ce mois-ci</StatCardDescription>
        </StatCard>

        <StatCard>
          <StatCardHeader>
            <StatCardTitle>Chiffre d'Affaires</StatCardTitle>
            <StatCardBadge trend={revenueTrend >= 0 ? 'up' : 'down'}>
              {formattedRevenueTrend}
            </StatCardBadge>
          </StatCardHeader>
          <StatCardValue>{formatAmount(currentMonthRevenue)}</StatCardValue>
          <StatCardDescription>
            +{formatAmount(currentMonthRevenue)} ce mois-ci
          </StatCardDescription>
        </StatCard>
      </div>
    </div>
  )
}

export default StatCards 