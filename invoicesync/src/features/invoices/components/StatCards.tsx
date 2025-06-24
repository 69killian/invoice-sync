import * as React from "react"
import {
  StatCard,
  StatCardHeader,
  StatCardTitle,
  StatCardBadge,
  StatCardValue,
  StatCardDescription,
} from "../../../components/ui/stat-card"

interface StatCardsProps {
  totalInvoices?: string | number
  totalInvoicesTrend?: string
  newInvoicesThisMonth?: string | number
  revenue?: string
  revenueTrend?: string
  newRevenueThisMonth?: string
}

const StatCards: React.FC<StatCardsProps> = ({
  totalInvoices = 156,
  totalInvoicesTrend = "+0%",
  newInvoicesThisMonth = 0,
  revenue = "€0",
  revenueTrend = "+0%",
  newRevenueThisMonth = "€0",
}) => (
  <div className="px-8 mb-6">
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard>
        <StatCardHeader>
          <StatCardTitle>Total Factures</StatCardTitle>
          <StatCardBadge trend="up">{totalInvoicesTrend}</StatCardBadge>
        </StatCardHeader>
        <StatCardValue>{totalInvoices}</StatCardValue>
        <StatCardDescription>+{newInvoicesThisMonth} ce mois-ci</StatCardDescription>
      </StatCard>

      <StatCard>
        <StatCardHeader>
          <StatCardTitle>Chiffre d'Affaires</StatCardTitle>
          <StatCardBadge trend="up">{revenueTrend}</StatCardBadge>
        </StatCardHeader>
        <StatCardValue>{revenue}</StatCardValue>
        <StatCardDescription>+{newRevenueThisMonth} ce mois-ci</StatCardDescription>
      </StatCard>
    </div>
  </div>
)

export default StatCards 