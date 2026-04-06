import { useFinanceStore } from '@/store/useFinanceStore'
import { useEffect, useRef, useState } from 'react'
import {
  User,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Fingerprint,
} from 'lucide-react'
import Avatar from 'boring-avatars'
import { pageContentEnter } from '@/lib/motion'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user, updateProfile } = useFinanceStore()
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  })
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const profileNameId = 'profile-name'
  const profileEmailId = 'profile-email'
  const profileBioId = 'profile-bio'

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSave = () => {
    if (!user) return

    updateProfile({
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
    })

    setIsSaved(true)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => setIsSaved(false), 2000)
  }

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  if (!user) {
    return (
      <div
        className={cn(
          'space-y-6 sm:space-y-8 py-4 sm:py-6 md:py-8',
          pageContentEnter,
        )}
      >
        <header className="flex flex-col gap-2 border-b border-sidebar-border pb-4 sm:pb-6">
          <h2 className="headline-page tracking-tighter transform -skew-x-2 italic uppercase font-black wrap-break-word">
            System Configuration
          </h2>
          <p className="label-secondary">
            Administrative Controls & Identity Ledger
          </p>
        </header>
        <div className="island-shell border-sidebar-border bg-white p-8">
          <p className="text-base font-semibold text-on-surface-dark">
            No profile data available.
          </p>
        </div>
      </div>
    )
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
          System Configuration
        </h2>
        <p className="label-secondary text-pretty">
          Administrative Controls & Identity Ledger
        </p>
      </header>

      <div className="flex flex-col gap-6 sm:gap-8">
        <section className="island-shell p-4 sm:p-6 md:p-8 bg-white border-sidebar-border shadow-none space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 border-b border-sidebar-border/30 pb-6 sm:pb-8">
            <div className="relative group">
              <div className="size-20 overflow-hidden rounded-full border-4 border-sidebar-border/40 group-hover:border-[#F54E00] transition-colors">
                <Avatar
                  size={80}
                  name={user.name}
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
              <div className="absolute -bottom-1 -right-1 bg-[#F54E00] text-white p-1.5 rounded-full border-4 border-white">
                <Fingerprint size={14} strokeWidth={3} />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tighter uppercase italic wrap-break-word">
                {user.name}
              </h3>
              <p className="label-secondary mt-2 text-pretty">
                {user.role} • {user.bio}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#F54E00] uppercase tracking-widest">
                Cryptographic identity managed by system policy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label htmlFor={profileNameId} className="label-secondary">
                Full Legal Entity Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-dark/30"
                  strokeWidth={3}
                />
                <input
                  id={profileNameId}
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className="w-full h-12 pl-12 pr-4 bg-surface-cream/10 rounded-md border border-sidebar-border text-base font-medium tracking-tighter outline-none focus:border-[#F54E00] focus:ring-4 focus:ring-[#F54E00]/5 transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label htmlFor={profileEmailId} className="label-secondary">
                Electronic Mail Registry
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-dark/30"
                  strokeWidth={3}
                />
                <input
                  id={profileEmailId}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className="w-full h-12 pl-12 pr-4 bg-surface-cream/10 rounded-md border border-sidebar-border text-base font-medium tracking-tighter outline-none focus:border-[#F54E00] focus:ring-4 focus:ring-[#F54E00]/5 transition-all"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <label htmlFor={profileBioId} className="label-secondary">
                Professional Institutional Bio
              </label>
              <textarea
                id={profileBioId}
                value={formData.bio}
                onChange={handleInputChange('bio')}
                className="w-full h-32 p-4 bg-surface-cream/10 rounded-md border border-sidebar-border text-base font-medium tracking-tighter outline-none focus:border-[#F54E00] focus:ring-4 focus:ring-[#F54E00]/5 transition-all resize-none italic"
              />
            </div>
          </div>
        </section>

        <section className="island-shell p-4 sm:p-6 md:p-8 bg-white border-sidebar-border shadow-none space-y-6">
          <div>
            <h3 className="headline-sm">Security Controls</h3>
            <p className="label-secondary mt-2">
              Keep the settings lean: only the core security controls remain.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Two-Factor Authentication',
                status: 'Optimal',
                icon: Shield,
              },
              {
                label: 'Hardware Key Enrollment',
                status: 'Unconfigured',
                icon: Fingerprint,
                urgent: true,
              },
              {
                label: 'Auto-Lock Session',
                status: '15 Minutes',
                icon: Lock,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-md border border-sidebar-border bg-surface-cream/10 p-4"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="p-3 bg-background dark:bg-card rounded border border-sidebar-border/40 text-on-surface-dark dark:text-accent">
                    <item.icon size={20} strokeWidth={3} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold tracking-tight uppercase wrap-break-word">
                      {item.label}
                    </p>
                    <p className="label-secondary mt-1">
                      Core account protection
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'px-4 py-2.5 min-h-10 inline-flex items-center justify-center rounded-sm text-xs sm:text-sm font-semibold uppercase tracking-widest border whitespace-nowrap self-start sm:self-auto',
                    item.urgent
                      ? 'bg-[#F54E00]/5 text-[#F54E00] border-[#F54E00]/30'
                      : 'bg-[#008a00]/5 text-[#008a00] border-[#008a00]/30',
                  )}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-sidebar-border/30 pt-6">
        <p className="label-caps text-[9px] font-black opacity-30 italic uppercase tracking-widest text-pretty max-w-prose">
          All changes are signed with your unique cryptographic key.
        </p>
        <button
          type="button"
          onClick={handleSave}
          className="flex w-full sm:w-auto min-h-12 items-center justify-center gap-2 px-8 sm:px-10 h-12 sm:h-14 bg-[#1e1f23] text-white rounded-md font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#F54E00] transition-all disabled:opacity-50 shadow-lg transform hover:-translate-y-1 active:translate-y-0 shrink-0"
          disabled={isSaved}
        >
          {isSaved ? (
            <CheckCircle2 size={16} strokeWidth={3} />
          ) : (
            <Save size={16} strokeWidth={3} />
          )}
          <span>{isSaved ? 'Synchronized' : 'Commit Changes'}</span>
        </button>
      </div>
    </div>
  )
}
