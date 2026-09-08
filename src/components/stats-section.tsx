'use client'

import { Flame, Timer } from 'lucide-react'
import { cn } from '../lib/utils'
import { formatDuration, todayIndex, weekdayLabels, type FocusStats } from '../lib/focus-stats'

export function StatsSection({ stats, compact = false }: { stats: FocusStats; compact?: boolean }) {
  const max = Math.max(60, ...stats.weeklyMinutes)
  const today = todayIndex()
  const weekTotal = stats.weeklyMinutes.reduce((a, b) => a + b, 0)

  return (
    <section aria-labelledby="stats-heading" className="animate-rise flex flex-col gap-4" style={{ animationDelay: '160ms' }}>
      <div className="flex items-baseline justify-between">
        <h2 id="stats-heading" className={cn('font-semibold', compact ? 'text-base' : 'text-2xl tracking-tight')}>
          {compact ? 'Today' : 'Your focus'}
        </h2>
        {compact && <span className="text-xs text-muted-foreground">This week · {formatDuration(weekTotal * 60)}</span>}
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Flame className="h-4 w-4 text-primary" aria-hidden="true" />
            Today&apos;s Sessions
          </dt>
          <dd className="text-3xl font-semibold tabular-nums">{stats.todaySessions}</dd>
        </div>
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Timer className="h-4 w-4 text-accent" aria-hidden="true" />
            Total Focus Time
          </dt>
          <dd className="text-3xl font-semibold tabular-nums">{formatDuration(stats.totalFocusSeconds)}</dd>
        </div>
      </dl>

      <figure className="rounded-3xl border border-border bg-card p-4">
        <figcaption className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>This week</span>
          <span className="tabular-nums">{formatDuration(weekTotal * 60)} total</span>
        </figcaption>
        <ol className={cn('flex items-end justify-between gap-2', compact ? 'h-24' : 'h-40')} aria-label="Minutes focused per day">
          {stats.weeklyMinutes.map((minutes, i) => {
            const isToday = i === today
            const height = Math.max(4, (minutes / max) * 100)
            return (
              <li key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="sr-only">
                  {weekdayLabels[i]}: {minutes} minutes
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    aria-hidden="true"
                    className={cn(
                      'w-full rounded-full transition-[height] duration-700 ease-out',
                      isToday ? 'bg-brand-gradient shadow-[0_0_16px_var(--glow)]' : 'bg-secondary',
                    )}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className={cn('text-[11px] font-medium', isToday ? 'text-primary' : 'text-muted-foreground')}
                >
                  {weekdayLabels[i]}
                </span>
              </li>
            )
          })}
        </ol>
      </figure>
    </section>
  )
}
