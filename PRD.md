# PRD: AI-Powered PRD Generator for Vibe Coders

**Version:** 1.0.0  
**Status:** Ready for Development  
**Last Updated:** 2025-05-09  
**Target Deployment:** Vercel (Static + Serverless Functions)

---

## 1. Overview

### 1.1 Product Summary

A lightweight, web-based tool that helps vibe coders generate production-ready `PRD.md` files by combining a client brief with structured questionnaire answers, processed by an AI agent. The output is a clean, structured PRD plus a ready-to-use first prompt for AI coding agents (Codex, Claude Code, etc.).

### 1.2 Problem Statement

Vibe coders often jump straight into building without a structured plan. AI coding agents like Claude Code or Codex perform significantly better when given a clear, well-structured PRD. Writing a PRD from scratch is tedious, especially for solo developers or freelancers working with client briefs.

### 1.3 Solution

A 3-step guided flow:
1. Upload or paste a client brief
2. Answer an optional multiple-choice questionnaire to enrich context
3. AI generates a production-ready `PRD.md` + a starter prompt for the coding agent

### 1.4 Target Users

- Solo developers / freelancers working with client briefs
- Vibe coders who want to use AI coding agents (Claude Code, Codex, Cursor, etc.)
- Small dev teams wanting quick project documentation
- Technical PMs who need a fast PRD scaffold

---

## 2. Goals & Success Metrics

### 2.1 Goals

| # | Goal | Priority |
|---|------|----------|
| G1 | Users can generate a PRD.md in under 5 minutes | P0 |
| G2 | Output PRD is production-grade and usable without editing | P0 |
| G3 | Site is deployable on Vercel with zero backend infra | P0 |
| G4 | All questionnaire steps are optional (no blockers) | P1 |
| G5 | Output includes a ready-to-use agent starter prompt | P1 |

### 2.2 Success Metrics

- Time-to-PRD: < 5 minutes from landing to download
- PRD quality: Usable without manual edits in >80% of cases (user-reported)
- Completion rate: >70% of users who start the flow reach the output step
- Skip rate on questionnaire: tracked per-question to identify friction points

---

## 3. Tech Stack

### 3.1 Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14 (App Router)** | SSR/SSG + API routes, Vercel-native |
| Styling | **Tailwind CSS v3** | Utility-first, zero runtime CSS |
| UI Components | **shadcn/ui** | Accessible, unstyled, composable |
| State Management | **Zustand** | Lightweight, no boilerplate |
| Markdown Rendering | **react-markdown + remark-gfm** | Preview PRD output in-browser |
| File Download | Native `Blob` + `URL.createObjectURL` | No dependencies needed |
| Icons | **Lucide React** | Consistent, lightweight |

### 3.2 Backend / API

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| API Route | **Next.js API Route** (`/api/generate`) | Serverless, Vercel-native |
| AI Provider | **OpenRouter API** | Unified gateway — swap models without code changes |
| Default Model | `tencent/hy3-preview` | Best instruction-following for structured docs; swappable via env var |
| Streaming | Vercel AI SDK (`ai` package) + OpenRouter OpenAI-compatible endpoint | SSE streaming to UI |
| Env Config | `.env.local` + Vercel Environment Variables | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` |

> **Why OpenRouter?** Single API key gives access to Claude, GPT-4o, Gemini, Llama, DeepSeek, etc. Model can be changed via environment variable without touching code. OpenRouter exposes an OpenAI-compatible `/chat/completions` endpoint, so the Vercel AI SDK works out of the box using `createOpenAI` with a custom `baseURL`.

### 3.3 Deployment

- **Platform:** Vercel (Free tier compatible)
- **Build output:** Static + Serverless Functions
- **Environment variables:** `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` set in Vercel dashboard
- **No database required** — stateless per-session
- **No auth required** — public tool

---

## 4. User Flow

```
[Landing Page]
     │
     ▼
[Step 1: Brief Input]
  - Upload .txt / .md / .pdf file  OR
  - Paste brief text in textarea
  - "Next" button → validates non-empty
     │
     ▼
[Step 2: Questionnaire]
  - Multiple-choice questions (see Section 6)
  - Each question has a "Lewati / Skip" option
  - Progress bar at top
  - "Buat PRD" button at end (enabled from first question)
     │
     ▼
[Step 3: AI Processing]
  - Loading state with streaming text preview
  - Shows PRD.md being generated in real-time
     │
     ▼
[Step 4: Output]
  - Full PRD preview in markdown renderer
  - "Download PRD.md" button
  - "Copy Markdown" button
  - "Starter Prompt" card (copy button)
  - "Buat PRD Baru" button (reset flow)
```

---

## 5. Pages & Routes

### 5.1 Route Structure

```
/                    → Landing / Step 1 (Brief Input)
/questionnaire       → Step 2 (Questionnaire)
/generating          → Step 3 (Loading + Streaming)
/result              → Step 4 (Output)
/api/generate        → POST endpoint (AI generation)
```

### 5.2 State Persistence

State is held in **Zustand store** (in-memory, no localStorage):
```ts
{
  brief: string,
  briefFileName: string | null,
  answers: Record<string, string>, // questionId → selectedOption
  prdMarkdown: string,
  starterPrompt: string,
  isGenerating: boolean,
}
```

---

## 6. Questionnaire Design

### 6.1 Questions

All questions are optional. Each includes a "⏭ Lewati pertanyaan ini" option.

| # | Question | Options |
|---|----------|---------|
| Q1 | **Produk ini untuk siapa?** | Konsumen umum (B2C) / Bisnis & Tim (B2B) / Developer / Internal tool perusahaan / Lewati |
| Q2 | **Apa tipe produknya?** | Web app / Mobile app / Website statis / API / Tool CLI / Lewati |
| Q3 | **Teknologi frontend apa yang ingin dipakai?** | React / Next.js / Vue / Svelte / Vanilla HTML/CSS/JS / Terserah AI / Lewati |
| Q4 | **Teknologi backend apa yang ingin dipakai?** | Node.js / Python (FastAPI/Django) / Go / Serverless (Vercel/Netlify) / Tidak butuh backend / Lewati |
| Q5 | **Database apa yang diinginkan?** | PostgreSQL / MySQL / MongoDB / SQLite / Supabase / Firebase / Tidak butuh DB / Lewati |
| Q6 | **Apakah perlu autentikasi user?** | Ya, login email/password / Ya, social login (Google/GitHub) / Tidak perlu / Lewati |
| Q7 | **Skala proyek ini?** | MVP / Prototype cepat / Produk jangka panjang / Lewati |
| Q8 | **Siapa yang akan men-deploy?** | Vercel / Railway / VPS / Docker / AWS/GCP/Azure / Tidak tahu / Lewati |

### 6.2 Questionnaire UX Rules

- Progress bar shows `X/8 pertanyaan dijawab`
- Skipped questions are excluded from AI context (not sent as "skipped")
- User can go back to previous questions
- "Buat PRD" CTA visible from Q1 (user can generate at any point)

---

## 7. AI Generation

### 7.1 API Endpoint

```
POST /api/generate
Content-Type: application/json

Body:
{
  "brief": "string",
  "answers": {
    "target_audience": "B2C",
    "product_type": "Web app",
    ...
  }
}
```

### 7.2 System Prompt

```
You are a senior product manager and technical architect. Your job is to generate a production-ready PRD.md based on a client brief and optional answers.

Output ONLY valid Markdown. No preamble, no explanation, no code fences around the whole output.

The PRD must include:
1. Project Overview (elevator pitch, problem, solution)
2. Goals & Success Metrics (table format)
3. Target Users & Personas
4. Tech Stack (based on answers or inferred from brief)
5. Feature List (MVP vs Nice-to-Have, prioritized)
6. User Flow (step-by-step, text or ASCII diagram)
7. Data Models (key entities and fields)
8. API Design (key endpoints if applicable)
9. Non-Functional Requirements (performance, security, accessibility)
10. Out of Scope (explicit exclusions)
11. Open Questions (unresolved decisions)
12. Milestones & Phases (Phase 1 MVP → Phase 2)

Be specific, technical, and production-grade. Write as if a senior engineer will use this to build the product immediately.
```

### 7.3 Starter Prompt Generation

After the PRD, the API also returns a `starterPrompt` field:

```
You are an expert software engineer. I have a project to build.
Please read the attached PRD.md carefully.

@PRD.md

Before writing any code:
1. Confirm you understand the project by summarizing the core goal in 2 sentences.
2. Ask me any clarifying questions (max 3) if anything is unclear.
3. Propose the folder structure and tech stack setup.

Let's begin.
```

### 7.4 OpenRouter Integration

OpenRouter exposes an OpenAI-compatible endpoint. Use the Vercel AI SDK's `createOpenAI` helper with a custom `baseURL`:

```ts
// lib/openrouter.ts
import { createOpenAI } from '@ai-sdk/openai';

export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'X-Title': 'PRD Generator',
  },
});

export const model = openrouter(
  process.env.OPENROUTER_MODEL ?? 'tencent/hy3-preview'
);
```

```ts
// app/api/generate/route.ts
import { streamText } from 'ai';
import { model } from '@/lib/openrouter';

export const runtime = 'edge'; // Edge runtime for faster cold starts

export async function POST(req: Request) {
  const { brief, answers } = await req.json();
  const result = await streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(brief, answers) }],
    maxTokens: 4000,
  });
  return result.toDataStreamResponse();
}
```

### 7.5 Streaming UX

- Use Vercel AI SDK `useCompletion` hook on the frontend
- Frontend renders markdown incrementally as tokens arrive
- Show a pulsing cursor at end of streamed output

---

## 8. UI/UX Specifications

### 8.1 Design Language

- **Theme:** Dark mode default, light mode toggle
- **Typography:** Monospace/code aesthetic (JetBrains Mono for content, Inter for UI)
- **Color:** Dark background (`#0a0a0a`), green accent (`#00ff88`) — terminal/hacker aesthetic
- **Feel:** Professional tool, not a consumer product. Clean, minimal, fast.

### 8.2 Components

#### Brief Input (Step 1)
- Dropzone component (drag & drop `.txt`, `.md`, `.pdf`)
- OR textarea with `min-h-[200px]`
- Character count indicator
- File name badge when file uploaded
- "Lanjutkan →" button (disabled if empty)

#### Questionnaire Card (Step 2)
- One question per "screen" (slide transition)
- Large clickable option cards (not radio buttons)
- Selected state: highlighted border + checkmark
- Skip link: small, below options, text only
- Back/Next navigation

#### Output Page (Step 4)
- Split layout: left = rendered markdown preview, right = action panel
- Action panel:
  - `↓ Download PRD.md` (primary CTA)
  - `⎘ Copy Markdown`
  - `Starter Prompt` collapsible card with copy button
- Mobile: stacked layout

### 8.3 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| Mobile (<768px) | Single column, full-width cards |
| Tablet (768-1024px) | Single column, max-width 680px |
| Desktop (>1024px) | Two-column on output page |

---

## 9. File Structure

```
prd-generator/
├── app/
│   ├── page.tsx                  # Step 1: Brief input
│   ├── questionnaire/
│   │   └── page.tsx              # Step 2: Questionnaire
│   ├── generating/
│   │   └── page.tsx              # Step 3: Loading/streaming
│   ├── result/
│   │   └── page.tsx              # Step 4: Output
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # AI generation endpoint
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── BriefInput.tsx
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   ├── PRDPreview.tsx
│   ├── OutputActions.tsx
│   └── StarterPromptCard.tsx
├── lib/
│   ├── store.ts                  # Zustand store
│   ├── openrouter.ts             # OpenRouter client + model config
│   ├── prompts.ts                # System prompts
│   ├── questions.ts              # Questionnaire data
│   └── utils.ts
├── public/
├── .env.local                    # OPENROUTER_API_KEY, OPENROUTER_MODEL
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 10. Non-Functional Requirements

### 10.1 Performance
- First Contentful Paint: < 1.5s
- Time to first AI token: < 3s
- Total bundle size: < 200KB (gzipped)
- No unnecessary client-side libraries

### 10.2 Security
- `OPENROUTER_API_KEY` stored only in Vercel env vars, never exposed to client
- API route validates input: brief max 10,000 characters
- No user data stored server-side (stateless)
- Rate limiting: Vercel's built-in + optional `upstash/ratelimit` if abuse detected

### 10.3 Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigable questionnaire
- Screen reader labels on all interactive elements
- Focus management between steps

### 10.4 Browser Support
- Chrome, Firefox, Safari, Edge (last 2 major versions)
- No IE11 support required

---

## 11. Out of Scope (v1.0)

- User accounts / authentication
- Saving PRD history
- Team collaboration features
- Custom questionnaire templates
- Exporting to PDF / DOCX
- Multi-language PRD output
- Integration with Jira / Linear / Notion
- Monetization / paywall

---

## 12. Open Questions

| # | Question | Owner | Target Date |
|---|----------|-------|-------------|
| OQ1 | Should we support PDF brief upload in v1? (requires PDF parsing on server) | Dev | Before kickoff |
| OQ2 | Should streaming be visible as raw markdown or rendered? | Design | Before dev |
| OQ3 | Add example briefs / templates to help users who have no brief yet? | PM | Sprint 1 |
| OQ4 | Rate limiting strategy if the tool goes viral? | Dev | Sprint 2 |

---

## 13. Milestones

### Phase 1 — MVP (Target: 2 weeks)

| Task | Est. |
|------|------|
| Next.js project setup + Vercel deploy | 0.5d |
| Zustand store + routing setup | 0.5d |
| Step 1: Brief input UI | 1d |
| Step 2: Questionnaire UI | 1d |
| API route + OpenRouter integration | 1d |
| Step 3: Streaming loading UI | 0.5d |
| Step 4: Output page + download/copy | 1d |
| Starter prompt generation | 0.5d |
| Polish + responsive | 1d |
| Testing + deploy | 0.5d |
| **Total** | **~8 days** |

### Phase 2 — Enhancement (Post-MVP)

- PDF upload support
- Example brief library
- Shareable PRD link (via URL-encoded state or Vercel KV)
- More questionnaire questions
- "Regenerate" with feedback

---

## 14. Dependencies & Setup

### 14.1 Required Environment Variables

```env
# .env.local
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=tencent/hy3-preview   # optional — change to swap models
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Popular model options via OpenRouter:**

| Model ID | Notes |
|----------|-------|
| `tencent/hy3-preview` | Default — best structured output |
| `openai/gpt-4o` | Fast, strong alternative |
| `google/gemini-2.5-pro` | Long context, good for large briefs |
| `deepseek/deepseek-chat` | Cost-effective option |

### 14.2 Install Commands

```bash
npx create-next-app@latest prd-generator --typescript --tailwind --app
cd prd-generator
npx shadcn-ui@latest init
npm install zustand ai @ai-sdk/openai react-markdown remark-gfm lucide-react
```

### 14.3 Vercel Deploy

```bash
npm install -g vercel
vercel --prod
# Set in Vercel dashboard → Settings → Environment Variables:
#   OPENROUTER_API_KEY
#   OPENROUTER_MODEL  (optional)
#   NEXT_PUBLIC_SITE_URL
```

---

*This PRD was generated to guide a Claude Code / Codex agent. Reference this file throughout development with `@PRD.md`.*