import { useEffect, useState } from 'react'
import { useFinanceData } from '@/hooks/useFinanceData'
import { ShieldCheck, RefreshCcw, Lock, Globe } from 'lucide-react'
import { pageContentEnter } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function AccountsPage() {
  const { accountsQuery, creditCardsQuery } = useFinanceData()
  const [chartsReady, setChartsReady] = useState(false)
  const accounts = accountsQuery.data || []
  const cards = creditCardsQuery.data || []

  useEffect(() => {
    let frameOne = 0
    let frameTwo = 0

    frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(() => {
        setChartsReady(true)
      })
    })

    return () => {
      cancelAnimationFrame(frameOne)
      cancelAnimationFrame(frameTwo)
    }
  }, [])

  const totals = {
    liquidity: accounts.reduce((acc, a) => acc + a.balance, 0),
    debt: cards.reduce((acc, c) => acc + c.balance, 0),
  }

  const getCardBackgroundClass = (brand: string, color: string) => {
    if (brand === 'AMEX') return 'bg-[#B91C1C]'
    if (color === '#f5f5f7') return 'bg-[#1e1f23]'
    if (color === '#1A237E') return 'bg-[#1A237E]'
    if (color === '#C0C0C0') return 'bg-[#C0C0C0]'
    return 'bg-[#1e1f23]'
  }

  return (
    <div
      className={cn(
        'space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-8',
        pageContentEnter,
      )}
    >
      <header className="flex flex-col gap-2 border-b border-sidebar-border pb-4 sm:pb-6">
        <h2 className="headline-page tracking-tighter transform -skew-x-2 italic uppercase font-black wrap-break-word">
          Bank & Credit Accounts
        </h2>
        <p className="label-secondary text-pretty">
          Institutional Banking & Credit Facilities
        </p>
      </header>

      {/* REVENUE SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="island-shell p-5 sm:p-6 md:p-8 bg-[#1e1f23] text-white border-none shadow-xl">
          <p className="label-secondary text-white mb-3">
            TOTAL COMBINED LIQUIDITY
          </p>
          <h3 className="display-metric mb-4 sm:mb-6 tracking-tighter italic transform -skew-x-2 font-black wrap-break-word leading-none text-[clamp(1.35rem,1rem+1.6vw,2.25rem)] tabular-nums">
            $
            {totals.liquidity.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h3>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase opacity-70">
            <ShieldCheck size={16} className="text-[#F54E00]" strokeWidth={3} />
            <span>FDI-Insured Nodes</span>
          </div>
        </div>
        <div className="island-shell p-8 bg-surface-cream/10 border-sidebar-border/40">
          <p className="label-secondary mb-3">TOTAL REVOLVING DEBT</p>
          <h3 className="display-metric mb-4 sm:mb-6 text-on-surface-dark tracking-tighter italic transform -skew-x-2 font-black wrap-break-word leading-none text-[clamp(1.35rem,1rem+1.6vw,2.25rem)] tabular-nums">
            $
            {totals.debt.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h3>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[#F54E00]">
            <RefreshCcw size={16} strokeWidth={3} />
            <span>34.2% Utilization</span>
          </div>
        </div>
        <div className="island-shell p-8 bg-surface-cream/10 border-sidebar-border/40">
          <p className="label-secondary mb-3">INSTITUTIONAL NET WORTH</p>
          <h3 className="display-metric mb-4 sm:mb-6 text-on-surface-dark tracking-tighter italic transform -skew-x-2 font-black wrap-break-word leading-none text-[clamp(1.35rem,1rem+1.6vw,2.25rem)] tabular-nums">
            $
            {(totals.liquidity - totals.debt).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </h3>
          <div className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase opacity-60">
            <Globe size={16} strokeWidth={3} />
            <span>Global Valuation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* BANK ACCOUNTS */}
        <div className="space-y-6">
          <h4 className="label-caps">Verified Institutions</h4>
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="island-shell p-4 sm:p-6 bg-white border-sidebar-border shadow-none group hover:bg-surface-cream/20 transition-all duration-300"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3 sm:gap-5 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-surface-cream rounded border border-sidebar-border/40 flex items-center justify-center text-on-surface-dark/30 group-hover:text-[#F54E00] transition-colors">
                      <Lock size={24} strokeWidth={3} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-base sm:text-lg font-semibold tracking-tighter text-on-surface-dark uppercase italic wrap-break-word">
                        {acc.institution}
                      </h5>
                      <p className="label-secondary mt-1 text-pretty">
                        {acc.accountName}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto border-t border-sidebar-border/20 sm:border-0 pt-3 sm:pt-0">
                    <p className="text-lg sm:text-xl font-semibold tracking-tighter text-on-surface-dark tabular-nums">
                      ${acc.balance.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-start sm:justify-end gap-2 mt-2">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full border',
                          acc.syncStatus === 'SYNCED'
                            ? 'bg-[#008a00] border-[#008a00]/20'
                            : 'bg-[#F7A501] border-[#F7A501]/20',
                        )}
                      />
                      <span className="label-secondary text-xs font-semibold">
                        {acc.syncStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SPARKLINE — client-only + explicit box so ResponsiveContainer never measures -1 */}
                <div className="mt-8 h-10 w-full min-w-0 opacity-10 group-hover:opacity-40 transition-opacity">
                  {chartsReady ? (
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      minWidth={0}
                      minHeight={40}
                    >
                      <AreaChart
                        data={acc.sparklineData.map((val, i) => ({ val, i }))}
                      >
                        <Area
                          type="monotone"
                          dataKey="val"
                          stroke="currentColor"
                          fill="currentColor"
                          fillOpacity={0.2}
                          strokeWidth={3}
                          className="text-on-surface-dark"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-10 w-full rounded-sm bg-surface-cream/30" />
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-full min-h-14 h-auto py-4 sm:h-16 border-2 border-dashed border-sidebar-border dark:border-white/30 rounded-md flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 hover:border-[#F54E00]/40 hover:bg-surface-cream/40 dark:hover:bg-surface-sage/30 transition-all group"
            >
              <RefreshCcw
                size={18}
                className="text-on-surface-dark/30 group-hover:text-[#F54E00] group-hover:rotate-180 transition-all duration-500"
                strokeWidth={3}
              />
              <span className="text-sm font-semibold text-on-surface-dark dark:text-on-surface group-hover:text-[#F54E00] transition-colors">
                Link External Institution
              </span>
            </button>
          </div>
        </div>

        {/* CREDIT FACILITIES */}
        <div className="space-y-6">
          <h4 className="label-caps">Authorized Credit Facilities</h4>
          <div className="space-y-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  'relative min-h-56 sm:h-60 rounded-md p-5 sm:p-8 text-white overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 cursor-pointer border-r-[6px] border-b-[6px] border-black/10',
                  getCardBackgroundClass(card.brand, card.color),
                )}
              >
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_70%)]" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="label-secondary text-white/80 mb-1">
                        {card.brand}
                      </p>
                      <h5 className="text-2xl font-semibold tracking-tighter italic transform -skew-x-4 uppercase">
                        {card.cardName}
                      </h5>
                    </div>
                    <div className="w-12 h-9 rounded-sm border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                      <div className="w-7 h-5 bg-white/20 rounded-xs" />
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="label-secondary text-white/80 mb-1">
                        Available Credit
                      </p>
                      <p className="text-3xl font-semibold tracking-tighter italic transform -skew-x-2">
                        ${(card.limit - card.balance).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold tracking-widest opacity-70 tabular-nums">
                        •••• {card.lastFour}
                      </p>
                      <p className="label-secondary text-white/70 mt-2">
                        VLD 03/28
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
