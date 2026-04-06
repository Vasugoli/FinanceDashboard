import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  BarChart3,
  Activity,
  Edit,
} from 'lucide-react'
import { useFinanceData } from '@/hooks/useFinanceData'
import { pageContentEnter } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { TransactionStatus, Transaction } from '@/types/finance'
import { TransactionForm } from '@/components/TransactionForm'
import { AdminTransactionControls } from '@/components/AdminTransactionControls'
import { useFinanceStore } from '@/store/useFinanceStore'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
})

function TransactionsPage() {
  const { transactionsQuery, transactions } = useFinanceData()
  const { user } = useFinanceStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

  const sourceTransactions: Transaction[] =
    transactions.length > 0 ? transactions : (transactionsQuery.data ?? [])

  const filtered = sourceTransactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = statusFilter === 'ALL' || tx.type === statusFilter
    return matchesSearch && matchesType
  })

  const getTypeStyle = (type: Transaction['type'] | TransactionStatus) => {
    if (type === 'INCOME') {
      return 'bg-[#008a00]/5 text-[#008a00] border-[#008a00]/20'
    } else if (type === 'EXPENSE') {
      return 'bg-[#F54E00]/5 text-[#F54E00] border-[#F54E00]/20'
    }
    return 'bg-surface-cream text-muted-foreground border-sidebar-border'
  }

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTransaction(null)
  }

  const handleExportTransactions = () => {
    const data = sourceTransactions
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'transactions.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const summaryStats = [
    {
      label: 'Spending Profile',
      value: '$12,450',
      trend: '-12%',
      isUp: false,
      icon: BarChart3,
    },
    {
      label: 'Settled Net',
      value: '$84,120',
      trend: '+8%',
      isUp: true,
      icon: Activity,
    },
    {
      label: 'Sync Health',
      value: 'OPTIMAL',
      trend: 'ACTIVE',
      isUp: true,
      icon: ShieldCheck,
    },
  ]

  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:gap-8 py-4 sm:py-6 md:py-8',
        pageContentEnter,
      )}
    >
      <header className="order-1 flex flex-col gap-2 border-b border-sidebar-border pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="headline-page tracking-tighter transform -skew-x-2 italic uppercase font-black wrap-break-word">
              Transactions Journal
            </h2>
            <p className="label-secondary text-pretty">
              Verified Financial Stream — Block verified
            </p>
          </div>
          <AdminTransactionControls
            onAddTransaction={handleAddTransaction}
            onExportTransactions={handleExportTransactions}
          />
        </div>
      </header>

      <div className="order-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="island-shell p-4 sm:p-6 flex flex-col justify-between bg-surface-cream/10 border-sidebar-border/40"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
              <div className="p-2 bg-background dark:bg-card rounded border border-sidebar-border/40 shadow-sm">
                <stat.icon
                  size={18}
                  className="text-on-surface-dark/70 dark:text-accent"
                  strokeWidth={3}
                />
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm font-semibold tracking-tighter px-3 py-1.5 rounded-sm uppercase border',
                  stat.isUp
                    ? 'bg-[#008a00]/5 text-[#008a00] border-[#008a00]/20'
                    : 'bg-muted/5 text-[#F54E00] border-sidebar-border/20',
                )}
              >
                {stat.isUp ? (
                  <ArrowUpRight size={14} strokeWidth={3} />
                ) : (
                  <ArrowDownLeft size={14} strokeWidth={3} />
                )}
                {stat.trend}
              </div>
            </div>
            <div className="min-w-0">
              <div className="display-metric mb-2 text-on-surface-dark tracking-tighter break-all sm:break-normal tabular-nums">
                {stat.value}
              </div>
              <p className="label-secondary text-pretty">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="order-2 dark:order-3 flex flex-col md:flex-row gap-3 md:gap-4 md:items-stretch bg-surface-cream/20 p-3 sm:p-4 rounded-lg border border-sidebar-border/30">
        <div className="relative flex-1 min-w-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-accent transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search merchants, entities, tags..."
            aria-label="Search transactions"
            className="w-full min-h-11 pl-12 pr-4 h-12 bg-white dark:bg-card text-on-surface-dark dark:text-on-surface rounded-md border border-sidebar-border shadow-sm focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-base font-medium outline-none placeholder:text-muted-foreground/70 dark:placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter transactions by type"
            className="flex-1 md:flex-none min-h-11 h-12 min-w-0 md:min-w-44 px-4 sm:px-6 bg-white dark:bg-card text-on-surface-dark dark:text-on-surface rounded-md border border-sidebar-border text-xs sm:text-sm font-semibold uppercase tracking-widest outline-none focus:border-accent shadow-sm appearance-none cursor-pointer scheme-light dark:scheme-dark"
          >
            <option value="ALL" className="bg-background text-foreground">
              All
            </option>
            <option value="INCOME" className="bg-background text-foreground">
              Income
            </option>
            <option value="EXPENSE" className="bg-background text-foreground">
              Expense
            </option>
          </select>
          <button
            type="button"
            className="flex items-center justify-center gap-2 min-h-11 h-12 w-full sm:flex-1 md:w-auto md:flex-none px-6 sm:px-8 bg-background dark:bg-card text-foreground dark:text-on-surface rounded-md border border-sidebar-border font-black text-[10px] uppercase tracking-widest hover:bg-[#F54E00] hover:text-white hover:border-[#F54E00] hover:-translate-y-px transition-all shadow-sm"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('ALL')
            }}
          >
            <Filter size={16} strokeWidth={3} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* LEDGER TABLE — cards on small viewports, table from md */}
      <div className="order-3 dark:order-4 island-shell overflow-hidden bg-white border border-sidebar-border shadow-none">
        {transactionsQuery.status === 'pending' ? (
          <>
            <div className="md:hidden p-4 space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-lg bg-surface-cream/50 border border-sidebar-border/20 animate-pulse"
                />
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-180 text-left border-collapse">
                <thead className="bg-surface-cream/30 border-b border-sidebar-border">
                  <tr>
                    <th className="py-4 lg:py-6 px-4 lg:px-8 label-caps text-xs">
                      Timestamp
                    </th>
                    <th className="py-4 lg:py-6 px-4 label-caps text-xs">
                      Item
                    </th>
                    <th className="py-4 lg:py-6 px-4 label-caps text-xs">
                      Category
                    </th>
                    <th className="py-4 lg:py-6 px-4 text-center label-caps text-xs">
                      Type
                    </th>
                    <th className="py-4 lg:py-6 px-4 lg:px-8 text-right label-caps text-xs">
                      Amount(USD)
                    </th>
                    {user?.role === 'ADMIN' && (
                      <th className="py-4 lg:py-6 px-4 text-center label-caps text-xs">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/30">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan={user?.role === 'ADMIN' ? 6 : 5}
                        className="py-8 lg:py-10 px-4 lg:px-8"
                      >
                        <div className="h-6 bg-surface-cream rounded w-full border border-sidebar-border/10" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : filtered.length > 0 ? (
          <>
            <div className="md:hidden p-4 space-y-3">
              {filtered.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-lg border border-sidebar-border/40 bg-surface-cream/15 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-on-surface-dark tracking-tighter uppercase italic wrap-break-word">
                        {tx.merchant}
                      </p>
                      <p className="text-[11px] font-medium opacity-50 mt-1 tracking-widest">
                        SEQ: {tx.id.toUpperCase().slice(0, 8)}
                      </p>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <button
                        onClick={() => handleEditTransaction(tx)}
                        className="p-2 rounded-md hover:bg-surface-cream/50 transition-colors"
                        title="Edit transaction"
                      >
                        <Edit
                          size={14}
                          className="text-muted-foreground hover:text-[#F54E00]"
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-on-surface-dark/70 tabular-nums uppercase tracking-tighter">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sidebar-border/20 pt-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-semibold opacity-80 px-2.5 py-1.5 bg-surface-cream rounded border border-sidebar-border/40 uppercase tracking-widest">
                        {tx.category}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-semibold px-2.5 py-1.5 rounded border uppercase tracking-widest',
                          getTypeStyle(tx.type),
                        )}
                      >
                        {tx.type}
                      </span>
                    </div>
                    <p
                      className={cn(
                        'text-base font-semibold tracking-tighter italic tabular-nums whitespace-nowrap',
                        tx.type === 'INCOME'
                          ? 'text-[#008a00]'
                          : 'text-[#F54E00]',
                      )}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'}
                      {tx.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-180 text-left border-collapse">
                <thead className="bg-surface-cream/30 border-b border-sidebar-border">
                  <tr>
                    <th className="py-4 lg:py-6 px-4 lg:px-8 label-caps text-xs">
                      Timestamp
                    </th>
                    <th className="py-4 lg:py-6 px-4 label-caps text-xs">
                      Item
                    </th>
                    <th className="py-4 lg:py-6 px-4 label-caps text-xs">
                      Category
                    </th>
                    <th className="py-4 lg:py-6 px-4 text-center label-caps text-xs">
                      Type
                    </th>
                    <th className="py-4 lg:py-6 px-4 lg:px-8 text-right label-caps text-xs">
                      Amount(USD)
                    </th>
                    {user?.role === 'ADMIN' && (
                      <th className="py-4 lg:py-6 px-4 text-center label-caps text-xs">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/30">
                  {filtered.map((tx) => (
                    <tr
                      key={tx.id}
                      className="group hover:bg-surface-cream/20 transition-colors"
                    >
                      <td className="py-4 lg:py-6 px-4 lg:px-8 text-sm font-semibold text-on-surface-dark/70 tabular-nums uppercase tracking-tighter">
                        {new Date(tx.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 lg:py-6 px-4">
                        <p className="text-sm lg:text-base font-semibold text-on-surface-dark tracking-tighter uppercase italic">
                          {tx.merchant}
                        </p>
                        <p className="text-xs font-medium opacity-50 mt-1 tracking-widest">
                          SEQ: {tx.id.toUpperCase().slice(0, 8)}
                        </p>
                      </td>
                      <td className="py-4 lg:py-6 px-4">
                        <span className="text-xs lg:text-sm font-semibold opacity-70 px-2.5 py-1 bg-surface-cream rounded border border-sidebar-border/40 uppercase tracking-widest">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 lg:py-6 px-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1.5 rounded-sm text-xs lg:text-sm font-semibold tracking-widest border uppercase',
                            getTypeStyle(tx.type),
                          )}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 lg:py-6 px-4 lg:px-8 text-right">
                        <p
                          className={cn(
                            'text-base lg:text-lg font-semibold tracking-tighter italic tabular-nums',
                            tx.type === 'INCOME'
                              ? 'text-[#008a00]'
                              : 'text-[#F54E00]',
                          )}
                        >
                          {tx.type === 'INCOME' ? '+' : '-'}
                          {tx.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </td>
                      {user?.role === 'ADMIN' && (
                        <td className="py-4 lg:py-6 px-4 text-center">
                          <button
                            onClick={() => handleEditTransaction(tx)}
                            className="p-2 rounded-md transition-colors"
                            title="Edit transaction"
                          >
                            <Edit
                              size={14}
                              className="text-muted-foreground hover:text-[#F54E00]"
                            />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-16 md:py-32 px-4 text-center">
            <p className="text-sm font-medium opacity-50 uppercase tracking-wider font-mono italic">
              No Transactions identified
            </p>
          </div>
        )}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transaction={editingTransaction}
      />
    </div>
  )
}
