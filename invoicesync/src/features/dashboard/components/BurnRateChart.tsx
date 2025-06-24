import * as React from "react"
import { useRevenueStats } from "../hooks/useRevenueStats"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface BurnRateChartProps {
  monthsToShow?: number
}

interface ChartPoint {
  x: number
  y: number
  date: Date
  amount: number
}

const BurnRateChart: React.FC<BurnRateChartProps> = ({ monthsToShow = 12 }) => {
  const {
    points,
    currentMonthRevenue,
    revenueTrend,
    maxRevenue
  } = useRevenueStats(monthsToShow)

  const [hoveredPoint, setHoveredPoint] = React.useState<number | null>(null)

  // Format amounts for display
  const formatAmount = (amount: number) => 
    amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  // Create SVG paths
  const createPath = (points: ChartPoint[]) => {
    if (points.length < 2) return '';
    
    const path = points.reduce((acc, point, i, arr) => {
      if (i === 0) {
        // Move to first point
        return `M ${point.x * 2.5} ${200 - point.y * 2}`;
      }
      
      // Calculate control points for smooth curve
      const prev = arr[i - 1];
      const currX = point.x * 2.5;
      const currY = 200 - point.y * 2;
      const prevX = prev.x * 2.5;
      const prevY = 200 - prev.y * 2;
      
      // Control points at 1/3 and 2/3 between points
      const cp1x = prevX + (currX - prevX) / 3;
      const cp2x = prevX + 2 * (currX - prevX) / 3;
      
      // Use cubic Bezier curve
      return `${acc} C ${cp1x},${prevY} ${cp2x},${currY} ${currX},${currY}`;
    }, '');
    
    return path;
  }

  const createAreaPath = (points: ChartPoint[]) => {
    if (points.length < 2) return '';
    const linePath = createPath(points);
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x * 2.5} 200 L ${first.x * 2.5} 200 Z`;
  }

  return (
    <div className="py-6 rounded-none bg-background space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-4xl font-light text-white force-white">
            {formatAmount(currentMonthRevenue)}
          </div>
        </div>
        <div className="flex gap-2">
          <select className="bg-background border border-border text-xs px-3 py-1 rounded-none text-foreground">
            <option>Chiffre d'affaires</option>
          </select>
          <select className="bg-background border border-border text-xs px-3 py-1 rounded-none text-foreground">
            <option>{format(points[0].date, 'MMMM yyyy', { locale: fr })} - {format(points[points.length - 1].date, 'MMMM yyyy', { locale: fr })}</option>
          </select>
        </div>
      </div>

      {/* Chart SVG */}
      <div className="h-64 w-full relative">
        <svg viewBox="0 0 250 200" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="m0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2" stroke="white" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>

          {/* Grid lines */}
          <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
            <line x1="0" y1="40" x2="250" y2="40" />
            <line x1="0" y1="80" x2="250" y2="80" />
            <line x1="0" y1="120" x2="250" y2="120" />
            <line x1="0" y1="160" x2="250" y2="160" />
          </g>

          {/* Area with pattern */}
          <path
            d={createAreaPath(points)}
            fill="url(#diagonalHatch)"
          />
          <path
            d={createAreaPath(points)}
            fill="url(#areaGradient)"
          />
          <path
            d={createPath(points)}
            fill="none"
            stroke="white"
            strokeWidth="2"
          />

          {/* Interactive points */}
          {points.map((point, index) => (
            <g key={index} onMouseEnter={() => setHoveredPoint(index)} onMouseLeave={() => setHoveredPoint(null)}>
              <circle
                cx={point.x * 2.5}
                cy={200 - point.y * 2}
                r={hoveredPoint === index ? 4 : 0}
                fill="white"
                stroke="#1f2937"
                strokeWidth="2"
              />
              {hoveredPoint === index && (
                <g transform={`translate(${point.x * 2.5 - 40}, ${200 - point.y * 2 - 40})`}>
                  <rect x="0" y="0" width="80" height="30" fill="#1f2937" stroke="#374151" rx="4" />
                  <text x="40" y="12" textAnchor="middle" fill="white" fontSize="10">
                    {formatAmount(point.amount)}
                  </text>
                  <text x="40" y="24" textAnchor="middle" fill="#9ca3af" fontSize="8">
                    {format(point.date, 'dd MMMM yyyy', { locale: fr })}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-4">
          <span>{formatAmount(maxRevenue)}</span>
          <span>{formatAmount(maxRevenue * 0.75)}</span>
          <span>{formatAmount(maxRevenue * 0.5)}</span>
          <span>{formatAmount(maxRevenue * 0.25)}</span>
          <span>{formatAmount(0)}</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-4">
        {points.map((point, index) => (
          <span key={index}>
            {format(point.date, 'MMM', { locale: fr })}
          </span>
        ))}
      </div>
    </div>
  )
}

export default BurnRateChart