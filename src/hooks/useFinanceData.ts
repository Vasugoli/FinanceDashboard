import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFinanceStore } from '@/store/useFinanceStore'
import type {
  Transaction,
  FinanceUser,
  BankAccount,
  CreditCard,
  ChartDataPoint,
  MarketInsight,
} from '@/types/finance'

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2024-03-24',
    merchant: 'Aurelius Infrastructure',
    amount: 12500.0,
    category: 'Capital Ops',
    status: 'SETTLED',
    type: 'EXPENSE',
  },
  {
    id: '2',
    date: '2024-03-23',
    merchant: 'Stoa Wealth Management',
    amount: 5500.0,
    category: 'Investment',
    status: 'SETTLED',
    type: 'INCOME',
  },
  {
    id: '3',
    date: '2024-03-22',
    merchant: 'Global Logistics Corp',
    amount: 8500.0,
    category: 'Revenue',
    status: 'SETTLED',
    type: 'INCOME',
  },
  {
    id: '4',
    date: '2024-03-21',
    merchant: 'Prime Realty Holdings',
    amount: 4200.0,
    category: 'Infrastructure',
    status: 'PENDING',
    type: 'EXPENSE',
  },
  {
    id: '5',
    date: '2024-03-20',
    merchant: 'Vertex Tech Solutions',
    amount: 1200.75,
    category: 'Operations',
    status: 'CANCELED',
    type: 'EXPENSE',
  },
  {
    id: '6',
    date: '2024-03-19',
    merchant: 'Aurelius Infrastructure',
    amount: 3200.0,
    category: 'Capital Ops',
    status: 'SETTLED',
    type: 'EXPENSE',
  },
  {
    id: '7',
    date: '2024-03-18',
    merchant: 'Stoa Wealth Management',
    amount: 1500.0,
    category: 'Investment',
    status: 'SETTLED',
    type: 'INCOME',
  },
]

const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: 'a1',
    institution: 'J.P. Morgan',
    accountName: 'Private Client Checking',
    balance: 452080.12,
    syncStatus: 'SYNCED',
    sparklineData: [42, 45, 43, 46, 48, 45, 47],
  },
  {
    id: 'a2',
    institution: 'Goldman Sachs',
    accountName: 'Asset Management',
    balance: 782450.0,
    syncStatus: 'SYNCED',
    sparklineData: [70, 72, 71, 75, 78, 77, 79],
  },
  {
    id: 'a3',
    institution: 'Morgan Stanley',
    accountName: 'Liquidity Reserve',
    balance: 125000.0,
    syncStatus: 'PENDING',
    sparklineData: [12, 12, 12, 12, 12, 12, 12],
  },
]

const MOCK_CREDIT_CARDS: CreditCard[] = [
  {
    id: 'c1',
    brand: 'AMEX',
    cardName: 'The Platinum Card',
    lastFour: '1007',
    balance: 12450.0,
    limit: 100000,
    color: '#78f502',
  },
  {
    id: 'c2',
    brand: 'CHASE',
    cardName: 'Sapphire Reserve',
    lastFour: '4402',
    balance: 4200.12,
    limit: 50000,
    color: '#1A237E',
  },
  {
    id: 'c3',
    brand: 'APPLE',
    cardName: 'Apple Card',
    lastFour: '9921',
    balance: 0.0,
    limit: 25000,
    color: '#f5f5f7',
  },
]

const MOCK_PERFORMANCE_DATA: ChartDataPoint[] = [
  { label: 'Jan', value: 45000, secValue: 20000 },
  { label: 'Feb', value: 52000, secValue: 22000 },
  { label: 'Mar', value: 48000, secValue: 21000 },
  { label: 'Apr', value: 61000, secValue: 25000 },
  { label: 'May', value: 55000, secValue: 23000 },
  { label: 'Jun', value: 67000, secValue: 28000 },
]

const MOCK_CATEGORY_DATA: ChartDataPoint[] = [
  { label: 'Infrastructure', value: 45 },
  { label: 'Operations', value: 25 },
  { label: 'Investment', value: 15 },
  { label: 'Lifestyle', value: 10 },
  { label: 'Others', value: 5 },
]

const MOCK_MARKET_INSIGHTS: MarketInsight[] = [
  {
    symbol: 'AAPL',
    price: 197.42,
    changePercent: 1.28,
    trend: 'UP',
    updatedAt: new Date().toISOString(),
  },
  {
    symbol: 'TSLA',
    price: 234.18,
    changePercent: -0.84,
    trend: 'DOWN',
    updatedAt: new Date().toISOString(),
  },
  {
    symbol: 'NVDA',
    price: 946.77,
    changePercent: 2.17,
    trend: 'UP',
    updatedAt: new Date().toISOString(),
  },
  {
    symbol: 'MSFT',
    price: 428.3,
    changePercent: 0.63,
    trend: 'UP',
    updatedAt: new Date().toISOString(),
  },
]

type DummyJsonProduct = {
  id: number
  title: string
  brand?: string
  category?: string
  price?: number
  stock?: number
  rating?: number
  discountPercentage?: number
}

type FinFeedQuoteRaw = {
  symbol?: string
  ticker?: string
  price?: number
  last?: number
  close?: number
  currentPrice?: number
  changePercent?: number
  percentChange?: number
  change_pct?: number
  updatedAt?: string
  timestamp?: string | number
}

type FmpQuoteRaw = {
  symbol?: string
  price?: number
  changesPercentage?: number | string
  change?: number
  timestamp?: number | string
}

const DUMMYJSON_BASE_URL =
  import.meta.env.VITE_DUMMYJSON_BASE_URL ?? 'https://dummyjson.com'

/** Live quotes only when this is set to a reachable API origin (no default — avoids dead DNS / console noise). */
const FINFEED_API_BASE_URL = (
  import.meta.env.VITE_FINFEED_API_BASE_URL ?? ''
).replace(/\/$/, '')

const FMP_API_BASE_URL = (
  import.meta.env.VITE_FMP_API_BASE_URL ?? 'https://financialmodelingprep.com'
).replace(/\/$/, '')

const FMP_API_KEY = (import.meta.env.VITE_FMP_API_KEY ?? 'demo').trim()

const MARKET_DATA_PROVIDER = (
  import.meta.env.VITE_MARKET_DATA_PROVIDER ?? 'auto'
)
  .trim()
  .toLowerCase()

const hasFinfeedConfig = Boolean(FINFEED_API_BASE_URL)
const hasFmpConfig =
  Boolean(FMP_API_BASE_URL) &&
  Boolean(FMP_API_KEY) &&
  FMP_API_KEY.toLowerCase() !== 'demo'

const hasLiveMarketFeed =
  (MARKET_DATA_PROVIDER === 'finfeed' && hasFinfeedConfig) ||
  (MARKET_DATA_PROVIDER === 'fmp' && hasFmpConfig) ||
  (MARKET_DATA_PROVIDER === 'auto' && (hasFinfeedConfig || hasFmpConfig))

const MARKET_SYMBOLS = (
  import.meta.env.VITE_FINFEED_SYMBOLS ?? 'AAPL,TSLA,NVDA,MSFT'
)
  .split(',')
  .map((symbol: string) => symbol.trim().toUpperCase())
  .filter(Boolean)

const freshMockMarketInsights = (): MarketInsight[] =>
  MOCK_MARKET_INSIGHTS.map((row) => ({
    ...row,
    updatedAt: new Date().toISOString(),
  }))

const toIsoDate = (dayOffset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - dayOffset)
  return date.toISOString().slice(0, 10)
}

const mapDummyProductToTransaction = (
  product: DummyJsonProduct,
  index: number,
): Transaction => {
  const amount = Number(product.price ?? 0)
  const isIncome = Number(product.rating ?? 0) >= 4.7
  const status: Transaction['status'] =
    (product.stock ?? 0) === 0
      ? 'CANCELED'
      : (product.stock ?? 0) < 10
        ? 'PENDING'
        : 'SETTLED'

  return {
    id: `dj-${product.id}`,
    date: toIsoDate(index),
    merchant: product.brand ?? product.title,
    amount: Number.isFinite(amount) ? amount : 0,
    category: product.category ?? 'Others',
    status,
    type: isIncome ? 'INCOME' : 'EXPENSE',
    note: product.title,
  }
}

const buildCategoryChart = (transactions: Transaction[]): ChartDataPoint[] => {
  const expenseTransactions = transactions.filter((tx) => tx.type === 'EXPENSE')
  const source =
    expenseTransactions.length > 0 ? expenseTransactions : transactions
  const totals = source.reduce<Record<string, number>>((acc, tx) => {
    const key = tx.category || 'Others'
    return {
      ...acc,
      [key]: (acc[key] ?? 0) + Math.abs(tx.amount),
    }
  }, {})

  const totalValue = Object.values(totals).reduce(
    (sum, value) => sum + value,
    0,
  )
  if (totalValue === 0) {
    return MOCK_CATEGORY_DATA
  }

  return Object.entries(totals)
    .map(([label, value]) => ({
      label,
      value: Number(((value / totalValue) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

const mapFinFeedQuote = (quote: FinFeedQuoteRaw): MarketInsight | null => {
  const symbol = (quote.symbol ?? quote.ticker ?? '').trim().toUpperCase()
  const rawPrice = Number(
    quote.price ?? quote.last ?? quote.currentPrice ?? quote.close ?? 0,
  )
  const rawChangePercent = Number(
    quote.changePercent ?? quote.percentChange ?? quote.change_pct ?? 0,
  )
  const safeChangePercent = Number.isFinite(rawChangePercent)
    ? rawChangePercent
    : 0

  if (!symbol || !Number.isFinite(rawPrice) || rawPrice <= 0) {
    return null
  }

  const toSafeIsoString = (value: string | number | undefined): string => {
    if (value === undefined) {
      return new Date().toISOString()
    }

    const date =
      typeof value === 'number' ? new Date(value * 1000) : new Date(value)

    if (Number.isNaN(date.getTime())) {
      return new Date().toISOString()
    }

    return date.toISOString()
  }

  const updatedAt = toSafeIsoString(quote.timestamp ?? quote.updatedAt)

  return {
    symbol,
    price: Number(rawPrice.toFixed(2)),
    changePercent: Number(safeChangePercent.toFixed(2)),
    trend: safeChangePercent >= 0 ? 'UP' : 'DOWN',
    updatedAt,
  }
}

const mapFmpQuote = (quote: FmpQuoteRaw): MarketInsight | null => {
  const symbol = (quote.symbol ?? '').trim().toUpperCase()
  const price = Number(quote.price ?? 0)
  const rawChangePercent = Number(
    String(quote.changesPercentage ?? quote.change ?? 0).replace('%', ''),
  )
  const safeChangePercent = Number.isFinite(rawChangePercent)
    ? rawChangePercent
    : 0

  if (!symbol || !Number.isFinite(price) || price <= 0) {
    return null
  }

  const timestamp = Number(quote.timestamp ?? 0)
  const updatedAt =
    Number.isFinite(timestamp) && timestamp > 0
      ? new Date(timestamp * 1000).toISOString()
      : new Date().toISOString()

  return {
    symbol,
    price: Number(price.toFixed(2)),
    changePercent: Number(safeChangePercent.toFixed(2)),
    trend: safeChangePercent >= 0 ? 'UP' : 'DOWN',
    updatedAt,
  }
}

const toPerformanceData = (insights: MarketInsight[]): ChartDataPoint[] =>
  insights.map((item) => ({
    label: item.symbol,
    value: item.price,
    secValue: Math.abs(item.changePercent),
  }))

const fetchDummyJsonTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${DUMMYJSON_BASE_URL}/products?limit=60`)
  if (!response.ok) {
    throw new Error('DummyJSON request failed')
  }

  const payload = (await response.json()) as { products?: DummyJsonProduct[] }
  const products = payload.products ?? []

  if (products.length === 0) {
    throw new Error('DummyJSON returned empty products list')
  }

  return products.slice(0, 50).map(mapDummyProductToTransaction)
}

const fetchFinFeedMarketInsights = async (): Promise<MarketInsight[]> => {
  if (!FINFEED_API_BASE_URL) {
    return freshMockMarketInsights()
  }

  const endpoint = `${FINFEED_API_BASE_URL}/v1/quotes?symbols=${MARKET_SYMBOLS.join(',')}`

  try {
    const response = await fetch(endpoint)

    if (!response.ok) {
      return freshMockMarketInsights()
    }

    const payload = (await response.json()) as
      | {
          quotes?: FinFeedQuoteRaw[]
          data?: FinFeedQuoteRaw[]
          results?: FinFeedQuoteRaw[]
        }
      | FinFeedQuoteRaw[]

    const rawQuotes = Array.isArray(payload)
      ? payload
      : (payload.quotes ?? payload.data ?? payload.results ?? [])

    const insights = rawQuotes
      .map(mapFinFeedQuote)
      .filter((item): item is MarketInsight => item !== null)

    if (insights.length === 0) {
      return freshMockMarketInsights()
    }

    return insights
  } catch {
    return freshMockMarketInsights()
  }
}

const fetchFmpMarketInsights = async (): Promise<MarketInsight[]> => {
  if (!hasFmpConfig || MARKET_SYMBOLS.length === 0) {
    return freshMockMarketInsights()
  }

  const apiKey = FMP_API_KEY || 'demo'
  const symbolsCsv = MARKET_SYMBOLS.join(',')
  const endpoint = `${FMP_API_BASE_URL}/api/v3/quote/${symbolsCsv}?apikey=${encodeURIComponent(apiKey)}`

  try {
    const response = await fetch(endpoint)
    if (!response.ok) {
      return freshMockMarketInsights()
    }

    const payload = (await response.json()) as FmpQuoteRaw[]
    const insights = (Array.isArray(payload) ? payload : [])
      .map(mapFmpQuote)
      .filter((item): item is MarketInsight => item !== null)

    if (insights.length === 0) {
      return freshMockMarketInsights()
    }

    return insights
  } catch {
    return freshMockMarketInsights()
  }
}

const fetchMarketInsights = async (): Promise<MarketInsight[]> => {
  if (MARKET_DATA_PROVIDER === 'auto') {
    if (hasFinfeedConfig) {
      return fetchFinFeedMarketInsights()
    }

    if (hasFmpConfig) {
      return fetchFmpMarketInsights()
    }

    return freshMockMarketInsights()
  }

  if (MARKET_DATA_PROVIDER === 'finfeed') {
    return fetchFinFeedMarketInsights()
  }

  if (MARKET_DATA_PROVIDER === 'fmp') {
    return fetchFmpMarketInsights()
  }

  return freshMockMarketInsights()
}

export const useFinanceData = () => {
  const { transactions, setTransactions } = useFinanceStore()

  const transactionsQuery = useQuery<Transaction[], Error>({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      try {
        return await fetchDummyJsonTransactions()
      } catch {
        return MOCK_TRANSACTIONS
      }
    },
  })

  useEffect(() => {
    if (transactionsQuery.data && transactions.length === 0) {
      setTransactions(transactionsQuery.data)
    }
  }, [transactionsQuery.data])

  const accountsQuery = useQuery<BankAccount[], Error>({
    queryKey: ['accounts'],
    queryFn: async (): Promise<BankAccount[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return MOCK_ACCOUNTS
    },
  })

  const creditCardsQuery = useQuery<CreditCard[], Error>({
    queryKey: ['credit-cards'],
    queryFn: async (): Promise<CreditCard[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return MOCK_CREDIT_CARDS
    },
  })

  const categoryQuery = useQuery<ChartDataPoint[], Error>({
    queryKey: ['categories', JSON.stringify(transactions)],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      if (transactions.length === 0) {
        return MOCK_CATEGORY_DATA
      }

      return buildCategoryChart(transactions)
    },
    enabled: true,
  })

  const marketInsightsQuery = useQuery<MarketInsight[], Error>({
    queryKey: ['market-insights'],
    queryFn: fetchMarketInsights,
    refetchInterval: hasLiveMarketFeed ? 60000 : false,
    refetchIntervalInBackground: hasLiveMarketFeed,
  })

  const performanceQuery = useQuery<ChartDataPoint[], Error>({
    queryKey: ['performance', marketInsightsQuery.dataUpdatedAt],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      if (!marketInsightsQuery.data) {
        return MOCK_PERFORMANCE_DATA
      }

      return toPerformanceData(marketInsightsQuery.data)
    },
    enabled: Boolean(marketInsightsQuery.data),
  })

  const profileQuery = useQuery<FinanceUser, Error>({
    queryKey: ['profile'],
    queryFn: async (): Promise<FinanceUser> => {
      return {
        id: 'u1',
        name: 'Marcus Aurelius',
        email: 'marcus@stoic.finance',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        role: 'USER',
        bio: 'Institutional Finance Architect',
      }
    },
  })

  useEffect(() => {
    if (transactions.length > 0 && typeof window !== 'undefined') {
      window.localStorage.setItem(
        'finance-transactions-json',
        JSON.stringify(transactions),
      )
    }
  }, [transactions])

  return {
    transactionsQuery,
    transactions,
    accountsQuery,
    creditCardsQuery,
    performanceQuery,
    categoryQuery,
    marketInsightsQuery,
    profileQuery,
  }
}
