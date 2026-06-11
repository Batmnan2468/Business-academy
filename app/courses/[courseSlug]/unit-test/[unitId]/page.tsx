import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { getCourse } from '@/lib/courses'
import UnitTest from '@/components/exercise/UnitTest'
import type { UnitTestQuestion } from '@/types'

interface Props {
  params: Promise<{ courseSlug: string; unitId: string }>
}

interface CachedQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type?: string
  difficulty?: string
}

const QUESTIONS_DIR = path.join(process.cwd(), 'content', 'questions')

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadTopicQuestions(courseSlug: string, topicSlug: string): CachedQuestion[] {
  try {
    const raw = fs.readFileSync(
      path.join(QUESTIONS_DIR, courseSlug, `${topicSlug}.json`),
      'utf-8',
    )
    return JSON.parse(raw) as CachedQuestion[]
  } catch {
    return []
  }
}

export default async function UnitTestPage({ params }: Props) {
  const { courseSlug, unitId } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const unit = course.units?.find((u) => u.id === unitId)
  if (!unit) notFound()

  // Pick 3 random questions per topic that has a cache file
  const questions: UnitTestQuestion[] = []
  for (const topic of unit.topics) {
    const pool = loadTopicQuestions(courseSlug, topic.slug)
    if (pool.length === 0) continue
    const picked = shuffle(pool).slice(0, 3)
    for (const q of picked) {
      questions.push({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        topicSlug: topic.slug,
        topicTitle: topic.title,
      })
    }
  }

  const unitTopics = unit.topics.map(({ slug, title }) => ({ slug, title }))
  const unitIndex = (course.units ?? []).findIndex((u) => u.id === unitId)
  const moduleNum = unitIndex + 1

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-blue-500 hover:underline mb-8 inline-block"
      >
        ← {course.title}
      </Link>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          {course.subject}
        </span>
        <h1 className="text-2xl font-bold mt-1">Module {moduleNum} Unit Test</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {unit.title} · {questions.length} questions
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-gray-400 mb-4">No questions available for this unit yet.</p>
          <Link
            href={`/courses/${courseSlug}`}
            className="text-sm text-blue-500 hover:underline"
          >
            ← Return to course
          </Link>
        </div>
      ) : (
        <UnitTest
          courseSlug={courseSlug}
          unitId={unitId}
          unitTitle={unit.title}
          questions={questions}
          topics={unitTopics}
        />
      )}
    </main>
  )
}
