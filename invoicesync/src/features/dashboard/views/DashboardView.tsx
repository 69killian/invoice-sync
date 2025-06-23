import React from "react";

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
          <div className="p-6 rounded-none border bg-background text-card-foreground space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">Total Revenue</div>
              <div className="text-xs text-chart-1 font-light font-normal border border-gray-700 px-2" style={{color: '#10b981'}}>+12.5%</div>
            </div>
            <div className="text-2xl font-light" style={{color: 'white'}}>$15,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
          
          <div className="p-6 rounded-none border bg-background text-card-foreground space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">New Customers</div>
              <div className="text-xs text-destructive font-light font-normal border border-gray-700 px-2" style={{color: '#ef4444'}}>-20%</div>
            </div>
            <div className="text-2xl font-light" style={{color: 'white'}}>1,234</div>
            <p className="text-xs text-muted-foreground">
              Down 20% this period
            </p>
          </div>
          
          <div className="p-6 rounded-none border bg-background text-card-foreground space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">Active Accounts</div>
              <div className="text-xs text-chart-1 font-normal border border-gray-700 px-2" style={{color: '#10b981'}}>+12.5%</div>
            </div>
            <div className="text-2xl font-light" style={{color: 'white'}}>45,678</div>
            <p className="text-xs text-muted-foreground">
              Strong user retention
            </p>
          </div>
          
          <div className="p-6 rounded-none border bg-background text-card-foreground space-y-3">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-normal text-muted-foreground">Total Invoices</div>
              <div className="text-xs text-chart-1 font-normal border border-gray-700 px-2" style={{color: '#10b981'}}>+4.5%</div>
            </div>
            <div className="text-2xl font-light" style={{color: 'white'}}>4.5%</div>
            <p className="text-xs text-muted-foreground">
              Steady performance
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Activity */}
          <div className="p-6 rounded-none border bg-background text-card-foreground space-y-6">
            <h3 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-chart-1 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-normal" style={{color: 'white'}}>New invoice created</p>
                  <p className="text-xs text-muted-foreground">Invoice #INV-001 for Acme Corp</p>
                </div>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-chart-2 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-normal" style={{color: 'white'}}>Payment received</p>
                  <p className="text-xs text-muted-foreground">$2,500 from Beta SARL</p>
                </div>
                <span className="text-xs text-muted-foreground">1h ago</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-normal" style={{color: 'white'}}>New client added</p>
                  <p className="text-xs text-muted-foreground">Gamma SAS joined</p>
                </div>
                <span className="text-xs text-muted-foreground">3h ago</span>
              </div>
            </div>
          </div>

          {/* Top Clients */}
          <div className="p-6 rounded-none border bg-background text-card-foreground space-y-6">
            <h3 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>Top Clients</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-1 rounded-none flex items-center justify-center">
                    <span className="text-xs font-medium text-white">AC</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-normal" style={{color: 'white'}}>Acme Corp</p>
                    <p className="text-xs text-muted-foreground">acme@corp.com</p>
                  </div>
                </div>
                <span className="text-sm font-normal" style={{color: 'white'}}>€3,200</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-2 rounded-none flex items-center justify-center">
                    <span className="text-xs font-medium text-white">BS</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-normal" style={{color: 'white'}}>Beta SARL</p>
                    <p className="text-xs text-muted-foreground">contact@beta.fr</p>
                  </div>
                </div>
                <span className="text-sm font-normal" style={{color: 'white'}}>€2,800</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-chart-3 rounded-none flex items-center justify-center">
                    <span className="text-xs font-medium text-white">GS</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-normal" style={{color: 'white'}}>Gamma SAS</p>
                    <p className="text-xs text-muted-foreground">hello@gamma.com</p>
                  </div>
                </div>
                <span className="text-sm font-normal" style={{color: 'white'}}>€2,100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView; 