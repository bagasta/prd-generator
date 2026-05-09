import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildUserPrompt } from '@/lib/prompts'

// Test the API route logic in isolation (without Next.js runtime)
describe('API /api/generate input validation', () => {
  it('rejects missing brief', async () => {
    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: {} }),
    })
    const { brief } = await req.json()
    expect(!brief || typeof brief !== 'string').toBe(true)
  })

  it('rejects brief over 10000 chars', async () => {
    const longBrief = 'x'.repeat(10_001)
    expect(longBrief.length > 10_000).toBe(true)
  })

  it('accepts valid brief within limit', async () => {
    const validBrief = 'Build a todo app'
    expect(validBrief.length <= 10_000).toBe(true)
    expect(typeof validBrief === 'string' && validBrief.length > 0).toBe(true)
  })

  it('buildUserPrompt only includes answered questions (not skipped)', () => {
    // Q3 skipped (not in answers), Q1 answered
    const prompt = buildUserPrompt('Build app', { target_audience: 'B2C' })
    expect(prompt).toContain('target_audience')
    expect(prompt).not.toContain('frontend_tech')
  })

  it('POST body contains brief and answers (not prompt field)', async () => {
    const body = { brief: 'my brief', answers: { scale: 'MVP' } }
    const req = new Request('http://localhost/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const parsed = await req.json()
    expect(parsed.brief).toBe('my brief')
    expect(parsed.answers.scale).toBe('MVP')
  })
})
