'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePRDStore } from '@/lib/store'
import { STARTER_PROMPT } from '@/lib/prompts'
import PRDPreview from '@/components/PRDPreview'
import { Zap } from 'lucide-react'

export default function GeneratingPage() {
  const router = useRouter()
  const { brief, answers, language, setPrdMarkdown, setStarterPrompt, setIsGenerating } = usePRDStore()
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (!brief.trim()) {
      router.replace('/')
      return
    }
    if (started.current) return
    started.current = true

    const controller = new AbortController()

    async function generate() {
      setIsGenerating(true)
      setIsStreaming(true)

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brief, answers, language }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(errText || `API error ${res.status}`)
        }
        if (!res.body) throw new Error('Empty response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk
          setStreamedText(fullText)
        }

        // Flush any remaining bytes from decoder
        const tail = decoder.decode()
        if (tail) { fullText += tail; setStreamedText(fullText) }

        if (!fullText.trim()) throw new Error('AI returned empty response — cek API key & model di .env.local')

        setPrdMarkdown(fullText)
        setStarterPrompt(STARTER_PROMPT)
        setIsGenerating(false)
        setIsStreaming(false)
        router.push('/result')
      } catch (err) {
        const e = err as Error
        // Silently ignore aborts — happens when browser navigates away after stream completes
        if (e.name === 'AbortError' || e.message === 'aborted' || e.message === 'BodyStreamBuffer was aborted') return
        console.error('Generation error:', e)
        setIsGenerating(false)
        setIsStreaming(false)
        alert(`Gagal generate PRD: ${e.message}`)
        router.push('/questionnaire')
      }
    }

    generate()

    return () => {
      // Only abort on actual unmount, not strict mode double-invoke
      // We use started.current to prevent re-entry, so this is safe
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="min-h-screen flex flex-col px-4 py-12">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent font-mono text-sm">
            <Zap size={14} />
            <span>PRD Generator</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-fg">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            Generating PRD…
          </div>
        </div>

        {/* Streaming preview */}
        <div className="bg-surface border border-border rounded-xl p-6 min-h-[60vh] overflow-y-auto">
          {streamedText ? (
            <PRDPreview markdown={streamedText} isStreaming={isStreaming} />
          ) : (
            <div className="flex items-center gap-3 text-muted-fg font-mono text-sm py-8">
              <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
              <span>Menghubungi AI…</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-fg font-mono text-center">
          Jangan tutup halaman ini. PRD sedang di-generate secara real-time.
        </p>
      </div>
    </main>
  )
}
