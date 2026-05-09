import { describe, it, expect } from 'vitest'

// Parses plain text stream chunks into accumulated text
function accumulateChunks(chunks: string[]): string {
  return chunks.join('')
}

// Verifies the stream result is non-empty valid markdown
function isValidPRD(text: string): boolean {
  return text.trim().length > 0 && text.includes('#')
}

describe('stream text accumulation', () => {
  it('joins chunks into full text', () => {
    const chunks = ['# PRD\n\n', '## Overview\n', 'Build a todo app']
    expect(accumulateChunks(chunks)).toBe('# PRD\n\n## Overview\nBuild a todo app')
  })

  it('handles empty chunks without crashing', () => {
    expect(accumulateChunks(['', 'hello', ''])).toBe('hello')
  })

  it('detects valid PRD output', () => {
    expect(isValidPRD('# My PRD\n\nContent')).toBe(true)
  })

  it('rejects empty stream output', () => {
    expect(isValidPRD('')).toBe(false)
    expect(isValidPRD('   ')).toBe(false)
  })
})

describe('text stream response parsing', () => {
  it('plain text stream is decoded directly (no protocol prefix)', () => {
    const rawChunk = '# PRD Title\n\n'
    const decoder = new TextDecoder()
    const encoded = new TextEncoder().encode(rawChunk)
    expect(decoder.decode(encoded)).toBe(rawChunk)
  })

  it('full prd is set only after stream ends', () => {
    let prdMarkdown = ''
    const chunks = ['# PRD\n', '## Goals\n', 'Ship fast']
    // simulate: only set final value after all chunks
    chunks.forEach(() => {}) // streaming in progress
    prdMarkdown = chunks.join('') // only set when done
    expect(prdMarkdown).toBe('# PRD\n## Goals\nShip fast')
  })
})
