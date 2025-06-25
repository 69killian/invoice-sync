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
  const chartRef = React.useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })

  // Format amounts for display
  const formatAmount = (amount: number) => 
    amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

  // Create SVG paths
  const createPath = (points: ChartPoint[]) => {
    if (points.length < 2) return '';
    
    const path = points.reduce((acc, point, i) => {
      if (i === 0) {
        // Move to first point
        return `M ${point.x * 2.5} ${200 - point.y * 2}`;
      }
      // Use straight lines (L) instead of curves
      return `${acc} L ${point.x * 2.5} ${200 - point.y * 2}`;
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!chartRef.current) return
    const rect = chartRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
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
      <div 
        ref={chartRef}
        className="h-64 w-full relative" 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
      >
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
            strokeWidth="1"
          />

          {/* Interactive points */}
          {points.map((point, index) => (
            <g 
              key={index} 
              onMouseEnter={() => setHoveredPoint(index)}
            >
              <rect
                x={(point.x * 2.5) - (hoveredPoint === index ? 2 : 1)}
                y={(200 - point.y * 2) - (hoveredPoint === index ? 2 : 1)}
                width={hoveredPoint === index ? 4 : 2}
                height={hoveredPoint === index ? 4 : 2}
                fill="white"
                className="transition-all duration-200"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div 
            className="absolute z-50 pointer-events-none"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y - 16}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="bg-card text-white border border-border p-2 min-w-[120px] backdrop-blur-sm rounded-none force-white">
              <div className="space-y-1">
                <div className="text-xs font-medium force-white">
                  {formatAmount(points[hoveredPoint].amount)}
                </div>
                <div className="text-xs text-white/80 force-white">
                  {format(points[hoveredPoint].date, 'dd MMM yyyy', { locale: fr })}
                </div>
                {hoveredPoint > 0 && (
                  <div className={`text-xs ${
                    points[hoveredPoint].amount > points[hoveredPoint - 1].amount 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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