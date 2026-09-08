'use client'

import { useState } from 'react'
import { ActiveSession } from './active-session'
import { BottomNav, type Tab } from './bottom-nav'
import { FocusHome } from './focus-home'
import { SettingsView, type Settings } from './settings-view'
import { StatsSection } from './stats-section'
import type { FocusPlan, PlanSource, PlanStep } from './focus-home'
import { initialStats, todayIndex, type FocusStats } from '../lib/focus-stats'

export function DeepFocusApp() {
  const [tab, setTab] = useState<Tab>('home')
  const [plan, setPlan] = useState<FocusPlan | null>(null)
  const [planSource, setPlanSource] = useState<PlanSource>('ai')
  const [steps, setSteps] = useState<Array<PlanStep & { done?: boolean }>>([])
  const [inSession, setInSession] = useState(false)
  const [stats, setStats] = useState<FocusStats>(initialStats)
  const [settings, setSettings] = useState<Settings>({
    sessionMinutes: 25,
    distractionAlerts: true,
    autoAdvanceSteps: false,
  })

  function handlePlanGenerated(next: FocusPlan, source: PlanSource) {
  setPlan(next)
  setPlanSource(source)
  const formattedSteps = next?.steps ? next.steps.map((s: PlanStep, idx: number) => ({ ...s, id: s.id || String(idx), done: false })) : []
  setSteps(formattedSteps)
  setTab('home')
}

  function toggleStep(index: number) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, done: !s.done } : s)))
  }

  function completeStep(index: number) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, done: true } : s)))
  }

  function finishSession(focusedSeconds: number, completed: boolean) {
    setInSession(false)
    if (focusedSeconds < 10) return // تعديل بسيط لضمان تسجيل الجلسات حتى لو جربتيها سريعاً بالديمو
    
    setStats((prev) => {
      const weekly = [...prev.weeklyMinutes]
      const currentDay = todayIndex()
      weekly[currentDay] = (weekly[currentDay] || 0) + Math.round(focusedSeconds / 60)
      
      return {
        ...prev,
        todaySessions: (prev.todaySessions || 0) + (completed ? 1 : 1), // تحسب السيشن دائماً عند إنتهائها لضمان التفاعل السريع
        totalFocusSeconds: prev.totalFocusSeconds + focusedSeconds,
        weeklyMinutes: weekly,
      }
    })
  }

  const activeSessionSteps = steps.map(({ done, ...step }) => {
    const normalizedStep = step as any

    return {
      ...normalizedStep,
      label: normalizedStep.label ?? normalizedStep.title ?? 'Step',
      minutes: Number(normalizedStep.minutes ?? normalizedStep.duration ?? 0),
      completed: normalizedStep.completed ?? false,
    }
  })

  if (inSession && plan) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-10">
        <ActiveSession
          title={plan.title}
          steps={activeSessionSteps}
          durationSeconds={settings.sessionMinutes * 60}
          alertsEnabled={settings.distractionAlerts}
          autoAdvance={settings.autoAdvanceSteps}
          onCompleteStep={completeStep}
          onFinish={finishSession}
        />
      </main>
    )
  }

  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-28">
        {tab === 'home' && (
          <FocusHome
            plan={plan}
            planSource={planSource}
            steps={steps}
            stats={stats as any}
            onPlanGenerated={handlePlanGenerated}
            onToggleStep={toggleStep}
            onStart={() => {
              if (plan && steps.length > 0) {
                setInSession(true)
              } else {
                alert('Please generate a focus plan first!')
              }
            }}
          />
        )}
        {tab === 'stats' && (
          <div className="pt-4">
            <StatsSection stats={stats as any} />
          </div>
        )}
        {tab === 'settings' && <SettingsView settings={settings} onChange={setSettings} />}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </>
  )
}