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
  totalRevenue?: string
  totalRevenueTrend?: string
  newCustomers?: string | number
  newCustomersTrend?: string
  activeAccounts?: string | number
  activeAccountsTrend?: string
  totalInvoices?: string | number
  totalInvoicesTrend?: string
}

const StatCards: React.FC<StatCardsProps> = ({
  totalRevenue = "$15,231.89",
  totalRevenueTrend = "+12.5%",
  newCustomers = 1234,
  newCustomersTrend = "-20%",
  activeAccounts = 45678,
  activeAccountsTrend = "+12.5%",
  totalInvoices = "4.5%",
  totalInvoicesTrend = "+4.5%",
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* Total Revenue */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Total Revenue</StatCardTitle>
        <StatCardBadge trend="up">{totalRevenueTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{totalRevenue}</StatCardValue>
      <StatCardDescription>+20.1% from last month</StatCardDescription>
    </StatCard>

    {/* New Customers */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>New Customers</StatCardTitle>
        <StatCardBadge trend="down">{newCustomersTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{newCustomers}</StatCardValue>
      <StatCardDescription>Down 20% this period</StatCardDescription>
    </StatCard>

    {/* Active Accounts */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Active Accounts</StatCardTitle>
        <StatCardBadge trend="up">{activeAccountsTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{activeAccounts}</StatCardValue>
      <StatCardDescription>Strong user retention</StatCardDescription>
    </StatCard>

    {/* Total Invoices */}
    <StatCard>
      <StatCardHeader>
        <StatCardTitle>Total Invoices</StatCardTitle>
        <StatCardBadge trend="up">{totalInvoicesTrend}</StatCardBadge>
      </StatCardHeader>
      <StatCardValue>{totalInvoices}</StatCardValue>
      <StatCardDescription>Steady performance</StatCardDescription>
    </StatCard>
  </div>
)

export default StatCards 