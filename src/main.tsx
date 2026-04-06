import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from '@/components/ThemeProvider'
import { Layout } from '@/components/Layout'
import DashboardPage from '@/routes/index'
import TransactionsPage from '@/routes/transactions'
import AnalysisPage from '@/routes/analysis'
import AccountsPage from '@/routes/accounts'
import SettingsPage from '@/routes/settings'
import '@/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="flux-theme">
        <BrowserRouter basename="/FinanceDashboard/">
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="analysis" element={<AnalysisPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
