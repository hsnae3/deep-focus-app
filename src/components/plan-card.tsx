'use client'

import { Check, Clock, Lightbulb, Play, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import type { FocusPlan, PlanSource, PlanStep } from '../lib/focus-plan'

type PlanCardProps = {
  plan: FocusPlan
  source: PlanSource
  steps: PlanStep[]
  onToggleStep: (index: number) => void
  onStart: () => void
}

export function PlanCard({ plan, source, steps, onToggleStep, onStart }: PlanCardProps) {
  const completed = steps.filter((s) => s.done).length

  return (
    <section
      aria-labelledby="plan-title"
      className="animate-rise rounded-3xl border border-border bg-card p-5 shadow-[0_20px_60px_-30px_var(--glow)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {source === 'ai' ? 'AI focus plan' : 'Quick-start plan · AI unavailable'}
          </span>
          <h2 id="plan-title" className="text-xl font-semibold leading-tight text-balance">
            {plan.title}
          </h2>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
          <Clock className="h-4 w-4 text-accent" aria-hidden="true" />
          {plan.durationMinutes} min
        </span>
      </div>

      <ol className="mt-5 flex flex-col gap-2" aria-label="Plan steps">
        {steps.map((step, i) => (
          <li key={`${step.label}-${i}`} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <label
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-secondary/60 px-3 py-3 transition-colors hover:bg-secondary',
                step.done && 'bg-secondary/30',
              )}
            >
              <input
                type="checkbox"
                className="peer sr-only"
                checked={step.done}
                onChange={() => onToggleStep(i)}
              />
              <span
                aria-hidden="true"
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
                  step.done ? 'border-transparent bg-brand-gradient scale-100' : 'border-muted-foreground/50',
                )}
              >
                <Check
                  className={cn('h-3.5 w-3.5 text-primary-foreground transition-transform', step.done ? 'scale-100' : 'scale-0')}
                  strokeWidth={3}
                />
              </span>
              <span
                className={cn(
                  'flex-1 text-sm leading-snug transition-colors',
                  step.done ? 'text-muted-foreground line-through' : 'text-foreground',
                )}
              >
                {step.label}
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">{step.minutes}m</span>
            </label>
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-start gap-2 rounded-2xl bg-accent/10 px-3 py-2.5 text-sm leading-relaxed text-foreground/90">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        {plan.tip}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-xs text-muted-foreground">
          {completed}/{steps.length} steps done
        </span>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:brightness-110 active:scale-95"
        >
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          Start Session
        </button>
      </div>
    </section>
  )
}
