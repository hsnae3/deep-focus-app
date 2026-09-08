'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import { ArrowRight, Eye, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFocusSound } from '@/hooks/use-focus-sound'
import { formatClock } from '@/lib/focus-stats'
import type { PlanStep } from '@/lib/focus-plan'

type ActiveSessionProps = {
  title: string
  steps: PlanStep[]
  durationSeconds: number
  alertsEnabled: boolean
  autoAdvance: boolean
  onCompleteStep: (index: number) => void
  onFinish: (focusedSeconds: number, completed: boolean) => void
}

const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ActiveSession({
  title,
  steps,
  durationSeconds,
  alertsEnabled,
  autoAdvance,
  onCompleteStep,
  onFinish,
}: ActiveSessionProps) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const [running, setRunning] = useState(true)
  const [distractions, setDistractions] = useState(0)
  const [alertVisible, setAlertVisible] = useState(false)
  const sound = useFocusSound()

  const elapsed = durationSeconds - remaining
  const progress = elapsed / durationSeconds
  const currentIndex = steps.findIndex((s) => !s.done)
  const currentStep = currentIndex === -1 ? null : steps[currentIndex]

  const finish = useEffectEvent((completed: boolean) => onFinish(durationSeconds - remaining, completed))

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id)
          setRunning(false)
          queueMicrotask(() => finish(true))
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  const onHidden = useEffectEvent(() => {
    if (!running || !alertsEnabled) return
    setDistractions((d) => d + 1)
    setAlertVisible(true)
  })

  const advanceIfOverBudget = useEffectEvent(() => {
    if (!autoAdvance || currentIndex === -1) return
    const budgetSeconds = steps.slice(0, currentIndex + 1).reduce((sum, s) => sum + s.minutes * 60, 0)
    if (elapsed >= budgetSeconds) onCompleteStep(currentIndex)
  })

  useEffect(() => {
    advanceIfOverBudget()
  }, [elapsed])

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'hidden') onHidden()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    if (!alertVisible) return
    const id = window.setTimeout(() => setAlertVisible(false), 5000)
    return () => window.clearTimeout(id)
  }, [alertVisible])

  return (
    <div className="animate-rise flex flex-col items-center gap-8 pt-4">
      <header className="flex flex-col items-center gap-1 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {running ? 'In session' : remaining === 0 ? 'Complete' : 'Paused'}
        </p>
        <h1 className="text-xl font-semibold text-balance">{title}</h1>
      </header>

      <div className="relative flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            'absolute h-64 w-64 rounded-full bg-brand-gradient opacity-40 blur-3xl',
            running && 'animate-breathe',
          )}
        />
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          role="img"
          aria-label={`${formatClock(remaining)} remaining`}
          className="relative -rotate-90"
        >
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          <circle cx="140" cy="140" r={RADIUS} fill="var(--card)" stroke="var(--secondary)" strokeWidth="10" />
          <circle
            cx="140"
            cy="140"
            r={RADIUS}
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center gap-1">
          <span className="text-6xl font-semibold tabular-nums tracking-tight" aria-hidden="true">
            {formatClock(remaining)}
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(progress * 100)}% done</span>
        </div>
      </div>

      <section aria-label="Current step" className="w-full rounded-3xl border border-border bg-card p-4">
        {currentStep ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs font-medium text-primary">
                Step {currentIndex + 1} of {steps.length}
              </span>
              <p className="truncate text-base font-medium">{currentStep.label}</p>
            </div>
            <button
              type="button"
              onClick={() => onCompleteStep(currentIndex)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary/20 hover:text-primary"
            >
              Done
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">All steps done. Ride out the timer or stop early.</p>
        )}
      </section>

      <div className="grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={sound.enabled}
          onClick={sound.toggle}
          className={cn(
            'flex items-center gap-3 rounded-3xl border p-4 text-left transition-colors',
            sound.enabled ? 'border-primary/50 bg-primary/15' : 'border-border bg-card hover:bg-secondary/60',
          )}
        >
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-full', sound.enabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}>
            {sound.enabled ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">Focus Sound</span>
            <span className="text-xs text-muted-foreground">{sound.enabled ? 'Brown noise on' : 'Off'}</span>
          </span>
        </button>

        <div
          className={cn(
            'flex items-center gap-3 rounded-3xl border p-4 transition-colors',
            alertVisible ? 'border-destructive/60 bg-destructive/10' : 'border-border bg-card',
          )}
        >
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-full', alertVisible ? 'bg-destructive text-background' : 'bg-secondary text-accent')}>
            <Eye className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">Distraction Alert</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {distractions === 0 ? 'Watching tabs' : `${distractions} tab switch${distractions === 1 ? '' : 'es'}`}
            </span>
          </span>
        </div>
      </div>

      <div role="status" aria-live="polite" className="min-h-6 text-center text-sm">
        {alertVisible && (
          <span className="animate-rise inline-block rounded-full bg-destructive/15 px-4 py-1.5 font-medium text-destructive">
            You left the tab. Back to it!
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => finish(false)}
          aria-label="Stop session"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive active:scale-95"
        >
          <Square className="h-5 w-5 fill-current" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={remaining === 0}
          aria-label={running ? 'Pause session' : 'Resume session'}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          {running ? (
            <Pause className="h-8 w-8 fill-current" aria-hidden="true" />
          ) : (
            <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
          )}
        </button>
        <div className="h-14 w-14" aria-hidden="true" />
      </div>
    </div>
  )
}
