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
  invoicesPercentage?: string
  revenue?: string
  revenueTrend?: string
  newRevenueThisMonth?: string
  revenuePercentage?: string
  totalClients?: number
  totalClientsTrend?: string
  activeAccounts?: string | number
  activeAccountsTrend?: string
}

const StatCards: React.FC<StatCardsProps> = ({
  totalInvoices = 156,
  totalInvoicesTrend = "+0%",
  newInvoicesThisMonth = 0,
  invoicesPercentage = "+0%",
  revenue = "€0",
  revenueTrend = "+0%",
  newRevenueThisMonth = "€0",
  revenuePercentage = "+0%",
  totalClients = 0,
  totalClientsTrend = "+0%",
  activeAccounts = 45678,
  activeAccountsTrend = "+12.5%",
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* Total Factures */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Total Factures</StatCardTitle>
        <StatCardBadge trend="up">{totalInvoicesTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{totalInvoices}</StatCardValue>
      <StatCardDescription>
        ce mois-ci 
      </StatCardDescription>
    </StatCard>

    {/* Chiffre d'Affaires */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Chiffre d'Affaires</StatCardTitle>
        <StatCardBadge trend="up">{revenueTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{revenue}</StatCardValue>
      <StatCardDescription>
        cette année
      </StatCardDescription>
    </StatCard>

    {/* Total Clients */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Total Clients</StatCardTitle>
        <StatCardBadge trend="up">{totalClientsTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{totalClients}</StatCardValue>
      <StatCardDescription>Clients actifs</StatCardDescription>
    </StatCard>

    {/* Comptes Actifs */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Comptes Actifs</StatCardTitle>
        <StatCardBadge trend="up">{activeAccountsTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{activeAccounts}</StatCardValue>
      <StatCardDescription>Forte rétention clients</StatCardDescription>
    </StatCard>
  </div>
)

export default StatCards 