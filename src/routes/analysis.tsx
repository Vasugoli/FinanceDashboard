import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts'
import { useFinanceData } from '@/hooks/useFinanceData'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/ThemeProvider'
import { pageContentEnter } from '@/lib/motion'

export const Route = createFileRoute('/analysis')({
  component: AnalysisPage,
})

function AnalysisPage() {
  const { performanceQuery } = useFinanceData()
  const { theme } = useTheme()
  const [chartsReady, setChartsReady] = useState(false)
  const data = performanceQuery.data || []
  const isDark = theme === 'dark'

  useEffect(() => {
    let raf1 = 0
    let raf2 = 0

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setChartsReady(true)
      })
    })

    return () => {
      if (raf1) {
        window.cancelAnimationFrame(raf1)
      }
      if (raf2) {
        window.cancelAnimationFrame(raf2)
      }
    }
  }, [])

  const flowGridStroke = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)'
  const flowTickFill = isDark ? 'rgba(238,239,233,0.88)' : 'rgba(35,37,29,0.72)'
  const flowSecondaryBarFill = isDark
    ? 'rgba(238,239,233,0.35)'
    : 'rgba(0,0,0,0.18)'
  const flowTooltipBorder = isDark
    ? '1px solid rgba(238,239,233,0.2)'
    : '1px solid #e5e7eb'
  const flowTooltipBackground = isDark ? '#232a2d' : '#ffffff'
  const flowTooltipText = isDark ? '#eeefe9' : '#23251d'
  const runwayGradientColor = isDark
    ? 'rgba(238,239,233,0.28)'
    : 'rgba(0,0,0,0.1)'
  const runwayStroke = isDark ? 'rgba(238,239,233,0.72)' : 'rgba(0,0,0,0.3)'

  const metrics = [
    {
      label: 'AVERAGE MONTHLY REVENUE',
      value: '$12.4k',
      trend: '+5.2%',
      isPositive: true,
    },
    {
      label: 'OPERATIONAL BURN RATE',
      value: '$8.2k',
      trend: '-2.1%',
      isPositive: true,
    },
    {
      label: 'EQUITY GROWTH (CAGR)',
      value: '18.4%',
      trend: '+1.2%',
      isPositive: true,
    },
    {
      label: 'CAPITAL EFFICIENCY',
      value: '34.2%',
      trend: '+4.0%',
      isPositive: true,
    },
  ]

  return (
    <div
      className={cn(
        'space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-8',
        pageContentEnter,
      )}
    >
      <header className="flex flex-col gap-2 border-b border-sidebar-border pb-4 sm:pb-6">
        <h2 className="headline-page tracking-tighter transform -skew-x-2 italic uppercase font-black wrap-break-word">
          Strategic Intelligence
        </h2>
        <p className="label-secondary text-pretty">
          Predictive Modeling & Institutional Performance Metrics
        </p>
      </header>

      {/* METRIC RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="island-shell p-4 sm:p-6 bg-surface-cream/10 border-sidebar-border/40"
          >
            <p className="label-caps mb-3 sm:mb-4 text-[10px] sm:text-xs leading-snug">
              {m.label}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="display-metric text-on-surface-dark tracking-tighter tabular-nums break-all sm:break-normal">
                {m.value}
              </div>
              <div
                className={cn(
                  'label-secondary px-2 py-2 sm:py-1 rounded-sm border font-semibold shrink-0 self-start sm:self-auto',
                  m.isPositive
                    ? 'bg-[#008a00]/5 text-[#008a00] border-[#008a00]/20'
                    : 'bg-[#F54E00]/5 text-[#F54E00] border-[#F54E00]/20',
                )}
              >
                {m.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="island-shell p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 bg-white border-sidebar-border shadow-none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="headline-sm">Equity Velocity</h3>
              <p className="label-secondary mt-2">Growth Coefficient</p>
            </div>
            <TrendingUp
              size={20}
              className="text-[#008a00] opacity-60 shrink-0"
              strokeWidth={3}
            />
          </div>
          <div className="h-[min(42vw,14rem)] min-h-48 sm:min-h-52 md:h-56 w-full">
            {chartsReady ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={120}
              >
                <LineChart data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#F54E00"
                    strokeWidth={4}
                    dot={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-surface-cream animate-pulse rounded-lg border border-sidebar-border" />
            )}
          </div>
          <div className="mt-auto pt-6 border-t border-sidebar-border/30">
            <div className="flex justify-between items-center">
              <span className="label-secondary">Target Liquidity</span>
              <span className="display-metric text-2xl text-on-surface-dark tracking-tighter">
                $1.24M
              </span>
            </div>
          </div>
        </div>

        <div className="island-shell p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 bg-surface-cream/20 border-sidebar-border shadow-none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="headline-sm">Survival Runway</h3>
              <p className="label-secondary mt-2">Operational Depth</p>
            </div>
            <TrendingDown
              size={20}
              className="text-on-surface-dark/40 shrink-0"
              strokeWidth={3}
            />
          </div>
          <div className="h-[min(42vw,14rem)] min-h-48 sm:min-h-52 md:h-56 w-full">
            {chartsReady ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={120}
              >
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="burnGradientAnalysis"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={runwayGradientColor}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={runwayGradientColor}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="stepAfter"
                    dataKey="secValue"
                    stroke={runwayStroke}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#burnGradientAnalysis)"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-surface-cream animate-pulse rounded-lg border border-sidebar-border" />
            )}
          </div>
          <div className="mt-auto pt-6 border-t border-sidebar-border/30">
            <div className="flex justify-between items-center">
              <span className="label-secondary">Projected Longevity</span>
              <span className="display-metric text-2xl text-on-surface-dark tracking-tighter italic transform -skew-x-2">
                42 MONTHS
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="island-shell p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 bg-white border-sidebar-border shadow-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-0">
          <div>
            <h3 className="headline-sm">Flow Registry</h3>
            <p className="label-secondary mt-2">6-Month Moving Average</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#F54E00]" />
              <span className="text-sm font-semibold text-on-surface-dark">
                Revenue
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-on-surface-dark/20 border border-sidebar-border" />
              <span className="text-sm font-semibold text-on-surface-dark">
                Outflow
              </span>
            </div>
          </div>
        </div>

        <div className="h-[min(55vw,18rem)] min-h-56 sm:min-h-64 md:h-80 w-full -mx-1 sm:mx-0">
          {chartsReady ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={140}
            >
              <BarChart
                data={data}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke={flowGridStroke}
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: flowTickFill,
                  }}
                  dy={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: flowTickFill,
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(245, 78, 0, 0.04)' }}
                  contentStyle={{
                    borderRadius: '4px',
                    border: flowTooltipBorder,
                    backgroundColor: flowTooltipBackground,
                    color: flowTooltipText,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                    fontSize: '13px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#F54E00"
                  radius={[2, 2, 0, 0]}
                  barSize={34}
                />
                <Bar
                  dataKey="secValue"
                  fill={flowSecondaryBarFill}
                  radius={[2, 2, 0, 0]}
                  barSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-surface-cream animate-pulse rounded-lg border border-sidebar-border" />
          )}
        </div>
      </div>
    </div>
  )
}
