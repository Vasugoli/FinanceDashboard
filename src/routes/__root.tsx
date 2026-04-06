import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useNavigate,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Search, Shield } from 'lucide-react'
import { AppSidebar } from '#/components/AppSidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { useFinanceStore } from '@/store/useFinanceStore'
import { ThemeProvider } from '@/components/ThemeProvider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { subtleZoomEnter } from '@/lib/motion'
import { cn } from '@/lib/utils'
import appCss from '@/styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Flux | Financial Control Redefined',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { user } = useFinanceStore()
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const searchableRoutes = React.useMemo(
    () => [
      {
        title: 'Dashboard',
        subtitle: 'Overview, growth, activity, summary',
        to: '/' as const,
        keywords: [
          'home',
          'overview',
          'summary',
          'balance',
          'growth',
          'activity',
        ],
      },
      {
        title: 'Transactions',
        subtitle: 'Ledger, journal, status, merchants',
        to: '/transactions' as const,
        keywords: [
          'ledger',
          'journal',
          'status',
          'merchant',
          'settled',
          'pending',
          'filter',
        ],
      },
      {
        title: 'Analysis',
        subtitle: 'Insights, trends, runway, performance',
        to: '/analysis' as const,
        keywords: [
          'insights',
          'trends',
          'metrics',
          'forecast',
          'runway',
          'performance',
        ],
      },
      {
        title: 'Accounts',
        subtitle: 'Bank accounts, cards, liquidity, credit',
        to: '/accounts' as const,
        keywords: [
          'bank',
          'cards',
          'liquidity',
          'credit',
          'institution',
          'balance',
        ],
      },
      {
        title: 'Settings',
        subtitle: 'Profile, security, permissions, config',
        to: '/settings' as const,
        keywords: [
          'profile',
          'security',
          'permissions',
          'config',
          'preferences',
        ],
      },
    ],
    [],
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const queryTerms = normalizedQuery ? normalizedQuery.split(/\s+/) : []

  const searchResults = React.useMemo(() => {
    if (queryTerms.length === 0) {
      return searchableRoutes
    }

    return searchableRoutes.filter((item) => {
      const searchableText = [item.title, item.subtitle, ...item.keywords]
        .join(' ')
        .toLowerCase()

      return queryTerms.every((term) => searchableText.includes(term))
    })
  }, [queryTerms, searchableRoutes])

  const showDropdown = isSearchFocused && searchQuery.trim().length > 0

  React.useEffect(() => {
    if (searchResults.length === 0) {
      setActiveIndex(-1)
      return
    }

    setActiveIndex((prev) => {
      if (prev < 0) {
        return 0
      }

      if (prev >= searchResults.length) {
        return searchResults.length - 1
      }

      return prev
    })
  }, [searchResults.length])

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'ArrowDown') {
      if (searchResults.length === 0) {
        return
      }

      event.preventDefault()
      if (!isSearchFocused) {
        setIsSearchFocused(true)
      }
      setActiveIndex((prev) => {
        if (prev < 0) {
          return 0
        }

        return (prev + 1) % searchResults.length
      })
      return
    }

    if (event.key === 'ArrowUp') {
      if (searchResults.length === 0) {
        return
      }

      event.preventDefault()
      if (!isSearchFocused) {
        setIsSearchFocused(true)
      }
      setActiveIndex((prev) =>
        prev <= 0 ? searchResults.length - 1 : prev - 1,
      )
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsSearchFocused(false)
      return
    }

    if (event.key === 'Enter') {
      if (!showDropdown || searchResults.length === 0) {
        return
      }

      event.preventDefault()
      const selectedItem =
        activeIndex >= 0 ? searchResults[activeIndex] : searchResults[0]

      navigate({ to: selectedItem.to })
      setSearchQuery('')
      setIsSearchFocused(false)
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body
        className="font-sans antialiased selection:bg-accent/20"
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="light" storageKey="flux-theme">
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-dvh bg-surface w-full">
              <AppSidebar />
              <SidebarInset
                className={cn(
                  'flex-1 min-h-dvh flex flex-col overflow-visible relative',
                  subtleZoomEnter,
                )}
              >
                {/* Responsive Sticky Navigation Bar */}
                <nav className="flex h-auto md:h-16 shrink-0 items-center justify-between gap-2 md:gap-4 px-2 sm:px-4 py-3 md:py-0 sticky top-0 z-50 bg-surface/95 backdrop-blur-md supports-backdrop-filter:bg-surface/80 border-b border-sidebar-border @container/header pt-[max(0.75rem,env(safe-area-inset-top))]">
                  <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
                    {/* Mobile: Show logo as sidebar trigger */}
                    <SidebarTrigger className="md:hidden shrink-0 h-11 w-11 min-h-11 min-w-11 p-0 flex items-center justify-center rounded-lg bg-[#1e1f23] text-white shadow-lg hover:shadow-xl transition-shadow border-0" />

                    {/* Desktop: Show sidebar trigger */}
                    <SidebarTrigger className="hidden md:flex shrink-0 ml-0 md:ml-2 h-11 w-11 min-h-11 min-w-11" />

                    <Popover
                      open={showDropdown}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsSearchFocused(false)
                        }
                      }}
                    >
                      <PopoverAnchor asChild>
                        <div className="relative flex-1 min-w-0 max-w-2xl">
                          {/* Mobile: Search icon button */}
                          <button
                            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-10 rounded-md hover:bg-surface-cream/60 dark:hover:bg-surface-cream/20 transition-colors"
                            onClick={() => {
                              setIsSearchFocused(true)
                              searchInputRef.current?.focus()
                            }}
                            aria-label="Open search"
                          >
                            <Search className="size-4 text-muted-foreground/70" />
                          </button>

                          {/* Desktop: Full search input */}
                          <Search className="pointer-events-none hidden md:block absolute left-2.5 sm:left-3.5 top-1/2 z-10 size-3.5 sm:size-4 -translate-y-1/2 text-muted-foreground/70 shrink-0" />
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search..."
                            aria-label="Search navigation features"
                            value={searchQuery}
                            onChange={(event) => {
                              setSearchQuery(event.target.value)
                              setIsSearchFocused(true)
                            }}
                            onKeyDown={handleSearchKeyDown}
                            onFocus={() => {
                              setIsSearchFocused(true)
                              if (searchResults.length > 0 && activeIndex < 0) {
                                setActiveIndex(0)
                              }
                            }}
                            className="relative z-1 w-full min-h-11 max-w-full sm:max-w-md md:max-w-lg h-11 rounded-md border border-black bg-background pl-3 md:pl-9 sm:pl-10 pr-3 sm:pr-4 text-sm font-semibold text-foreground outline-none transition-colors dark:border-white focus:border-[#F54E00] active:border-[#F54E00]"
                          />
                        </div>
                      </PopoverAnchor>

                      <PopoverContent
                        align="start"
                        sideOffset={8}
                        onOpenAutoFocus={(event) => {
                          event.preventDefault()
                        }}
                        onCloseAutoFocus={(event) => {
                          event.preventDefault()
                        }}
                        className="w-[min(100vw-1rem,24rem)] max-w-[calc(100vw-1.5rem)] border-black bg-background p-1 dark:border-white"
                      >
                        <div className="flex flex-col gap-1">
                          {searchResults.length > 0 ? (
                            searchResults.map((result, index) => (
                              <button
                                key={result.to}
                                type="button"
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => {
                                  navigate({ to: result.to })
                                  setSearchQuery('')
                                  setIsSearchFocused(false)
                                  setActiveIndex(-1)
                                }}
                                className={cn(
                                  'cursor-pointer rounded-sm px-2 sm:px-3 py-2 text-left text-xs sm:text-sm outline-hidden transition-colors',
                                  activeIndex === index
                                    ? 'bg-surface-cream/60 dark:bg-surface-cream/20'
                                    : 'hover:bg-surface-cream/60 dark:hover:bg-surface-cream/20',
                                )}
                              >
                                <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">
                                  {result.title}
                                </p>
                                <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1">
                                  {result.subtitle}
                                </p>
                              </button>
                            ))
                          ) : (
                            <p className="px-2 sm:px-3 py-3 text-xs font-semibold text-muted-foreground">
                              No matching pages found.
                            </p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Responsive Header Label - Hidden on mobile, visible from md up */}
                  <div className="hidden md:flex items-center gap-2 md:gap-3 shrink-0">
                    {user?.role === 'ADMIN' && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F54E00]/10 border border-[#F54E00]/30">
                        <Shield className="size-3 text-[#F54E00]" />
                        <span className="text-[9px] font-black uppercase text-[#F54E00]">
                          Admin
                        </span>
                      </div>
                    )}
                    <div className="label-caps text-[10px] text-right whitespace-nowrap">
                      Where transactions meet clarity
                    </div>
                  </div>
                </nav>

                {/* Scroll region (outer <main> is SidebarInset — avoid nested <main>) */}
                <div className="flex-1 overflow-y-auto">
                  <div className="page-container mt-3 sm:mt-4 md:mt-6">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
