'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePRDStore } from '@/lib/store'
import { QUESTIONS } from '@/lib/questions'
import QuestionCard from '@/components/QuestionCard'
import ProgressBar from '@/components/ProgressBar'
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react'

export default function QuestionnairePage() {
  const router = useRouter()
  const { brief, answers, setAnswer, clearAnswer } = usePRDStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!brief.trim()) router.replace('/')
  }, [brief, router])

  const question = QUESTIONS[currentIndex]
  const answeredCount = Object.keys(answers).length
  const isFirst = currentIndex === 0
  const isLast = currentIndex === QUESTIONS.length - 1

  function handleSelect(value: string) {
    setAnswer(question.id, value)
  }

  function handleSkip() {
    clearAnswer(question.id)
    goNext()
  }

  function goNext() {
    if (isLast) {
      router.push('/generating')
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function goBack() {
    if (isFirst) {
      router.push('/')
    } else {
      setCurrentIndex((i) => i - 1)
    }
  }

  function handleGenerate() {
    router.push('/generating')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent font-mono text-sm">
            <Zap size={14} />
            <span>PRD Generator</span>
          </div>
          <button
            onClick={handleGenerate}
            className="text-xs font-mono text-muted-fg hover:text-accent transition-colors border border-border px-3 py-1.5 rounded"
          >
            Buat PRD sekarang →
          </button>
        </div>

        {/* Progress */}
        <ProgressBar current={answeredCount} total={QUESTIONS.length} />

        {/* Question */}
        <div className="bg-surface border border-border rounded-xl p-6 min-h-[280px] flex flex-col justify-center">
          <div className="text-xs font-mono text-muted-fg mb-6">
            Pertanyaan {currentIndex + 1} dari {QUESTIONS.length}
          </div>
          <QuestionCard
            question={question}
            selected={answers[question.id]}
            onSelect={handleSelect}
            onSkip={handleSkip}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-mono text-muted-fg hover:text-white transition-colors px-4 py-2 rounded-lg border border-border hover:border-muted"
          >
            <ArrowLeft size={14} />
            {isFirst ? 'Kembali ke brief' : 'Sebelumnya'}
          </button>

          <button
            onClick={() => {
              if (answers[question.id]) goNext()
              else handleSkip()
            }}
            className="flex items-center gap-2 text-sm font-mono bg-accent text-black font-semibold px-5 py-2 rounded-lg hover:bg-accent-dim transition-colors"
          >
            {isLast ? 'Buat PRD' : 'Selanjutnya'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </main>
  )
}
