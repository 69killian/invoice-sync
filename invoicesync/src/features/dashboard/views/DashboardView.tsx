import React from "react";
import {
  StatCard,
  StatCardHeader,
  StatCardTitle,
  StatCardBadge,
  StatCardValue,
  StatCardDescription,
} from "../../../components/ui/stat-card"
import { RecentActivityCard, RecentActivityCardHeader, RecentActivityItem } from "../../../components/ui/recent-activity-card"
import { TopClientsCard, TopClientsCardHeader, TopClientItem } from "../../../components/ui/top-clients-card"

const DashboardView = () => {
  // Données pour le graphique courbe
  const chartData = [
    { x: 0, y: 30 },
    { x: 10, y: 45 },
    { x: 20, y: 35 },
    { x: 30, y: 60 },
    { x: 40, y: 55 },
    { x: 50, y: 70 },
    { x: 60, y: 65 },
    { x: 70, y: 80 },
    { x: 80, y: 75 },
    { x: 90, y: 85 },
    { x: 100, y: 90 }
  ];

  const createPath = (data: typeof chartData) => {
    const pathData = data.map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x * 2.5} ${100 - point.y}`;
    }).join(' ');
    
    return pathData;
  };

  const createAreaPath = (data: typeof chartData) => {
    const linePath = createPath(data);
    const lastPoint = data[data.length - 1];
    const firstPoint = data[0];
    return `${linePath} L ${lastPoint.x * 2.5} 100 L ${firstPoint.x * 2.5} 100 Z`;
  };

  return (
    <div className="">
      {/* Header */}
      <div className="py-2 px-8">
          <p className="font-normal text-sm py-1 mb-2 px-6" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Dashboard
          </p>
          <div className="border-b border-gray-700 mb-2"></div>
        </div>

      <div className="space-y-4 py-4 px-8">
        {/* Charts Section */}
        <div className="grid gap-4">
          {/* Main Chart */}
          <div className="py-6 rounded-none bg-background space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">2 months runway</span>
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs">?</span>
                  </div>
                </div>
                <div className="text-4xl font-light" style={{color: 'white'}}>€ 19,546.50</div>
              </div>
              <div className="flex gap-2">
                <select className="bg-background border border-border text-xs px-3 py-1 rounded-none text-foreground">
                  <option>Burnrate</option>
                </select>
                <select className="bg-background border border-border text-xs px-3 py-1 rounded-none text-foreground">
                  <option>July 2023 - July 2024</option>
                </select>
              </div>
            </div>
            
            {/* Chart SVG */}
            <div className="h-64 w-full relative">
              <svg viewBox="0 0 1000 200" className="w-full h-full">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="white" stopOpacity="0.1"/>
                  </linearGradient>
                  <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
                    <path d="m0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                
                {/* Grid lines */}
                <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
                  <line x1="0" y1="40" x2="1000" y2="40"/>
                  <line x1="0" y1="80" x2="1000" y2="80"/>
                  <line x1="0" y1="120" x2="1000" y2="120"/>
                  <line x1="0" y1="160" x2="1000" y2="160"/>
                </g>
                
                {/* Area with pattern */}
                <path
                  d="M 10 180 Q 90 175, 170 170 Q 250 165, 330 155 Q 410 145, 490 130 Q 570 115, 650 100 Q 730 90, 810 85 Q 890 80, 970 75 Q 990 72, 1000 70 L 1000 200 L 10 200 Z"
                  fill="url(#diagonalHatch)"
                />
                
                {/* Area gradient overlay */}
                <path
                  d="M 10 180 Q 90 175, 170 170 Q 250 165, 330 155 Q 410 145, 490 130 Q 570 115, 650 100 Q 730 90, 810 85 Q 890 80, 970 75 Q 990 72, 1000 70 L 1000 200 L 10 200 Z"
                  fill="url(#areaGradient)"
                />
                
                {/* Main curve line */}
                <path
                  d="M 10 180 Q 90 175, 170 170 Q 250 165, 330 155 Q 410 145, 490 130 Q 570 115, 650 100 Q 730 90, 810 85 Q 890 80, 970 75 Q 990 72, 1000 70"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Hover point */}
                <circle cx="810" cy="85" r="4" fill="white" stroke="#1f2937" strokeWidth="2"/>
                
                {/* Tooltip */}
                <g transform="translate(770, 65)">
                  <rect x="0" y="0" width="80" height="30" fill="#1f2937" stroke="#374151" rx="4"/>
                  <text x="40" y="12" textAnchor="middle" fill="white" fontSize="10">€ 24,345.50</text>
                  <text x="40" y="24" textAnchor="middle" fill="#9ca3af" fontSize="8">April 28, 2024</text>
                </g>
              </svg>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-4">
                <span>€40000</span>
                <span>€30000</span>
                <span>€20000</span>
                <span>€10000</span>
                <span>0</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground px-4">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>Total Revenue</StatCardTitle>
              <StatCardBadge trend="up">+12.5%</StatCardBadge>
            </StatCardHeader>
            <StatCardValue>$15,231.89</StatCardValue>
            <StatCardDescription>+20.1% from last month</StatCardDescription>
          </StatCard>
          
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>New Customers</StatCardTitle>
              <StatCardBadge trend="down">-20%</StatCardBadge>
            </StatCardHeader>
            <StatCardValue>1,234</StatCardValue>
            <StatCardDescription>Down 20% this period</StatCardDescription>
          </StatCard>
          
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>Active Accounts</StatCardTitle>
              <StatCardBadge trend="up">+12.5%</StatCardBadge>
            </StatCardHeader>
            <StatCardValue>45,678</StatCardValue>
            <StatCardDescription>Strong user retention</StatCardDescription>
          </StatCard>
          
          <StatCard>
            <StatCardHeader>
              <StatCardTitle>Total Invoices</StatCardTitle>
              <StatCardBadge trend="up">+4.5%</StatCardBadge>
            </StatCardHeader>
            <StatCardValue>4.5%</StatCardValue>
            <StatCardDescription>Steady performance</StatCardDescription>
          </StatCard>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activity */}
          <RecentActivityCard>
            <RecentActivityCardHeader>Recent Activity</RecentActivityCardHeader>
            <RecentActivityItem bulletClass="bg-chart-1" title="New invoice created" description="Invoice #INV-001 for Acme Corp" time="2m ago" />
            <RecentActivityItem bulletClass="bg-chart-2" title="Payment received" description="$2,500 from Beta SARL" time="1h ago" />
            <RecentActivityItem bulletClass="bg-chart-3" title="New client added" description="Gamma SAS joined" time="3h ago" />
          </RecentActivityCard>

          {/* Top Clients */}
          <TopClientsCard>
            <TopClientsCardHeader>Top Clients</TopClientsCardHeader>
            <TopClientItem colorClass="bg-chart-1" initials="AC" name="Acme Corp" email="acme@corp.com" revenue="€3,200" />
            <TopClientItem colorClass="bg-chart-2" initials="BS" name="Beta SARL" email="contact@beta.fr" revenue="€2,800" />
            <TopClientItem colorClass="bg-chart-3" initials="GS" name="Gamma SAS" email="hello@gamma.com" revenue="€2,100" />
          </TopClientsCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardView; 