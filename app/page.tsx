'use client'

import { useRouter } from 'next/navigation'
import { usePRDStore } from '@/lib/store'
import BriefInput from '@/components/BriefInput'
import { ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const { brief, briefFileName, language, setBrief, setLanguage } = usePRDStore()

  const canContinue = brief.trim().length > 0

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-accent font-mono text-sm">
            <Zap size={14} />
            <span>PRD Generator</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            From brief to{' '}
            <span className="text-accent font-mono">PRD.md</span>{' '}
            in minutes
          </h1>
          <p className="text-muted-fg text-sm leading-relaxed">
            Paste your client brief or project description. We'll generate a production-ready PRD
            ready for Claude Code, Codex, or any AI coding agent.
          </p>
        </div>

        {/* Language picker */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-fg">Bahasa PRD output:</span>
          <div className="flex gap-1 bg-surface border border-border rounded-lg p-1">
            {(['id', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  'px-3 py-1 rounded text-xs font-mono font-semibold transition-colors',
                  language === lang
                    ? 'bg-accent text-black'
                    : 'text-muted-fg hover:text-white'
                )}
              >
                {lang === 'id' ? '🇮🇩 Indonesia' : '🇺🇸 English'}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <BriefInput
          value={brief}
          fileName={briefFileName}
          onChange={(text, fileName) => setBrief(text, fileName)}
        />

        {/* CTA */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push('/questionnaire')}
            disabled={!canContinue}
            className="flex items-center gap-2 bg-accent text-black font-semibold py-3 px-6 rounded-lg hover:bg-accent-dim transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-mono text-sm"
          >
            Lanjutkan
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 pt-2">
          {['Brief', 'Questionnaire', 'Generate', 'Result'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${i === 0 ? 'bg-accent text-black' : 'bg-surface border border-border text-muted-fg'}`}>
                {i + 1}
              </div>
              <span className={`text-xs font-mono ${i === 0 ? 'text-white' : 'text-muted-fg'}`}>{label}</span>
              {i < 3 && <div className="w-4 h-px bg-border" />}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
