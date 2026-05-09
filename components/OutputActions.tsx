'use client'

import { useState } from 'react'
import { Download, Copy, Check, RefreshCw } from 'lucide-react'

interface OutputActionsProps {
  markdown: string
  onReset: () => void
}

export default function OutputActions({ markdown, onReset }: OutputActionsProps) {
  const [copied, setCopied] = useState(false)

  function handleDownload() {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'PRD.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 bg-accent text-black font-semibold py-3 px-4 rounded-lg hover:bg-accent-dim transition-colors text-sm font-mono"
      >
        <Download size={16} />
        Download PRD.md
      </button>

      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 bg-surface border border-border text-white font-mono py-3 px-4 rounded-lg hover:border-muted transition-colors text-sm"
      >
        {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Markdown'}
      </button>

      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 text-muted-fg hover:text-white font-mono py-2 px-4 rounded-lg transition-colors text-sm"
      >
        <RefreshCw size={14} />
        Buat PRD Baru
      </button>
    </div>
  )
}
