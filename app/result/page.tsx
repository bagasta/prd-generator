'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePRDStore } from '@/lib/store'
import PRDPreview from '@/components/PRDPreview'
import OutputActions from '@/components/OutputActions'
import StarterPromptCard from '@/components/StarterPromptCard'
import { Zap } from 'lucide-react'

export default function ResultPage() {
  const router = useRouter()
  const { prdMarkdown, starterPrompt, reset } = usePRDStore()

  useEffect(() => {
    if (!prdMarkdown) router.replace('/')
  }, [prdMarkdown, router])

  function handleReset() {
    reset()
    router.push('/')
  }

  if (!prdMarkdown) return null

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent font-mono text-sm">
            <Zap size={14} />
            <span>PRD Generator</span>
          </div>
          <div className="text-xs font-mono text-muted-fg">
            PRD siap!
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Markdown preview */}
          <div className="flex-1 bg-surface border border-border rounded-xl p-6 overflow-y-auto max-h-[80vh]">
            <PRDPreview markdown={prdMarkdown} />
          </div>

          {/* Right: Actions */}
          <div className="lg:w-72 space-y-4 flex-shrink-0">
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white font-mono mb-4">Actions</h3>
              <OutputActions markdown={prdMarkdown} onReset={handleReset} />
            </div>

            <StarterPromptCard prompt={starterPrompt} />

            <div className="bg-surface border border-border rounded-xl p-4 text-xs font-mono text-muted-fg space-y-1">
              <p className="text-white font-semibold mb-2">Cara pakai starter prompt:</p>
              <p>1. Download PRD.md ke folder proyek</p>
              <p>2. Copy starter prompt</p>
              <p>3. Paste ke Claude Code / Codex</p>
              <p>4. Mulai build!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
