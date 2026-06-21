import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { getCourse, getAllTopics } from '@/lib/courses'
import LearnAndPractice from '@/components/exercise/LearnAndPractice'

interface Props {
  params: Promise<{ courseSlug: string; topicSlug: string }>
}

interface NormalizedQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type?: string
  difficulty?: string
}

function loadQuestions(courseSlug: string, topicSlug: string): NormalizedQuestion[] {
  const filePath = path.join(process.cwd(), 'content', 'questions', courseSlug, `${topicSlug}.json`)
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)

    // Old format: top-level array [{question, options, correctIndex, explanation, ...}]
    if (Array.isArray(data)) {
      return data as NormalizedQuestion[]
    }

    // New format: {topic, questions: [{question, choices: {A,B,C,D}, correct, explanation, typeName, ...}]}
    if (data && Array.isArray(data.questions)) {
      const keys = ['A', 'B', 'C', 'D'] as const
      return data.questions.map((q: {
        question: string
        choices: Record<string, string>
        correct: string
        explanation: string
        typeName?: string
      }): NormalizedQuestion => ({
        question: q.question,
        options: keys.map((k) => q.choices[k] ?? ''),
        correctIndex: keys.indexOf(q.correct as typeof keys[number]),
        explanation: q.explanation,
        type: q.typeName,
      }))
    }
  } catch {
    // file not found or parse error — fall through
  }
  return []
}

export default async function PracticeTopicPage({ params }: Props) {
  const { courseSlug, topicSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const allTopics = getAllTopics(course)
  const currentIndex = allTopics.findIndex((t) => t.slug === topicSlug)
  if (currentIndex === -1) notFound()

  const topic = allTopics[currentIndex]
  const nextTopic =
    currentIndex < allTopics.length - 1
      ? { slug: allTopics[currentIndex + 1].slug, title: allTopics[currentIndex + 1].title }
      : null

  const nextTopicHasLearn = nextTopic != null && allTopics[currentIndex + 1].learn != null

  const hasLearnContent =
    topic.learn != null &&
    ('openingQuestion' in topic.learn || 'explanation' in topic.learn)

  const questions = loadQuestions(courseSlug, topicSlug)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-gray-900 border-r border-gray-800 px-6 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {course.title}
        </p>
        <div className="border-t border-gray-800 my-4" />
        <p className="text-sm text-gray-300">Topic Practice</p>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <main className="max-w-2xl mx-auto px-4 py-6 sm:py-12">
          <nav className="flex items-center gap-1.5 text-sm mb-8">
            <Link href={`/courses/${courseSlug}`} className="text-blue-500 hover:underline">
              {course.title}
            </Link>
            <span className="text-gray-400">›</span>
            <Link href={`/courses/${courseSlug}/practice`} className="text-blue-500 hover:underline">
              Practice
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-600 dark:text-gray-300">{topic.title}</span>
          </nav>

          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
            {course.subject}
          </div>
          <h1 className="text-2xl font-bold mb-1">{topic.title}</h1>
          <p className="text-sm text-gray-400 mb-10">Practice question</p>

          <LearnAndPractice
            topicTitle={topic.title}
            topicSlug={topicSlug}
            courseSlug={courseSlug}
            courseTitle={course.title}
            nextTopic={nextTopic}
            hasLearnContent={hasLearnContent}
            nextTopicHasLearn={nextTopicHasLearn}
            questions={questions.length > 0 ? questions : undefined}
          />
        </main>
      </div>
    </div>
  )
}
