import * as React from "react"

interface Point { x: number; y: number }
interface BurnRateChartProps {
  data?: Point[]
  runwayLabel?: string
  amount?: string
}

const defaultData: Point[] = [
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
  { x: 100, y: 90 },
]

const BurnRateChart: React.FC<BurnRateChartProps> = ({
  data = defaultData,
  runwayLabel = "2 months runway",
  amount = "€ 19,546.50",
}) => {
  // helpers (kept for potential future dynamic path usage)
  const createPath = (points: Point[]) =>
    points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 2.5} ${100 - p.y}`)
      .join(' ')

  const createAreaPath = (points: Point[]) => {
    const linePath = createPath(points)
    const last = points[points.length - 1]
    const first = points[0]
    return `${linePath} L ${last.x * 2.5} 100 L ${first.x * 2.5} 100 Z`
  }

  // For now we still rely on the static path used originally.
  // A future improvement could generate the path strings using the helpers above.

  return (
    <div className="py-6 rounded-none bg-background space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{runwayLabel}</span>
            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs">?</span>
            </div>
          </div>
          <div className="text-4xl font-light" style={{ color: 'white' }}>{amount}</div>
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
              <stop offset="0%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="m0,4 l4,-4 M-1,1 l2,-2 M3,5 l2,-2" stroke="white" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>

          {/* Grid lines */}
          <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
            <line x1="0" y1="40" x2="1000" y2="40" />
            <line x1="0" y1="80" x2="1000" y2="80" />
            <line x1="0" y1="120" x2="1000" y2="120" />
            <line x1="0" y1="160" x2="1000" y2="160" />
          </g>

          {/* Area with pattern */}
          <path
            d="M 10 180 Q 90 175, 170 170 Q 250 165, 330 155 Q 410 145, 490 130 Q 570 115, 650 100 Q 730 90, 810 85 Q 890 80, 970 75 Q 990 72, 1000 70 L 1000 200 L 10 200 Z"
            fill="url(#diagonalHatch)"
          />
          <path
            d="M 10 180 Q 90 175, 170 170 Q 250 165, 330 155 Q 410 145, 490 130 Q 570 115, 650 100 Q 730 90, 810 85 Q 890 80, 970 75 Q 990 72, 1000 70 L 1000 200 L 10 200 Z"
            fill="url(#areaGradient)"
          />
          <path
            d="M 10 180 Q 90 175, 170 170 Q 250 165, 330 155 Q 410 145, 490 130 Q 570 115, 650 100 Q 730 90, 810 85 Q 890 80, 970 75 Q 990 72, 1000 70"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          {/* Hover point */}
          <circle cx="810" cy="85" r="4" fill="white" stroke="#1f2937" strokeWidth="2" />
          {/* Tooltip */}
          <g transform="translate(770, 65)">
            <rect x="0" y="0" width="80" height="30" fill="#1f2937" stroke="#374151" rx="4" />
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
  )
}

export default BurnRateChart 