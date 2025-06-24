import React from "react";
import StatCards from "../components/StatCards"
import BurnRateChart from "../components/BurnRateChart"
import RecentActivity from "../components/RecentActivity"
import TopClients from "../components/TopClients"
import DashboardHeader from "../components/DashboardHeader"
import { useInvoices } from "../../invoices/hooks/useInvoices";
import { useClients } from "../../clients/hooks/useClients";
import { parseISO, format, min, max, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const DashboardView = () => {
  const { data: invoices = [] } = useInvoices();
  const { data: clients = [] } = useClients();

  // Find the date range from actual invoices
  const invoiceDates = invoices.map(inv => parseISO(inv.dateIssued));
  const earliestDate = invoiceDates.length > 0 ? min(invoiceDates) : new Date();
  const latestDate = invoiceDates.length > 0 ? max(invoiceDates) : new Date();

  // Calculate total revenue
  const totalRevenueNumber = invoices.reduce((acc, inv) => acc + (inv.totalInclTax ?? 0), 0);
  const totalRevenueFormatted = totalRevenueNumber.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  // Get current month's revenue (using the latest invoice's month as current)
  const currentMonth = format(latestDate, 'yyyy-MM');
  const currentMonthInvoices = invoices.filter(inv => format(parseISO(inv.dateIssued), 'yyyy-MM') === currentMonth);
  const currentMonthRevenueNumber = currentMonthInvoices.reduce((acc, inv) => acc + (inv.totalInclTax ?? 0), 0);
  const currentMonthRevenueFormatted = currentMonthRevenueNumber.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  // Get previous month's revenue
  const previousMonth = format(subMonths(latestDate, 1), 'yyyy-MM');
  const previousMonthInvoices = invoices.filter(inv => format(parseISO(inv.dateIssued), 'yyyy-MM') === previousMonth);
  const previousMonthRevenueNumber = previousMonthInvoices.reduce((acc, inv) => acc + (inv.totalInclTax ?? 0), 0);

  // Calculate trends
  const calcTrend = (curr: number, prev: number) => {
    if (prev === 0) {
      if (curr === 0) return '0%';
      return '+100%';
    }
    const diff = ((curr - prev) / prev) * 100;
    const sign = diff >= 0 ? '+' : '-';
    return `${sign}${Math.abs(diff).toFixed(1)}%`;
  };

  // Invoice counts
  const totalInvoicesCount = invoices.length;
  const currentMonthInvoicesCount = currentMonthInvoices.length;
  const previousMonthInvoicesCount = previousMonthInvoices.length;

  // Calculate trends
  const invoicesTrendStr = calcTrend(currentMonthInvoicesCount, previousMonthInvoicesCount);
  const revenueTrendStr = calcTrend(currentMonthRevenueNumber, previousMonthRevenueNumber);

  // Client stats
  const totalClientsCount = clients.length;
  const activeClients = clients.filter(client => client.status === 'Active');
  const totalClientsTrend = calcTrend(totalClientsCount, Math.max(0, totalClientsCount - 1));
  const activeClientsTrend = calcTrend(activeClients.length, Math.max(0, activeClients.length - 1));

  return (
    <div className="">
      {/* Header */}
      <DashboardHeader />

      <div className="space-y-4 py-4 px-8">
        {/* Charts Section */}
        <div className="grid gap-4">
          <BurnRateChart />
        </div>

        {/* Stats Cards */}
        <StatCards
          totalInvoices={totalInvoicesCount}
          totalInvoicesTrend={invoicesTrendStr}
          newInvoicesThisMonth={currentMonthInvoicesCount}
          revenue={totalRevenueFormatted}
          revenueTrend={revenueTrendStr}
          newRevenueThisMonth={currentMonthRevenueFormatted}
          totalClients={totalClientsCount}
          totalClientsTrend={totalClientsTrend}
          activeAccounts={activeClients.length}
          activeAccountsTrend={activeClientsTrend}
        />

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <RecentActivity />
          <TopClients />
        </div>
      </div>
    </div>
  );
};

export default DashboardView; 