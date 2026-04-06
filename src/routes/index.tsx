import { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  History,
  ChevronRight,
  TrendingDown,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useFinanceData } from '@/hooks/useFinanceData'
import { Skeleton } from '@/components/ui/skeleton'
import { cardEnter, pageContentEnter } from '@/lib/motion'
import { cn } from '@/lib/utils'

const statStagger = [
  'motion-safe:delay-0',
  'motion-safe:delay-75',
  'motion-safe:delay-150',
] as const

const insightStagger = [
  'motion-safe:delay-0',
  'motion-safe:delay-75',
  'motion-safe:delay-100',
  'motion-safe:delay-150',
] as const

export default function DashboardPage() {
  const {
    transactionsQuery,
    performanceQuery,
    categoryQuery,
    marketInsightsQuery,
  } = useFinanceData()
  const [chartsReady, setChartsReady] = useState(false)

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

  const stats = [
    {
      label: 'Total Balance',
      value: '$1,248,302',
      trend: '+4.2%',
      isUp: true,
      icon: Wallet,
    },
    {
      label: 'Monthly Revenue',
      value: '$84,120',
      trend: '+12.5%',
      isUp: true,
      icon: TrendingUp,
    },
    {
      label: 'Total Expenses',
      value: '$21,430',
      trend: '-2.4%',
      isUp: false,
      icon: TrendingDown,
    },
  ]

  // PostHog Data Visualization Palette
  const COLORS = ['#F54E00', '#F7A501', '#1e1f23', '#9ea096', '#e5e7e0']

  const getStatusPillClassName = (status: string) => {
    if (status === 'SETTLED') {
      return 'bg-[#008a00]/5 text-[#008a00] border-[#008a00]/20'
    }

    if (status === 'CANCELED') {
      return 'bg-[#F54E00]/5 text-[#F54E00] border-[#F54E00]/20'
    }

    if (status === 'ADJUSTED') {
      return 'bg-[#1e1f23]/5 text-[#1e1f23] border-[#1e1f23]/20'
    }

    return 'bg-[#F7A501]/5 text-[#F7A501] border-[#F7A501]/20'
  }

  return (
    <div
      className={cn(
        'space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-8',
        pageContentEnter,
      )}
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col gap-2 border-b border-sidebar-border pb-4 sm:pb-6">
        <div className="w-full min-w-0">
          <h2 className="headline-page tracking-tighter transform -skew-x-2 italic uppercase font-black wrap-break-word overflow-hidden">
            Financial Ops
          </h2>
        </div>
        <p className="label-secondary text-pretty">
          Editorial Intelligence System
        </p>
      </header>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'island-shell p-4 sm:p-6 group cursor-default motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5',
              cardEnter(statStagger[i] ?? statStagger[0]),
            )}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-sidebar-border/30 pb-3 gap-2">
              <span className="label-secondary text-sm font-semibold truncate">
                {stat.label}
              </span>
              <stat.icon
                size={16}
                className="text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0"
              />
            </div>
            <div className="display-metric mb-3 sm:mb-4 text-on-surface-dark break-all sm:break-normal tabular-nums">
              {stat.value}
            </div>
            <div
              className={cn(
                'inline-flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-2 sm:py-1.5 min-h-11 sm:min-h-0 rounded bg-surface-cream/50 uppercase tracking-tighter',
                stat.isUp ? 'text-[#008a00]' : 'text-[#F54E00]',
              )}
            >
              {stat.isUp ? (
                <ArrowUpRight size={14} strokeWidth={3} />
              ) : (
                <ArrowDownLeft size={14} strokeWidth={3} />
              )}
              {stat.trend}{' '}
              <span className="opacity-60 ml-1">vs prev cycle</span>
            </div>
          </div>
        ))}
      </div>

      {/* MARKET INSIGHTS */}
      <div className="island-shell p-4 sm:p-6 bg-surface-cream/10 border-sidebar-border/40">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="headline-sm">Market Insights</h3>
            <p className="label-secondary mt-1 text-pretty">
              Live Wire • Refreshes every 60s
            </p>
          </div>
          {marketInsightsQuery.data?.[0] ? (
            <p className="label-secondary text-xs shrink-0 tabular-nums">
              Updated{' '}
              {new Date(
                marketInsightsQuery.data[0].updatedAt,
              ).toLocaleTimeString()}
            </p>
          ) : null}
        </div>

        {marketInsightsQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-md border border-sidebar-border/30 bg-background p-4"
              >
                <Skeleton className="h-4 w-16 bg-surface-cream/60" />
                <Skeleton className="mt-3 h-7 w-24 bg-surface-cream/60" />
                <Skeleton className="mt-3 h-4 w-20 bg-surface-cream/60" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {marketInsightsQuery.data?.map((quote, i) => (
              <div
                key={quote.symbol}
                className={cn(
                  'rounded-md border border-sidebar-border/30 bg-background p-3 sm:p-4',
                  cardEnter(insightStagger[i] ?? insightStagger[0]),
                )}
              >
                <p className="label-caps text-xs">{quote.symbol}</p>
                <p className="mt-2 font-extrabold tabular-nums tracking-tight text-on-surface-dark text-[clamp(1.5rem,4vw,2rem)] leading-tight">
                  ${quote.price.toFixed(2)}
                </p>
                <p
                  className={cn(
                    'mt-2 text-sm font-semibold uppercase',
                    quote.trend === 'UP' ? 'text-[#008a00]' : 'text-[#F54E00]',
                  )}
                >
                  {quote.trend === 'UP' ? '+' : ''}
                  {quote.changePercent.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* PERFORMANCE CHART */}
        <div className="lg:col-span-2 island-shell p-4 sm:p-6 md:p-8 bg-surface-cream/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-10 md:mb-12">
            <div className="min-w-0">
              <h3 className="headline-sm">Growth Index</h3>
              <p className="label-secondary mt-2 text-pretty">
                Asset Velocity Mapping
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-accent rotate-45 shrink-0" />
                <span className="label-secondary text-xs sm:text-sm font-medium">
                  Primary Growth
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary/20 rotate-45 shrink-0" />
                <span className="label-secondary text-xs sm:text-sm font-medium">
                  Revenue Target
                </span>
              </div>
            </div>
          </div>

          <div className="h-[min(50vw,16rem)] min-h-56 sm:min-h-64 md:h-80 w-full relative">
            {chartsReady && performanceQuery.data ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={160}
              >
                <AreaChart data={performanceQuery.data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#F54E00"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#F54E00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ea096', fontSize: 10, fontWeight: 800 }}
                    dy={12}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{
                      stroke: '#F54E00',
                      strokeWidth: 2,
                      strokeDasharray: '4 4',
                    }}
                    contentStyle={{
                      backgroundColor: '#1e1f23',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '12px',
                    }}
                    itemStyle={{
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '12px',
                    }}
                    labelStyle={{
                      color: '#F7A501',
                      fontWeight: 900,
                      marginBottom: '4px',
                      fontSize: '10px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#F54E00"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    animationDuration={2000}
                  />
                  <Area
                    type="monotone"
                    dataKey="secValue"
                    stroke="#1e1f23"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    fill="transparent"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-surface-cream animate-pulse rounded-lg border border-sidebar-border" />
            )}
          </div>
        </div>

        {/* CAPITAL ALLOCATION */}
        <div className="island-shell p-4 sm:p-6 md:p-8 bg-surface-cream/5">
          <div className="mb-6 sm:mb-10">
            <h3 className="headline-ledger text-xl sm:text-2xl tracking-tight">
              Strategy
            </h3>
            <p className="label-caps text-[10px] opacity-40 mt-1 font-black">
              Capital Weight Index
            </p>
          </div>

          <div className="h-[min(55vw,12rem)] min-h-44 sm:min-h-56 sm:h-60 w-full relative mx-auto max-w-md sm:max-w-none">
            {chartsReady && categoryQuery.data ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={140}
              >
                <PieChart>
                  <Pie
                    data={categoryQuery.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryQuery.data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-surface-cream animate-pulse rounded-full border border-sidebar-border" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="label-caps opacity-30 text-[10px] font-black">
                Diversity
              </span>
              <span className="text-3xl font-black text-on-surface-dark tracking-tighter italic">
                84%
              </span>
            </div>
          </div>

          <div className="mt-10 space-y-3">
            {categoryQuery.data?.slice(0, 4).map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between group cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-3 h-3 rounded-sm group-hover:rotate-90 transition-transform',
                      [
                        'bg-[#F54E00]',
                        'bg-[#F7A501]',
                        'bg-[#1e1f23]',
                        'bg-[#9ea096]',
                      ][i] ?? 'bg-[#e5e7e0]',
                    )}
                  />
                  <span className="text-[10px] font-black uppercase text-on-surface-dark tracking-wider opacity-60 group-hover:opacity-100">
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] font-black text-on-surface-dark">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-3 island-shell overflow-hidden bg-white">
          <div className="p-4 sm:p-6 md:p-8 border-b border-sidebar-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-surface-cream/30">
            <div className="min-w-0">
              <h3 className="headline-page tracking-tighter uppercase font-black italic">
                Journal Ledger
              </h3>
              <p className="label-caps text-[10px] opacity-40 mt-1 font-black">
                Transaction Stream — Real-time
              </p>
            </div>
            <button
              type="button"
              className="inline-flex min-h-11 w-full sm:w-auto shrink-0 items-center justify-center gap-2 group bg-background px-4 py-2.5 border border-sidebar-border rounded-md shadow-sm transition-all text-foreground hover:bg-muted/40"
            >
              <span className="label-caps font-black text-[10px]">
                Full Archive
              </span>
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
          <div className="px-4 sm:px-6 md:px-8 pb-4">
            {transactionsQuery.isLoading ? (
              <div className="space-y-4 py-6 sm:py-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-surface-cream/50 rounded border border-sidebar-border/20 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="md:hidden space-y-3 py-4">
                  {transactionsQuery.data?.slice(0, 6).map((tx) => (
                    <div
                      key={tx.id}
                      className="rounded-lg border border-sidebar-border/40 bg-surface-cream/20 p-4 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded bg-surface-cream text-on-surface-dark shrink-0">
                          <History size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-on-surface-dark tracking-tight uppercase wrap-break-word">
                            {tx.merchant}
                          </p>
                          <p className="label-caps text-[9px] opacity-40 mt-0.5 font-bold">
                            {tx.category} / 001x
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sidebar-border/20 pt-3">
                        <span
                          className={cn(
                            'inline-flex px-3 py-2 min-h-10 items-center rounded-sm text-[9px] font-black tracking-widest uppercase border',
                            getStatusPillClassName(tx.status),
                          )}
                        >
                          {tx.status}
                        </span>
                        <div className="text-right min-w-0">
                          <p
                            className={cn(
                              'text-sm font-black tracking-tighter italic tabular-nums',
                              tx.type === 'INCOME'
                                ? 'text-[#008a00]'
                                : 'text-on-surface-dark',
                            )}
                          >
                            {tx.type === 'INCOME' ? '+' : '-'}
                            {tx.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-[10px] font-bold opacity-30 mt-0.5 uppercase tracking-tighter">
                            {tx.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden md:block w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <table className="w-full min-w-130 text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="py-4 md:py-6 label-caps text-[9px] opacity-30 border-b border-sidebar-border">
                          Entity
                        </th>
                        <th className="py-4 md:py-6 label-caps text-[9px] opacity-30 border-b border-sidebar-border text-center">
                          Protocol Status
                        </th>
                        <th className="py-4 md:py-6 label-caps text-[9px] opacity-30 border-b border-sidebar-border text-right">
                          Volume (USD)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsQuery.data?.slice(0, 6).map((tx) => (
                        <tr
                          key={tx.id}
                          className="group border-b border-sidebar-border/30 last:border-0 hover:bg-surface-cream/20 transition-colors"
                        >
                          <td className="py-4 md:py-5">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="p-2.5 md:p-3 rounded bg-surface-cream text-on-surface-dark group-hover:bg-accent group-hover:text-white motion-safe:transition-[transform,background-color,color] motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:scale-110 shrink-0">
                                <History size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black text-on-surface-dark tracking-tight uppercase truncate md:whitespace-normal">
                                  {tx.merchant}
                                </p>
                                <p className="label-caps text-[9px] opacity-40 mt-0.5 font-bold">
                                  {tx.category} / 001x
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 md:py-5 text-center">
                            <span
                              className={cn(
                                'px-3 py-1.5 rounded-sm text-[9px] font-black tracking-widest uppercase border',
                                getStatusPillClassName(tx.status),
                              )}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4 md:py-5 text-right">
                            <p
                              className={cn(
                                'text-sm md:text-base font-black tracking-tighter italic tabular-nums',
                                tx.type === 'INCOME'
                                  ? 'text-[#008a00]'
                                  : 'text-on-surface-dark',
                              )}
                            >
                              {tx.type === 'INCOME' ? '+' : '-'}
                              {tx.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <p className="text-[10px] font-bold opacity-30 mt-0.5 uppercase tracking-tighter">
                              {tx.date}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
