import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFinanceStore } from '@/store/useFinanceStore'

interface AdminTransactionControlsProps {
  onAddTransaction: () => void
  onExportTransactions: () => void
}

export function AdminTransactionControls({
  onAddTransaction,
  onExportTransactions,
}: AdminTransactionControlsProps) {
  const { user } = useFinanceStore()

  // Only show for admin users
  if (user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button
        onClick={onExportTransactions}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 h-10 text-xs font-black uppercase tracking-widest border border-black dark:border-white hover:bg-surface-cream/60 dark:hover:bg-surface-cream/20 transition-colors"
      >
        <Download size={14} strokeWidth={3} />
        Export JSON
      </Button>
      <Button
        onClick={onAddTransaction}
        className="flex items-center gap-2 bg-[#1e1f23] hover:bg-[#F54E00] text-white px-4 py-2 h-10 text-xs font-black uppercase tracking-widest transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
      >
        <Plus size={14} strokeWidth={3} />
        Add Transaction
      </Button>
    </div>
  )
}
