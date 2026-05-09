import { describe, it, expect, beforeEach } from 'vitest'
import { usePRDStore } from '@/lib/store'

beforeEach(() => {
  usePRDStore.getState().reset()
})

describe('PRDStore', () => {
  it('stores brief and fileName', () => {
    usePRDStore.getState().setBrief('my brief', 'brief.md')
    const { brief, briefFileName } = usePRDStore.getState()
    expect(brief).toBe('my brief')
    expect(briefFileName).toBe('brief.md')
  })

  it('stores answer by questionId', () => {
    usePRDStore.getState().setAnswer('target_audience', 'B2C')
    expect(usePRDStore.getState().answers['target_audience']).toBe('B2C')
  })

  it('clears individual answer on skip', () => {
    usePRDStore.getState().setAnswer('target_audience', 'B2C')
    usePRDStore.getState().clearAnswer('target_audience')
    expect(usePRDStore.getState().answers['target_audience']).toBeUndefined()
  })

  it('stores prdMarkdown', () => {
    usePRDStore.getState().setPrdMarkdown('# My PRD\n\nContent here')
    expect(usePRDStore.getState().prdMarkdown).toBe('# My PRD\n\nContent here')
  })

  it('stores starterPrompt', () => {
    usePRDStore.getState().setStarterPrompt('my starter prompt')
    expect(usePRDStore.getState().starterPrompt).toBe('my starter prompt')
  })

  it('reset clears all state', () => {
    usePRDStore.getState().setBrief('brief', 'file.md')
    usePRDStore.getState().setAnswer('q1', 'A')
    usePRDStore.getState().setPrdMarkdown('# PRD')
    usePRDStore.getState().reset()
    const state = usePRDStore.getState()
    expect(state.brief).toBe('')
    expect(state.briefFileName).toBeNull()
    expect(state.answers).toEqual({})
    expect(state.prdMarkdown).toBe('')
  })
})
