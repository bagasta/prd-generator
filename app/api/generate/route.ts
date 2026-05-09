import { streamText } from 'ai'
import { model } from '@/lib/openrouter'
import { getSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import { Language } from '@/lib/store'

export const runtime = 'edge'

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response('OPENROUTER_API_KEY is not configured', { status: 503 })
  }

  let body: { brief?: unknown; answers?: unknown; language?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const { brief, answers, language } = body

  if (!brief || typeof brief !== 'string' || !brief.trim()) {
    return new Response('Missing or empty brief', { status: 400 })
  }

  if (brief.length > 10_000) {
    return new Response('Brief exceeds 10,000 character limit', { status: 400 })
  }

  const lang: Language = language === 'en' ? 'en' : 'id'

  try {
    const result = await streamText({
      model,
      system: getSystemPrompt(lang),
      messages: [{ role: 'user', content: buildUserPrompt(brief, (answers as Record<string, string>) ?? {}) }],
      maxTokens: 4000,
      onError: () => {}, // swallow stream errors caused by client disconnect
    })

    return result.toTextStreamResponse()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    // Client disconnected mid-stream — not an application error
    if (message === 'aborted' || message.includes('abort')) return new Response(null, { status: 499 })
    return new Response(`AI generation failed: ${message}`, { status: 502 })
  }
}
