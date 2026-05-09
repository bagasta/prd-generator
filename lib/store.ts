import { create } from 'zustand'

export type Language = 'id' | 'en'

interface PRDStore {
  brief: string
  briefFileName: string | null
  answers: Record<string, string>
  language: Language
  prdMarkdown: string
  starterPrompt: string
  isGenerating: boolean
  setBrief: (brief: string, fileName?: string | null) => void
  setAnswer: (questionId: string, answer: string) => void
  clearAnswer: (questionId: string) => void
  setLanguage: (lang: Language) => void
  setPrdMarkdown: (markdown: string) => void
  setStarterPrompt: (prompt: string) => void
  setIsGenerating: (v: boolean) => void
  reset: () => void
}

const initialState = {
  brief: '',
  briefFileName: null,
  answers: {},
  language: 'id' as Language,
  prdMarkdown: '',
  starterPrompt: '',
  isGenerating: false,
}

export const usePRDStore = create<PRDStore>((set) => ({
  ...initialState,
  setBrief: (brief, fileName = null) => set({ brief, briefFileName: fileName }),
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  clearAnswer: (questionId) =>
    set((state) => {
      const next = { ...state.answers }
      delete next[questionId]
      return { answers: next }
    }),
  setLanguage: (language) => set({ language }),
  setPrdMarkdown: (prdMarkdown) => set({ prdMarkdown }),
  setStarterPrompt: (starterPrompt) => set({ starterPrompt }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  reset: () => set(initialState),
}))
