# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI-powered PRD generator for vibe coders. Users paste a client brief + answer an optional questionnaire → AI streams a production-ready `PRD.md` + starter prompt for coding agents.

Full spec: `PRD.md` (reference with `@PRD.md`).

## Setup

```bash
npx create-next-app@latest prd-generator --typescript --tailwind --app
cd prd-generator
npx shadcn-ui@latest init
npm install zustand ai @ai-sdk/openai react-markdown remark-gfm lucide-react
```

Required `.env.local`:
```
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=tencent/hy3-preview
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Dev Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

## Architecture

**4-step flow, state in Zustand (in-memory, no persistence):**
- `/` → Brief input (upload .txt/.md or paste)
- `/questionnaire` → 8 optional questions, one per slide
- `/generating` → streams AI response via Vercel AI SDK
- `/result` → rendered markdown preview + download/copy actions

**Key files:**
- `lib/store.ts` — Zustand store: `{ brief, answers, prdMarkdown, starterPrompt, isGenerating }`
- `lib/openrouter.ts` — `createOpenAI` with custom baseURL pointing to OpenRouter
- `lib/prompts.ts` — system prompt + `buildUserPrompt(brief, answers)`
- `lib/questions.ts` — questionnaire data (8 questions, each with skip option)
- `app/api/generate/route.ts` — Edge runtime, `streamText` → `toDataStreamResponse()`

**AI integration:** OpenRouter with OpenAI-compatible endpoint. Vercel AI SDK `useCompletion` hook streams tokens to UI. Default model: `tencent/hy3-preview`, swappable via `OPENROUTER_MODEL` env var.

**Design:** Dark mode default (`#0a0a0a` bg, `#00ff88` accent), JetBrains Mono for content, Inter for UI.

## Constraints

- `OPENROUTER_API_KEY` must never reach the client — API route only
- Brief input capped at 10,000 characters (validate in API route)
- Skipped questionnaire answers are excluded from AI context entirely (don't send as "skipped")
- API route uses Edge runtime (`export const runtime = 'edge'`)
