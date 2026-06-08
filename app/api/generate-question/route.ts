import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// ─── Question types ───────────────────────────────────────────────────────────

const QUESTION_TYPES = [
  {
    type: 'Definition',
    instruction:
      'Ask the student to identify or explain what a concept means. Test precise understanding of terminology.',
  },
  {
    type: 'Calculation',
    instruction:
      'Give the student a set of specific numbers and ask them to compute or interpret a result. All numbers must be realistic and the math must be unambiguous.',
  },
  {
    type: 'Application',
    instruction:
      'Present a realistic business scenario and ask what the student would do or conclude. The scenario should feel like a real decision a professional would face.',
  },
  {
    type: 'Error-Finding',
    instruction:
      'State something that is wrong — a misconception, incorrect procedure, or flawed reasoning — and ask the student to identify the error or what is incorrect about it.',
  },
  {
    type: 'Comparison',
    instruction:
      'Ask how two related concepts differ from each other. Both concepts should be plausibly confusable.',
  },
  {
    type: 'Interpretation',
    instruction:
      'Give the student a specific result (a ratio, a number, a chart reading, a test statistic) and ask what it means for a business decision.',
  },
]

const DIFFICULTIES = ['easy', 'medium', 'hard']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Cache types ──────────────────────────────────────────────────────────────

interface CachedQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type: string
  difficulty: string
}

// ─── In-memory used-index tracker ────────────────────────────────────────────
// Key: `courseSlug::topicSlug::difficulty`
// Value: Set of cache-array indices that have already been served this cycle
//
// When the set covers all available questions for that difficulty, it resets
// so the student cycles through again rather than hitting the live API.

const usedIndices = new Map<string, Set<number>>()

function pickFromCache(
  questions: CachedQuestion[],
  difficulty: string,
  courseSlug: string,
  topicSlug: string,
): CachedQuestion | null {
  const matching = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.difficulty === difficulty)

  if (matching.length === 0) return null

  const key = `${courseSlug}::${topicSlug}::${difficulty}`
  let used = usedIndices.get(key) ?? new Set<number>()

  let available = matching.filter(({ i }) => !used.has(i))

  // Full cycle complete — reset and restart
  if (available.length === 0) {
    used = new Set()
    usedIndices.set(key, used)
    available = matching
  }

  const chosen = available[Math.floor(Math.random() * available.length)]
  used.add(chosen.i)
  usedIndices.set(key, used)

  return chosen.q
}

// ─── Cache file helpers ───────────────────────────────────────────────────────

const QUESTIONS_DIR = path.join(process.cwd(), 'content', 'questions')

function loadCache(courseSlug: string, topicSlug: string): CachedQuestion[] | null {
  const filePath = path.join(QUESTIONS_DIR, courseSlug, `${topicSlug}.json`)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as CachedQuestion[]
  } catch {
    return null
  }
}

// ─── Option shuffler ──────────────────────────────────────────────────────────

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type?: string
  difficulty?: string
}

function shuffleOptions(q: Question): Question {
  const indices = Array.from({ length: q.options.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return {
    ...q,
    options: indices.map((i) => q.options[i]),
    correctIndex: indices.indexOf(q.correctIndex),
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[generate-question] ANTHROPIC_API_KEY is not set in .env.local')
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  let body: { topic: string; difficulty?: string; courseSlug?: string; topicSlug?: string }
  try {
    body = await req.json()
  } catch (err) {
    console.error('[generate-question] failed to parse request body:', err)
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const topic = body.topic
  const difficulty = DIFFICULTIES.includes(body.difficulty ?? '') ? body.difficulty! : 'medium'
  const courseSlug = body.courseSlug ?? ''
  const topicSlug = body.topicSlug ?? ''

  console.log(`[generate-question] topic: "${topic}", difficulty: ${difficulty}, courseSlug: ${courseSlug}`)

  // ── 1. Try the cache first ─────────────────────────────────────────────────
  if (courseSlug && topicSlug) {
    const cached = loadCache(courseSlug, topicSlug)
    if (cached && cached.length > 0) {
      const chosen = pickFromCache(cached, difficulty, courseSlug, topicSlug)
      if (chosen) {
        console.log(`[generate-question] serving from cache (type: ${chosen.type})`)
        return Response.json(shuffleOptions(chosen))
      }
    }
  }

  // ── 2. Fall back to live API ───────────────────────────────────────────────
  console.log('[generate-question] no cache hit — calling live API')

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const questionType = pick(QUESTION_TYPES)

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      temperature: 1,
      system: `You are an expert business professor writing exam questions for university students.
Your questions always use realistic business contexts with specific numbers — never abstract placeholders like "Company X" or "some amount." Use real company names, realistic dollar figures, specific percentages, and named industries.
Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Generate one multiple-choice question about "${topic}".

Question type: ${questionType.type}
Type instruction: ${questionType.instruction}
Difficulty: ${difficulty}

Difficulty guidance:
- easy: tests direct recall or a single straightforward step; appropriate for a student seeing this concept for the first time
- medium: requires applying the concept to a scenario or doing a two-step calculation; appropriate for a student who understands the basics
- hard: involves a nuance, a common misconception, or a multi-step problem where a wrong turn leads to a plausible distractor; appropriate for exam preparation

Requirements:
- Use a realistic business context with specific numbers (dollar amounts, percentages, ratios, time periods)
- The three wrong options should be plausible — common mistakes or related but incorrect ideas
- The explanation should say why the correct answer is right AND why the most tempting wrong answer is wrong

Respond with this exact JSON shape and nothing else:
{
  "question": "the question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "explanation": "brief explanation of the correct answer",
  "type": "${questionType.type}",
  "difficulty": "${difficulty}"
}`,
        },
      ],
    })

    const rawText = message.content.find((b) => b.type === 'text')?.text ?? ''
    console.log('[generate-question] raw API response:', rawText)

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim()

    let parsed: Question
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('[generate-question] JSON parse failed:', cleaned, parseErr)
      return Response.json(
        { error: 'Model returned non-JSON response', raw: rawText },
        { status: 500 },
      )
    }

    console.log('[generate-question] live API success, question:', parsed.question)
    return Response.json(shuffleOptions(parsed))
  } catch (err) {
    console.error('[generate-question] Anthropic API call failed:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
