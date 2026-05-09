'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PRDPreviewProps {
  markdown: string
  isStreaming?: boolean
}

export default function PRDPreview({ markdown, isStreaming }: PRDPreviewProps) {
  return (
    <div className="prose-prd">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse align-middle" />
      )}
    </div>
  )
}
