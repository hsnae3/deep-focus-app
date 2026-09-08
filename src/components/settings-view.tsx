'use client'

import { Bell, Minus, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Settings = {
  sessionMinutes: number
  distractionAlerts: boolean
  autoAdvanceSteps: boolean
}

type SettingsViewProps = {
  settings: Settings
  onChange: (next: Settings) => void
}

export function SettingsView({ settings, onChange }: SettingsViewProps) {
  function setMinutes(delta: number) {
    const next = Math.min(90, Math.max(5, settings.sessionMinutes + delta))
    onChange({ ...settings, sessionMinutes: next })
  }

  return (
    <div className="animate-rise flex flex-col gap-6 pt-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Tune how your sessions run.</p>
      </header>

      <section aria-labelledby="timer-heading" className="rounded-3xl border border-border bg-card p-4">
        <h2 id="timer-heading" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Session length
        </h2>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMinutes(-5)}
            aria-label="Decrease session length by 5 minutes"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary/20 hover:text-primary active:scale-95"
          >
            <Minus className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="text-center">
            <span className="text-4xl font-semibold tabular-nums">{settings.sessionMinutes}</span>
            <span className="ml-1 text-sm text-muted-foreground">min</span>
          </p>
          <button
            type="button"
            onClick={() => setMinutes(5)}
            aria-label="Increase session length by 5 minutes"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary/20 hover:text-primary active:scale-95"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          {[25, 45, 60].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ ...settings, sessionMinutes: m })}
              className={cn(
                'flex-1 rounded-full py-2 text-sm font-medium transition-colors',
                settings.sessionMinutes === m
                  ? 'bg-brand-gradient text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {m} min
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Preferences" className="flex flex-col divide-y divide-border rounded-3xl border border-border bg-card">
        <ToggleRow
          icon={Bell}
          label="Distraction alerts"
          description="Nudge me when I switch tabs mid-session"
          checked={settings.distractionAlerts}
          onChange={(v) => onChange({ ...settings, distractionAlerts: v })}
        />
        <ToggleRow
          icon={Sparkles}
          label="Auto-advance steps"
          description="Move to the next step when its time budget ends"
          checked={settings.autoAdvanceSteps}
          onChange={(v) => onChange({ ...settings, autoAdvanceSteps: v })}
        />
      </section>

      <p className="text-center text-xs text-muted-foreground">DeepFocus AI · v1.0</p>
    </div>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell
  label: string
  description: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300',
          checked ? 'bg-brand-gradient' : 'bg-secondary',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1 left-1 h-5 w-5 rounded-full bg-foreground shadow transition-transform duration-300',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </div>
  )
}
