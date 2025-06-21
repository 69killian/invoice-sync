import React from "react";

const DashboardPage = () => {
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
      <div className="py-2">
          <p className="font-normal text-sm py-1 mb-2 px-6" style={{color: 'white'}}>
            Dashboard
          </p>
          <div className="border-b border-gray-700 mb-4"></div>
        </div>

      <div className="space-y-4 py-4 px-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="card p-6 rounded-none border space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">Total Revenue</div>
              <div className="text-xs text-chart-1 font-light font-normal border border-gray-700 px-2">+12.5%</div>
            </div>
            <div className="text-2xl font-light">$15,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
          
          <div className="card p-6 rounded-none border space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">New Customers</div>
              <div className="text-xs text-destructive font-light font-normal border border-gray-700 px-2">-20%</div>
            </div>
            <div className="text-2xl font-light">1,234</div>
            <p className="text-xs text-muted-foreground">
              Down 20% this period
            </p>
          </div>
          
          <div className="card p-6 rounded-none border space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">Active Accounts</div>
              <div className="text-xs text-chart-1 font-normal border border-gray-700 px-2 ">+12.5%</div>
            </div>
            <div className="text-2xl font-light">45,678</div>
            <p className="text-xs text-muted-foreground">
              Strong user retention
            </p>
          </div>
          
          <div className="card p-6 rounded-none border space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">Growth Rate</div>
              <div className="text-xs text-chart-1 font-normal border border-gray-700 px-2">+4.5%</div>
            </div>
            <div className="text-2xl font-light">4.5%</div>
            <p className="text-xs text-muted-foreground">
              Steady performance
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart */}
          <div className="card p-6 rounded-none border lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-normal">Total Visitors</h3>
                <p className="text-sm text-muted-foreground">Total for the last 3 months</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost text-xs px-3 py-1">Last 3 months</button>
                <button className="btn btn-ghost text-xs px-3 py-1">Last 30 days</button>
                <button className="btn btn-ghost text-xs px-3 py-1">Last 7 days</button>
              </div>
            </div>
            
            {/* Chart SVG */}
            <div className="h-64 w-full">
              <svg viewBox="0 0 250 100" className="w-full h-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                
                {/* Area under curve */}
                <path
                  d={createAreaPath(chartData)}
                  fill="url(#chartGradient)"
                />
                
                {/* Main curve line */}
                <path
                  d={createPath(chartData)}
                  className="chart-line"
                  strokeWidth="2"
                />
                
                {/* Data points */}
                {chartData.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x * 2.5}
                    cy={100 - point.y}
                    r="3"
                    fill="var(--chart-1)"
                  />
                ))}
              </svg>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Jun 2</span>
              <span>Jun 16</span>
              <span>Jun 30</span>
            </div>
          </div>

          {/* Side Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Subscriptions */}
            <div className="card p-6 rounded-none border space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-normal">Subscriptions</h4>
                <div className="text-2xl font-light">+2,350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </div>
              
              {/* Mini chart comme sur ton image */}
              <div className="h-16 w-full">
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  <defs>
                    <linearGradient id="miniGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  <path
                    d="M 0 40 Q 25 20, 50 25 T 100 15 T 150 20 T 200 10"
                    fill="none"
                    stroke="var(--chart-2)"
                    strokeWidth="2"
                  />
                  
                  <path
                    d="M 0 40 Q 25 20, 50 25 T 100 15 T 150 20 T 200 10 L 200 60 L 0 60 Z"
                    fill="url(#miniGradient)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activity */}
          <div className="card p-6 rounded-none border space-y-6">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-chart-1 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-normal">New invoice created</p>
                  <p className="text-xs text-muted-foreground">Invoice #INV-001 for Acme Corp</p>
                </div>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-chart-2 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-normal">Payment received</p>
                  <p className="text-xs text-muted-foreground">$2,500 from Beta SARL</p>
                </div>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-normal">New client added</p>
                  <p className="text-xs text-muted-foreground">Gamma SAS joined</p>
                </div>
                <span className="text-xs text-muted-foreground">3h ago</span>
              </div>
            </div>
          </div>

          {/* Top Clients */}
          <div className="card p-6 rounded-none border space-y-6">
            <h3 className="text-lg font-medium">Top Clients</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-1 rounded-none flex items-center justify-center">
                    <span className="text-xs font-medium text-white">AC</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-normal">Acme Corp</p>
                    <p className="text-xs text-muted-foreground">acme@corp.com</p>
                  </div>
                </div>
                <span className="text-sm font-normal">€3,200</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-2 rounded-none flex items-center justify-center">
                    <span className="text-xs font-medium text-white">BS</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-normal">Beta SARL</p>
                    <p className="text-xs text-muted-foreground">contact@beta.fr</p>
                  </div>
                </div>
                <span className="text-sm font-normal">€2,800</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-3 rounded-none flex items-center justify-center">
                    <span className="text-xs font-medium text-white">GS</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-normal">Gamma SAS</p>
                    <p className="text-xs text-muted-foreground">hello@gamma.com</p>
                  </div>
                </div>
                <span className="text-sm font-normal">€2,100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 