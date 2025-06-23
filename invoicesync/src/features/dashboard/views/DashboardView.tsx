import React from "react";
import StatCards from "../components/StatCards"
import BurnRateChart from "../components/BurnRateChart"
import RecentActivity from "../components/RecentActivity"
import TopClients from "../components/TopClients"
import DashboardHeader from "../components/DashboardHeader"

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
      <DashboardHeader />

      <div className="space-y-4 py-4 px-8">
        {/* Charts Section */}
        <div className="grid gap-4">
          <BurnRateChart />
        </div>

        {/* Stats Cards */}
        <StatCards />

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