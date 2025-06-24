import { useInvoices } from '../../invoices/hooks/useInvoices';
import { addMonths, subMonths, startOfMonth, endOfMonth, parseISO, format, min, max } from 'date-fns';

interface RevenuePoint {
  x: number;
  y: number;
  date: Date;
  amount: number;
}

export const useRevenueStats = (monthsToShow: number = 12) => {
  const { data: invoices = [] } = useInvoices();
  
  // Calculate revenue points
  const points: RevenuePoint[] = [];
  
  // Find the date range from actual invoices
  const invoiceDates = invoices.map(inv => parseISO(inv.dateIssued));
  const earliestDate = invoiceDates.length > 0 ? min(invoiceDates) : new Date();
  const latestDate = invoiceDates.length > 0 ? max(invoiceDates) : new Date();
  
  // Ensure we start from the first day of the earliest invoice month
  const startDate = startOfMonth(earliestDate);
  
  // Calculate how many months we need to show
  const monthsNeeded = Math.ceil(
    (latestDate.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
  ) + 1; // Add 1 to include both start and end months
  
  console.log('Date range:', {
    earliest: format(earliestDate, 'yyyy-MM-dd'),
    latest: format(latestDate, 'yyyy-MM-dd'),
    monthsNeeded
  });
  
  // Initialize points array with the correct number of months
  for (let i = 0; i < monthsNeeded; i++) {
    const date = addMonths(startDate, i);
    points.push({
      x: i * (100 / (monthsNeeded - 1)), // Spread points evenly across 0-100
      y: 0,
      date,
      amount: 0
    });
  }
  
  // Calculate revenue for each month
  invoices.forEach(invoice => {
    const invoiceDate = parseISO(invoice.dateIssued);
    
    console.log('Processing invoice:', {
      date: format(invoiceDate, 'yyyy-MM-dd'),
      amount: invoice.totalInclTax,
      number: invoice.invoiceNumber
    });
    
    // Find the point for this invoice's month
    const pointIndex = points.findIndex(point => {
      const start = startOfMonth(point.date);
      const end = endOfMonth(point.date);
      const isInRange = invoiceDate >= start && invoiceDate <= end;
      
      if (isInRange) {
        console.log('Found matching point:', {
          invoiceDate: format(invoiceDate, 'yyyy-MM'),
          pointDate: format(point.date, 'yyyy-MM'),
          amount: invoice.totalInclTax
        });
      }
      
      return isInRange;
    });
    
    if (pointIndex !== -1 && invoice.totalInclTax) {
      points[pointIndex].amount += invoice.totalInclTax;
    }
  });
  
  // Calculate y values as percentage of max revenue
  const maxRevenue = Math.max(...points.map(p => p.amount), 1);
  points.forEach(point => {
    point.y = (point.amount / maxRevenue) * 90;
  });
  
  // Calculate total and monthly stats
  const totalRevenue = points.reduce((acc, point) => acc + point.amount, 0);
  
  // Get current month's revenue (using the latest invoice's month as current)
  const currentMonth = format(latestDate, 'yyyy-MM');
  const currentMonthPoint = points.find(point => format(point.date, 'yyyy-MM') === currentMonth);
  const currentMonthRevenue = currentMonthPoint?.amount || 0;
  
  // Get previous month's revenue
  const previousMonth = format(subMonths(latestDate, 1), 'yyyy-MM');
  const previousMonthPoint = points.find(point => format(point.date, 'yyyy-MM') === previousMonth);
  const previousMonthRevenue = previousMonthPoint?.amount || 0;
  
  console.log('Month comparison:', {
    currentMonth,
    currentMonthRevenue,
    previousMonth,
    previousMonthRevenue,
    points: points.map(p => ({
      month: format(p.date, 'yyyy-MM'),
      amount: p.amount
    }))
  });
  
  const revenueTrend = previousMonthRevenue === 0 
    ? (currentMonthRevenue === 0 ? 0 : 100)
    : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    
  // Calculate runway in months based on average monthly expenses
  const averageMonthlyRevenue = totalRevenue / monthsNeeded;
  const lastThreeMonthsAverage = points.slice(-3).reduce((acc, point) => acc + point.amount, 0) / 3;
  const runway = averageMonthlyRevenue > 0 
    ? Math.round(lastThreeMonthsAverage / averageMonthlyRevenue * 12) 
    : 0;
    
  return {
    points,
    totalRevenue,
    currentMonthRevenue,
    previousMonthRevenue,
    revenueTrend,
    runway,
    maxRevenue,
    averageMonthlyRevenue
  };
};