'use client';
import { useState } from 'react';

export default function Page() {
  const [goal, setGoal] = useState('Write the Q3 report intro');
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan({
        title: `Focus Plan: ${goal}`,
        summary: `A high-performance ${hours}-hour execution roadmap to smash your target.`,
        steps: [
          { title: "Define Core Scope", duration: "15 mins", description: "Outline key deliverables and requirements." },
          { title: "Deep Work Execution", duration: "45 mins", description: "Build out the primary components with absolute focus." },
          { title: "Review & Polish", duration: "20 mins", description: "Test everything, fix edge cases, and finalize." }
        ]
      });
      setLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">What are you working on today?</h1>
          <p className="text-zinc-400">Enter your goal and let AI break it down into focused steps.</p>
        </div>

        <div className="bg-[#141414] border border-zinc-800 rounded-xl p-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-transparent text-white resize-none outline-none h-24 text-lg"
            placeholder="What's your main goal?"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Generating Plan...' : '✨ Generate Focus Plan'}
        </button>

        {plan && (
          <div className="bg-[#141414] border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-emerald-400">{plan.title}</h2>
            <p className="text-zinc-300 text-sm">{plan.summary}</p>
            <div className="space-y-3 mt-4">
              {plan.steps.map((step: any, index: number) => (
                <div key={index} className="bg-black/40 border border-zinc-800/80 p-3.5 rounded-lg flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{index + 1}. {step.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1">{step.description}</p>
                  </div>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">{step.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
