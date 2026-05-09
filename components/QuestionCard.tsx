'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Question } from '@/lib/questions'

interface QuestionCardProps {
  question: Question
  selected: string | undefined
  onSelect: (value: string) => void
  onSkip: () => void
}

export default function QuestionCard({ question, selected, onSelect, onSkip }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{question.text}</h2>

      <div className="grid gap-2">
        {question.options.map((option) => {
          const isSelected = selected === option
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 font-mono text-sm flex items-center justify-between group',
                isSelected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface text-white hover:border-muted hover:bg-white/5'
              )}
            >
              <span>{option}</span>
              {isSelected && <Check size={16} className="text-accent flex-shrink-0" />}
            </button>
          )
        })}
      </div>

      <button
        onClick={onSkip}
        className="text-xs text-muted-fg hover:text-white transition-colors font-mono mt-2"
      >
        ⏭ Lewati pertanyaan ini
      </button>
    </div>
  )
}
