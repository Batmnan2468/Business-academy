import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

// Load .env.local so the script works without a wrapper like dotenv-cli
;(function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
    for (const line of lines) {
      const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(.*?)\s*$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
  } catch { /* .env.local not present — rely on real env vars */ }
})()

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CONTENT_DIR = path.join(process.cwd(), 'content')
const COURSES_DIR = path.join(CONTENT_DIR, 'courses')
const QUESTIONS_DIR = path.join(CONTENT_DIR, 'questions')

interface CachedQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Topic {
  id: string
  slug: string
  title: string
}

interface Unit {
  id: string
  title: string
  topics: Topic[]
}

interface Course {
  id: string
  slug: string
  title: string
  units?: Unit[]
  topics?: Topic[]
}

function getAllTopics(course: Course): Topic[] {
  if (course.units) return course.units.flatMap((u) => u.topics)
  return course.topics ?? []
}

function getCourses(): Course[] {
  const slugs = fs.readdirSync(COURSES_DIR)
  return slugs
    .map((slug) => {
      try {
        const raw = fs.readFileSync(path.join(COURSES_DIR, slug, 'course.json'), 'utf-8')
        return JSON.parse(raw) as Course
      } catch {
        return null
      }
    })
    .filter(Boolean) as Course[]
}

function cachePath(courseSlug: string, topicSlug: string): string {
  return path.join(QUESTIONS_DIR, courseSlug, `${topicSlug}.json`)
}

function cacheExists(courseSlug: string, topicSlug: string): boolean {
  return fs.existsSync(cachePath(courseSlug, topicSlug))
}

async function generateQuestionsForTopic(
  courseTitle: string,
  topicTitle: string,
): Promise<CachedQuestion[]> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 8192,
    temperature: 1,
    system: `You are an expert business professor generating exam question banks for university students.
Your questions always use realistic business contexts with specific numbers — real company names, realistic dollar figures, specific percentages, and named industries.
Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON array.`,
    messages: [
      {
        role: 'user',
        content: `Generate exactly 15 multiple-choice questions about "${topicTitle}" for a course on ${courseTitle}.

Requirements:
- Exactly 5 easy questions: direct recall or a single straightforward step
- Exactly 5 medium questions: applying the concept to a scenario or a two-step calculation
- Exactly 5 hard questions: a nuance, a common misconception, or a multi-step problem with plausible distractors
- Use a variety of question types across the 15: Definition, Calculation, Application, Error-Finding, Comparison, Interpretation
- Every question uses a realistic business context with specific numbers
- The three wrong options must be plausible — common mistakes or related-but-incorrect ideas
- The explanation must say why the correct answer is right AND why the most tempting wrong answer is wrong

Respond with ONLY a JSON array of exactly 15 objects. No markdown, no code fences.

Each object must have exactly these fields:
{
  "question": "the question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "explanation": "why correct is right and why the most tempting wrong answer is wrong",
  "type": "Definition|Calculation|Application|Error-Finding|Comparison|Interpretation",
  "difficulty": "easy|medium|hard"
}`,
      },
    ],
  })

  const rawText = message.content.find((b) => b.type === 'text')?.text ?? ''
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim()

  const parsed = JSON.parse(cleaned) as CachedQuestion[]

  if (!Array.isArray(parsed)) throw new Error('Response was not a JSON array')
  if (parsed.length !== 15) console.warn(`  ⚠ Expected 15 questions, got ${parsed.length}`)

  return parsed
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY is not set. Add it to .env.local and run with dotenv.')
    process.exit(1)
  }

  const courses = getCourses()
  console.log(`Found ${courses.length} courses.\n`)

  let totalTopics = 0
  let skipped = 0
  let generated = 0
  let failed = 0

  for (const course of courses) {
    const topics = getAllTopics(course)
    totalTopics += topics.length
    console.log(`── ${course.title} (${topics.length} topics)`)

    const courseQuestionsDir = path.join(QUESTIONS_DIR, course.slug)
    fs.mkdirSync(courseQuestionsDir, { recursive: true })

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i]
      const label = `   [${i + 1}/${topics.length}] ${topic.title}`

      if (cacheExists(course.slug, topic.slug)) {
        console.log(`${label} — skipped (cached)`)
        skipped++
        continue
      }

      process.stdout.write(`${label} — generating…`)

      try {
        const questions = await generateQuestionsForTopic(course.title, topic.title)
        fs.writeFileSync(cachePath(course.slug, topic.slug), JSON.stringify(questions, null, 2))
        console.log(` ✓ (${questions.length} questions)`)
        generated++
      } catch (err) {
        console.log(` ✗ FAILED: ${err}`)
        failed++
      }

      // Respect Haiku rate limits — 500ms between requests
      if (i < topics.length - 1) await sleep(500)
    }

    console.log()
  }

  console.log('─────────────────────────────')
  console.log(`Total topics: ${totalTopics}`)
  console.log(`Generated:    ${generated}`)
  console.log(`Skipped:      ${skipped} (already cached)`)
  console.log(`Failed:       ${failed}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
