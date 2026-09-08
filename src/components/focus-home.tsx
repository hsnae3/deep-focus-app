'use client'

import { useState } from 'react'
import { Loader2, Sparkles, Crown } from 'lucide-react'
import { StatsSection } from './stats-section'
import { PaywallModal } from './paywall-modal'

// `FocusStats` is used only for the component props here, so keep the type local
// instead of depending on a missing module path.
// `StatsSection` expects these fields to exist, so define them explicitly here.
type FocusStats = {
  todaySessions: number
  totalFocusSeconds: number
  weeklyMinutes: number[]
}

export type PlanSource = 'ai' | 'template'

export interface PlanStep {
  id: string
  title: string
  duration: string
  completed?: boolean
  done?: boolean
}

export interface FocusPlan {
  title: string
  description: string
  steps: PlanStep[]
}

type FocusHomeProps = {
  plan: FocusPlan | null
  planSource: PlanSource
  steps: PlanStep[]
  stats: FocusStats
  onPlanGenerated: (plan: FocusPlan, source: PlanSource) => void
  onToggleStep: (index: number) => void
  onStart: () => void
}

const suggestions = ['Write the Q3 report intro', 'Refactor the auth module', 'Study chapter 4 for the exam']

export function FocusHome({ plan, planSource, steps, stats, onPlanGenerated, onToggleStep, onStart }: FocusHomeProps) {
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)

  async function generate(input: string) {
    const trimmed = input.trim()
    if (trimmed.length < 3 || loading) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')

      onPlanGenerated(data as FocusPlan, 'ai')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong'
      setError(msg)
      setShowPaywall(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      
      <div className="flex justify-between items-center bg-zinc-900/60 border border-zinc-800/80 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          RevenueCat SDK Active
        </div>
        <button
          onClick={() => setShowPaywall(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-xs px-3 py-1.5 rounded-xl transition shadow-lg"
        >
          <Crown className="w-3.5 h-3.5 fill-black" />
          Upgrade to Pro
        </button>
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-white">What are you working on today?</h1>
        <p className="text-zinc-400">Enter your goal and let AI break it down into focused steps.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g. Finish the landing page copy and ship it"
            className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
          />
        </div>

        {error && (
          <div className="flex items-center justify-between bg-red-950/40 border border-red-800/50 p-3 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
            <button 
              onClick={() => setShowPaywall(true)}
              className="text-xs bg-white text-black px-3 py-1.5 rounded-lg font-medium hover:bg-zinc-200 transition"
            >
              View Paywall
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                setTask(suggestion)
                generate(suggestion)
              }}
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-full px-3 py-1.5 transition"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (task && task.trim().length > 0) {
              generate(task)
            } else {
              generate("Write the Q3 report intro")
            }
          }}
          disabled={loading}
          className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Generate Focus Plan
        </button>

        {/* تم نقل الخطة لتظهر مباشرة هنا تحت زر التوليد */}
       {plan && (
  <div className="mt-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 shadow-xl backdrop-blur-md transition-all">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-white">{plan.title}</h2>
      <p className="text-sm text-zinc-400 mt-1">{plan.description}</p>
    </div>

    <div className="space-y-3 mt-4">
      {plan.steps && plan.steps.map((step: any, index: number) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
          <span className="text-sm font-medium text-zinc-200">{step.title}</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold">{step.duration}</span>
        </div>
      ))}
    </div>

    {onStart && (
      <button
        onClick={onStart}
        className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
      >
        Start Focus Session
      </button>
    )}
  </div>
)}

        <StatsSection stats={stats} />

        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          onSubscribe={() => {
            alert('RevenueCat Subscription Activated Successfully!')
            setShowPaywall(false)
          }}
        />
      </div>
    </div>
  )
}