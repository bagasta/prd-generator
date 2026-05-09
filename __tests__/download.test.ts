import { describe, it, expect, vi, beforeEach } from 'vitest'

// Test the download logic in isolation
function downloadMarkdown(markdown: string, filename = 'PRD.md') {
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

describe('downloadMarkdown', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it('creates a blob URL and triggers download', () => {
    downloadMarkdown('# PRD Content')
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('sets correct download filename', () => {
    let capturedDownload = ''
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      capturedDownload = this.download
    })
    downloadMarkdown('# PRD', 'PRD.md')
    expect(capturedDownload).toBe('PRD.md')
  })

  it('fails silently if markdown is empty (no crash)', () => {
    expect(() => downloadMarkdown('')).not.toThrow()
  })
})
