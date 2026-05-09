'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BriefInputProps {
  value: string
  fileName: string | null
  onChange: (text: string, fileName?: string | null) => void
}

export default function BriefInput({ value, fileName, onChange }: BriefInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function readFile(file: File) {
    if (file.type === 'application/pdf') {
      onChange('', file.name)
      alert('PDF parsing is not supported in v1. Please paste your brief as text.')
      return
    }
    const text = await file.text()
    onChange(text, file.name)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) readFile(file)
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) readFile(file)
  }

  function clearFile() {
    onChange('', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !fileName && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-muted',
          fileName && 'cursor-default'
        )}
      >
        {fileName ? (
          <div className="flex items-center justify-center gap-3">
            <FileText size={18} className="text-accent" />
            <span className="font-mono text-sm text-accent">{fileName}</span>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile() }}
              className="text-muted-fg hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload size={24} className="mx-auto text-muted-fg" />
            <p className="text-sm text-muted-fg">
              Drag & drop <span className="text-white">.txt</span> or <span className="text-white">.md</span> file
            </p>
            <p className="text-xs text-muted">or click to browse</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-fg font-mono">atau paste di bawah</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value, null)}
          placeholder="Paste client brief, project description, or any context here…"
          className="w-full min-h-[220px] bg-surface border border-border rounded-lg p-4 font-mono text-sm text-white placeholder:text-muted resize-y focus:outline-none focus:border-accent transition-colors"
          maxLength={10000}
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted font-mono">
          {value.length.toLocaleString()}/10,000
        </div>
      </div>
    </div>
  )
}
