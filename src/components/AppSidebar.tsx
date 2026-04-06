import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Receipt,
  LineChart,
  CreditCard,
  Settings,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
  Zap,
  User,
  Shield,
} from 'lucide-react'
import Avatar from 'boring-avatars'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

import { useFinanceStore } from '@/store/useFinanceStore'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

type NavPath = '/' | '/transactions' | '/analysis' | '/accounts' | '/settings'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: NavPath
  keywords: string[]
}

export function AppSidebar() {
  const { user, setRole, logout } = useFinanceStore()
  const { theme, setTheme } = useTheme()

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      to: '/',
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
      label: 'Analysis',
      icon: LineChart,
      to: '/analysis',
      keywords: [
        'insights',
        'metrics',
        'trend',
        'forecast',
        'runway',
        'performance',
      ],
    },
    {
      label: 'Accounts',
      icon: CreditCard,
      to: '/accounts',
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
      label: 'Transactions',
      icon: Receipt,
      to: '/transactions',
      keywords: [
        'ledger',
        'journal',
        'merchant',
        'status',
        'settled',
        'pending',
        'filter',
      ],
    },
    {
      label: 'Settings',
      icon: Settings,
      to: '/settings',
      keywords: ['profile', 'security', 'permissions', 'config', 'preferences'],
    },
  ]

  const roles: Array<'USER' | 'ADMIN'> = ['USER', 'ADMIN']

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="w-64 group-data-[collapsible=icon]:w-16 transition-all duration-300 border-r border-sidebar-border bg-sidebar"
    >
      {/* HEADER */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#1e1f23] text-white shadow-lg">
            <Zap className="size-5 text-[#F54E00]" />
          </div>

          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-extrabold text-lg tracking-tight -skew-x-6">
              FLUX
            </span>
            <span className="text-[9px] opacity-40 font-black uppercase">
              Financial Control
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2 overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 mb-2 text-[10px] font-black uppercase tracking-widest  group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    className="min-h-11 h-11 sm:h-10 sm:min-h-10 py-2 hover:bg-white hover:shadow-sm data-[active=true]:bg-white data-[active=true]:shadow-sm transition-all"
                  >
                    <Link
                      to={item.to}
                      activeProps={{ 'data-active': true }}
                      className={cn(
                        'flex items-center w-full gap-3 px-3 rounded-md transition-all relative',

                        // collapsed mode
                        'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',

                        // active text color
                        'data-[active=true]:text-[#F54E00]',

                        // LEFT ACTIVE INDICATOR (NO SHIFT)
                        'data-[active=true]:before:absolute',
                        'data-[active=true]:before:left-0',
                        'data-[active=true]:before:top-1',
                        'data-[active=true]:before:bottom-1',
                        'data-[active=true]:before:w-1',
                        'data-[active=true]:before:bg-[#F54E00]',
                        'data-[active=true]:before:rounded-r',
                      )}
                    >
                      <item.icon className="size-4 shrink-0 transition-colors group-hover:text-[#F54E00]" />

                      <span className="text-[11px] font-black uppercase tracking-tight transition-transform group-hover:translate-x-1 group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex flex-col gap-5">
          {/* ROLES */}
          <div>
            <div className="px-2 mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-data-[collapsible=icon]:hidden">
              Workspace Access
            </div>
            <div className="flex flex-col gap-1.5 p-1 bg-surface-sage/20 rounded-lg border border-border/10 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    'flex items-center justify-between min-h-11 px-3 py-2.5 rounded-md text-[10px] font-black uppercase transition-all border',
                    'group-data-[collapsible=icon]:min-h-10 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:rounded',
                    user?.role === r
                      ? 'bg-white text-[#F54E00] shadow-sm translate-x-1 group-data-[collapsible=icon]:translate-x-0 group-data-[collapsible=icon]:bg-white group-data-[collapsible=icon]:shadow-sm'
                      : 'text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hover:bg-surface-sage/30',
                    // Theme-based borders: white in dark mode, black in light mode
                    'dark:border-white border-black group-data-[collapsible=icon]:dark:border-0 group-data-[collapsible=icon]:border-0',
                  )}
                >
                  <div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0">
                    {r === 'ADMIN' ? (
                      <Shield className="size-3.5 shrink-0" />
                    ) : (
                      <User className="size-3.5 shrink-0" />
                    )}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {r}
                    </span>
                  </div>
                  {user?.role === r && (
                    <div className="size-1.5 rounded-full bg-[#F54E00] group-data-[collapsible=icon]:hidden" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-sidebar-border/30 group-data-[collapsible=icon]:hidden" />

          {/* USER */}
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="relative">
              <div className="size-9 overflow-hidden rounded-md border-2 border-white">
                <Avatar
                  size={36}
                  name={user?.name ?? 'Finance User'}
                  variant="beam"
                  colors={[
                    '#F54E00',
                    '#1E1F23',
                    '#6B7280',
                    '#0EA5E9',
                    '#22C55E',
                  ]}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-3 bg-green-600 border-2 border-white rounded-full" />
            </div>

            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-[11px] font-black truncate uppercase">
                {user?.name}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase">
                Admin Ops • {user?.role}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col gap-2">
            <div className="flex gap-1 group-data-[collapsible=icon]:flex-col">
              <SidebarMenuButton
                size="sm"
                className="min-h-11 min-w-11 w-11 h-11 sm:min-h-10 sm:min-w-10 sm:w-10 sm:h-10 flex items-center justify-center border hover:bg-white"
                aria-label="Open help"
                title="Help"
              >
                <HelpCircle className="size-4" />
              </SidebarMenuButton>

              <SidebarMenuButton
                size="sm"
                className="min-h-11 min-w-11 w-11 h-11 sm:min-h-10 sm:min-w-10 sm:w-10 sm:h-10 flex items-center justify-center border hover:bg-white"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                aria-label={
                  theme === 'light'
                    ? 'Switch to dark theme'
                    : 'Switch to light theme'
                }
                title={theme === 'light' ? 'Dark theme' : 'Light theme'}
              >
                {theme === 'light' ? (
                  <Moon className="size-4" />
                ) : (
                  <Sun className="size-4" />
                )}
              </SidebarMenuButton>
            </div>

            <SidebarMenuButton
              size="sm"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
              className="min-h-11 h-11 sm:h-10 sm:min-h-10 px-4 bg-[#1e1f23] text-white hover:bg-[#F54E00] group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:px-0"
            >
              <LogOut className="size-4" />
              <span className="ml-2 text-[10px] font-black uppercase group-data-[collapsible=icon]:hidden">
                Sign Out
              </span>
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
