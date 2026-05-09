import { describe, it, expect } from 'vitest'
import { buildUserPrompt, getSystemPrompt, STARTER_PROMPT } from '@/lib/prompts'

describe('buildUserPrompt', () => {
  it('includes brief text', () => {
    const result = buildUserPrompt('Build a todo app', {})
    expect(result).toContain('Build a todo app')
  })

  it('includes answered questions in context', () => {
    const result = buildUserPrompt('brief', { target_audience: 'B2C', product_type: 'Web app' })
    expect(result).toContain('target_audience')
    expect(result).toContain('B2C')
    expect(result).toContain('product_type')
    expect(result).toContain('Web app')
  })

  it('omits questionnaire section when no answers', () => {
    const result = buildUserPrompt('brief', {})
    expect(result).not.toContain('Additional Context')
  })

  it('does not include skipped questions (empty answers object)', () => {
    const result = buildUserPrompt('brief', { product_type: 'API' })
    expect(result).not.toContain('target_audience')
  })
})

describe('getSystemPrompt', () => {
  it('EN prompt instructs output-only markdown', () => {
    expect(getSystemPrompt('en')).toContain('Output ONLY valid Markdown')
  })

  it('EN prompt requires all 12 PRD sections', () => {
    expect(getSystemPrompt('en')).toContain('Project Overview')
    expect(getSystemPrompt('en')).toContain('Milestones')
  })

  it('ID prompt is in Indonesian', () => {
    expect(getSystemPrompt('id')).toContain('Gambaran Proyek')
    expect(getSystemPrompt('id')).toContain('Milestone')
  })

  it('ID prompt instructs markdown-only output', () => {
    expect(getSystemPrompt('id')).toContain('HANYA markdown')
  })

  it('both prompts include Target Users section', () => {
    expect(getSystemPrompt('en')).toContain('Target Users')
    expect(getSystemPrompt('id')).toContain('Target Pengguna')
  })
})

describe('STARTER_PROMPT', () => {
  it('references PRD.md', () => {
    expect(STARTER_PROMPT).toContain('@PRD.md')
  })

  it('instructs summarize before coding', () => {
    expect(STARTER_PROMPT).toContain('summarizing')
  })
})
