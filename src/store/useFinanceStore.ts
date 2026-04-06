import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  FinanceState,
  FinanceUser,
  UserRole,
  Transaction,
  BankAccount,
  CreditCard,
} from '@/types/finance'

const DEFAULT_USER: FinanceUser = {
  id: 'u1',
  name: 'Marcus Aurelius',
  role: 'USER',
  email: 'marcus@stoic.finance',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  bio: 'Institutional Finance Architect',
}

const syncTransactionsJson = (transactions: Transaction[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      'finance-transactions-json',
      JSON.stringify(transactions),
    )
  }
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      transactions: [],
      accounts: [],
      creditCards: [],
      isLoading: false,
      error: null,

      setRole: (role: UserRole) =>
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        })),

      setUser: (user: FinanceUser | null) => set({ user }),

      updateProfile: (
        updates: Partial<
          Pick<FinanceUser, 'name' | 'email' | 'bio' | 'avatar'>
        >,
      ) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setTransactions: (transactions: Transaction[]) => {
        if (typeof window !== 'undefined') {
          syncTransactionsJson(transactions)
        }
        return set({ transactions })
      },

      setAccounts: (accounts: BankAccount[]) => set({ accounts }),

      setCreditCards: (creditCards: CreditCard[]) => set({ creditCards }),

      addTransaction: (newTx: Omit<Transaction, 'id' | 'status'>) =>
        set((state) => {
          const status: Transaction['status'] =
            state.user?.role === 'USER' ? 'PENDING' : 'SETTLED'

          const transactions = [
            {
              ...newTx,
              id: `tx-${Date.now()}`,
              status,
            },
            ...state.transactions,
          ]

          if (typeof window !== 'undefined') {
            syncTransactionsJson(transactions)
          }

          return { transactions }
        }),

      updateTransaction: (id: string, updates: Partial<Transaction>) =>
        set((state) => {
          const transactions = state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx,
          )
          if (typeof window !== 'undefined') {
            syncTransactionsJson(transactions)
          }
          return { transactions }
        }),

      logout: () =>
        set({ user: null, transactions: [], accounts: [], creditCards: [] }),
    }),
    {
      name: 'finance-storage',
    },
  ),
)
