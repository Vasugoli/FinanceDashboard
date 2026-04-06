import { useState, useEffect } from 'react'
import { useFinanceStore } from '@/store/useFinanceStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Transaction } from '@/types/finance'

interface TransactionFormData {
  date: string
  merchant: string
  amount: string
  category: string
  type: 'EXPENSE' | 'INCOME'
  note: string
}

interface TransactionFormProps {
  isOpen: boolean
  onClose: () => void
  transaction?: Transaction | null
}

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Business',
  'Other',
]

export function TransactionForm({
  isOpen,
  onClose,
  transaction,
}: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useFinanceStore()
  const [formData, setFormData] = useState<TransactionFormData>({
    date: '',
    merchant: '',
    amount: '',
    category: '',
    type: 'EXPENSE',
    note: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        // Edit mode
        setFormData({
          date: new Date(transaction.date).toISOString().split('T')[0],
          merchant: transaction.merchant,
          amount: transaction.amount.toString(),
          category: transaction.category,
          type: transaction.type,
          note: transaction.note || '',
        })
      } else {
        // Add mode
        setFormData({
          date: new Date().toISOString().split('T')[0],
          merchant: '',
          amount: '',
          category: '',
          type: 'EXPENSE',
          note: '',
        })
      }
      setErrors({})
    }
  }, [isOpen, transaction])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.merchant.trim()) newErrors.merchant = 'Merchant is required'
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    if (!formData.category) newErrors.category = 'Category is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const transactionData = {
      date: formData.date,
      merchant: formData.merchant.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      note: formData.note.trim() || undefined,
    }

    if (transaction) {
      // Edit existing transaction
      updateTransaction(transaction.id, transactionData)
    } else {
      // Add new transaction
      addTransaction(transactionData)
    }

    onClose()
  }

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-tight">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-xs font-semibold uppercase tracking-widest"
              >
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange('date')}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-xs font-semibold uppercase tracking-widest"
              >
                Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleInputChange('amount')}
                placeholder="0.00"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="merchant"
              className="text-xs font-semibold uppercase tracking-widest"
            >
              Merchant
            </Label>
            <Input
              id="merchant"
              value={formData.merchant}
              onChange={handleInputChange('merchant')}
              placeholder="Enter merchant name"
              className={errors.merchant ? 'border-red-500' : ''}
            />
            {errors.merchant && (
              <p className="text-xs text-red-500">{errors.merchant}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, category: value }))
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: '' }))
                  }
                }}
              >
                <SelectTrigger
                  className={errors.category ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest">
                Type
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="EXPENSE"
                    checked={formData.type === 'EXPENSE'}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, type: 'EXPENSE' }))
                    }
                    className="text-[#F54E00] focus:ring-[#F54E00]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Expense
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="INCOME"
                    checked={formData.type === 'INCOME'}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, type: 'INCOME' }))
                    }
                    className="text-[#008a00] focus:ring-[#008a00]"
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Income
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="note"
              className="text-xs font-semibold uppercase tracking-widest"
            >
              Note (Optional)
            </Label>
            <textarea
              id="note"
              value={formData.note}
              onChange={handleInputChange('note')}
              placeholder="Add a note..."
              rows={3}
              className="w-full p-3 bg-surface-cream/10 rounded-md border border-sidebar-border text-base font-medium tracking-tighter outline-none focus:border-[#F54E00] focus:ring-4 focus:ring-[#F54E00]/5 transition-all resize-none italic"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-[#1e1f23] hover:bg-[#F54E00] text-white"
            >
              {transaction ? 'Update' : 'Add'} Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
