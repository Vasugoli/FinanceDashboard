export type UserRole = 'USER' | 'ADMIN'

export interface FinanceUser {
  id: string
  name: string
  role: UserRole
  avatar?: string
  email: string
  bio?: string
}

export type TransactionStatus = 'SETTLED' | 'PENDING' | 'CANCELED' | 'ADJUSTED'

export interface Transaction {
  id: string
  date: string
  merchant: string
  amount: number
  category: string
  status: TransactionStatus
  type: 'EXPENSE' | 'INCOME'
  note?: string
}

export type AccountSyncStatus = 'SYNCED' | 'PENDING' | 'ERROR'

export interface BankAccount {
  id: string
  institution: string
  accountName: string
  balance: number
  syncStatus: AccountSyncStatus
  sparklineData: number[]
}

export interface CreditCard {
  id: string
  brand: 'AMEX' | 'CHASE' | 'APPLE' | 'VISA' | 'MASTERCARD'
  cardName: string
  lastFour: string
  balance: number
  limit: number
  color: string
}

export interface ChartDataPoint {
  label: string
  value: number
  secValue?: number
}

export interface MarketInsight {
  symbol: string
  price: number
  changePercent: number
  trend: 'UP' | 'DOWN'
  updatedAt: string
}

export interface FinanceState {
  user: FinanceUser | null
  transactions: Transaction[]
  accounts: BankAccount[]
  creditCards: CreditCard[]
  isLoading: boolean
  error: string | null
  setRole: (role: UserRole) => void
  setUser: (user: FinanceUser | null) => void
  updateProfile: (
    updates: Partial<Pick<FinanceUser, 'name' | 'email' | 'bio' | 'avatar'>>,
  ) => void
  setTransactions: (transactions: Transaction[]) => void
  setAccounts: (accounts: BankAccount[]) => void
  setCreditCards: (cards: CreditCard[]) => void
  addTransaction: (transaction: Omit<Transaction, 'id' | 'status'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  logout: () => void
}
