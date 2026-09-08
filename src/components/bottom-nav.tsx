'use client'

import { BarChart3, Settings, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Tab = 'home' | 'stats' | 'settings'

const tabs: { id: Tab; label: string; icon: typeof Target }[] = [
  { id: 'home', label: 'Focus', icon: Target },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex w-full max-w-md items-stretch justify-around">
        {tabs.map(({ id, label, icon: Icon }) => {
          const selected = active === id
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                aria-current={selected ? 'page' : undefined}
                onClick={() => onChange(id)}
                className={cn(
                  'group flex w-full flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  selected ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300',
                    selected ? 'bg-primary/20 text-primary' : 'group-active:scale-95',
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
