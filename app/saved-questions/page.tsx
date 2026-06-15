'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllSavedGroups, removeQuestion } from '@/lib/savedQuestions'
import type { SavedQuestion } from '@/lib/savedQuestions'

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const color =
    difficulty === 'easy'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : difficulty === 'hard'
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
      {difficulty}
    </span>
  )
}

function QuestionCard({
  q,
  onRemove,
}: {
  q: SavedQuestion
  onRemove: () => void
}) {
  const [showAnswer, setShowAnswer] = useState(false)

  const savedDate = new Date(q.savedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 leading-relaxed">
          {q.question}
        </p>
        <button
          onClick={onRemove}
          className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 mt-0.5"
        >
          Remove
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs text-gray-400 dark:text-gray-500">{q.topicTitle}</span>
        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
        <DifficultyBadge difficulty={q.difficulty} />
        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">Saved {savedDate}</span>
      </div>

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="text-xs font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {showAnswer ? 'Hide answer ↑' : 'Show answer ↓'}
      </button>

      {showAnswer && (
        <div className="mt-3">
          <ul className="space-y-1.5 mb-3">
            {q.options.map((option, i) => (
              <li
                key={i}
                className={`text-sm px-3 py-2 rounded-lg ${
                  i === q.correctIndex
                    ? 'bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <span className="text-xs opacity-50 mr-2">{String.fromCharCode(65 + i)}.</span>
                {option}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-1 border-l-2 border-gray-200 dark:border-gray-700 ml-1">
            {q.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

export default function SavedQuestionsPage() {
  const [groups, setGroups] = useState<
    Array<{ courseSlug: string; courseTitle: string; questions: SavedQuestion[] }>
  >([])
  const [mounted, setMounted] = useState(false)

  function load() {
    const raw = getAllSavedGroups()
    setGroups(
      raw.map(({ courseSlug, questions }) => ({
        courseSlug,
        courseTitle: questions[0]?.courseTitle ?? courseSlug,
        questions,
      })),
    )
  }

  useEffect(() => {
    setMounted(true)
    load()
    window.addEventListener('storage', load)
    window.addEventListener('savedQuestionsChanged', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('savedQuestionsChanged', load)
    }
  }, [])

  function handleRemove(courseSlug: string, questionText: string) {
    removeQuestion(courseSlug, questionText)
    load()
  }

  const totalCount = groups.reduce((sum, g) => sum + g.questions.length, 0)
  const courseCount = groups.length

  if (!mounted) return null

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-12">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-8 inline-block">
        ← All courses
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">🚩 Saved Questions</h1>
        {totalCount > 0 ? (
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {totalCount} {totalCount === 1 ? 'question' : 'questions'} across {courseCount}{' '}
            {courseCount === 1 ? 'course' : 'courses'}
          </p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 mt-2">No saved questions yet</p>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-4xl mb-4">🚩</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No saved questions yet.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Flag questions during practice by clicking 🚩 Save for later.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ courseSlug, courseTitle, questions }) => (
            <section key={courseSlug}>
              <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {courseTitle}
                </h2>
                <Link
                  href={`/courses/${courseSlug}/practice`}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Practice this course →
                </Link>
              </div>
              <div className="space-y-3">
                {questions.map((q) => (
                  <QuestionCard
                    key={`${q.courseSlug}-${q.topicSlug}-${q.savedAt}`}
                    q={q}
                    onRemove={() => handleRemove(courseSlug, q.question)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
