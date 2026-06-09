'use client'

import { useState, useEffect } from 'react'
import { TestSession, type TestQuestion } from './TestSession'

interface TopicItem {
  slug: string
  title: string
}

interface Props {
  courseSlug: string
  allTopics: TopicItem[]
  count?: number
}

export default function CourseTest({ courseSlug, allTopics, count = 30 }: Props) {
  const [questions, setQuestions] = useState<TestQuestion[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    let cancelled = false
    setQuestions(null)
    setError(null)

    fetch('/api/cache-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseSlug, topics: allTopics, count }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (!data.questions?.length) {
          setError('No cached questions found for this course yet.')
        } else {
          setQuestions(data.questions as TestQuestion[])
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load questions. Please try again.')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generation])

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-5 py-4">
        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="flex items-center gap-3 py-8">
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">Loading {count} questions…</p>
      </div>
    )
  }

  return (
    <TestSession
      key={generation}
      questions={questions}
      courseSlug={courseSlug}
      onRetake={() => setGeneration((g) => g + 1)}
    />
  )
}
