import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

const QUESTIONS_DIR = path.join(process.cwd(), 'content', 'questions')

interface CachedQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type?: string
  difficulty?: string
}

export interface TestQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topicSlug: string
  topicTitle: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleOptions(q: TestQuestion): TestQuestion {
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

export async function POST(req: NextRequest) {
  let body: { courseSlug: string; topics: { slug: string; title: string }[]; count: number }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { courseSlug, topics, count } = body
  if (!courseSlug || !Array.isArray(topics) || topics.length === 0 || !count) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const pool: TestQuestion[] = []

  for (const topic of topics) {
    const filePath = path.join(QUESTIONS_DIR, courseSlug, `${topic.slug}.json`)
    try {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const questions = JSON.parse(raw) as CachedQuestion[]
      for (const q of questions) {
        pool.push({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          topicSlug: topic.slug,
          topicTitle: topic.title,
        })
      }
    } catch {
      // no cache file for this topic — skip silently
    }
  }

  if (pool.length === 0) {
    return Response.json({ questions: [] })
  }

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length))
  return Response.json({ questions: selected.map(shuffleOptions) })
}
