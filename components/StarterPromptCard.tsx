'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface StarterPromptCardProps {
  prompt: string
}

export default function StarterPromptCard({ prompt }: StarterPromptCardProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface hover:bg-white/5 transition-colors text-sm font-mono"
      >
        <span className="text-accent font-semibold">Starter Prompt untuk AI Coding Agent</span>
        {open ? <ChevronUp size={16} className="text-muted-fg" /> : <ChevronDown size={16} className="text-muted-fg" />}
      </button>

      {open && (
        <div className="border-t border-border">
          <pre className="p-4 text-xs font-mono text-muted-fg bg-background whitespace-pre-wrap break-words overflow-x-auto">
            {prompt}
          </pre>
          <div className="border-t border-border px-4 py-2 bg-surface flex justify-end">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-mono text-muted-fg hover:text-white transition-colors"
            >
              {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy prompt'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
