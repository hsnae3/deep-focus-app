'use client'

import { useState } from 'react'
import { X, Sparkles, Check, Zap } from 'lucide-react'

type PaywallModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function PaywallModal({ isOpen, onClose, onSubscribe }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 text-white">
        
        {/* زر إغلاق النافذة */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 mb-1">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Upgrade to Deep Focus Pro</h2>
          <p className="text-zinc-400 text-sm">
            Unlock unlimited AI-powered task breakdowns and supercharge your productivity.
          </p>
        </div>

        {/* قائمة الباقات وأسعارها */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`p-3.5 rounded-xl border text-left transition relative ${
              selectedPlan === 'monthly'
                ? 'bg-zinc-900 border-white text-white'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Monthly</div>
            <div className="text-lg font-bold text-white mt-1">$4.99 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
          </button>

          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`p-3.5 rounded-xl border text-left transition relative ${
              selectedPlan === 'yearly'
                ? 'bg-zinc-900 border-white text-white'
                : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
              Save 40%
            </span>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Yearly</div>
            <div className="text-lg font-bold text-white mt-1">$2.99 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
          </button>
        </div>

        {/* قائمة الميزات */}
        <div className="space-y-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Unlimited AI Focus Plans & Smart Breakdowns</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Advanced Task Analytics & History Stats</span>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Managed securely via RevenueCat Billing SDK</span>
          </div>
        </div>

        {/* زر إتمام الشراء */}
        <button
          onClick={() => {
            onSubscribe()
            onClose()
          }}
          className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg text-sm"
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          Subscribe ({selectedPlan === 'monthly' ? '$4.99/mo' : '$35.88/yr'})
        </button>

        <p className="text-center text-[11px] text-zinc-500">
          Cancel anytime. Powered by RevenueCat for Ship-A-Ton Hackathon.
        </p>

      </div>
    </div>
  )
}