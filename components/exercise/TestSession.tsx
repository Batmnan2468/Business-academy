'use client'

import { useState } from 'react'
import Link from 'next/link'
import { applyExamResult } from '@/lib/topicState'

export interface TestQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topicSlug: string
  topicTitle: string
}

interface TestAnswer {
  topicSlug: string
  topicTitle: string
  isCorrect: boolean
  explanation: string
  questionText: string
  selectedOptionText: string
  correctOptionText: string
}

interface Props {
  questions: TestQuestion[]
  courseSlug: string
  onRetake: () => void
}

export function TestSession({ questions, courseSlug, onRetake }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<TestAnswer[]>([])
  const [complete, setComplete] = useState(false)

  if (complete) {
    return (
      <ResultsScreen
        answers={answers}
        total={questions.length}
        courseSlug={courseSlug}
        onRetake={onRetake}
      />
    )
  }

  const q = questions[currentIndex]
  const total = questions.length
  const answered = selected !== null
  const progressPct = Math.round((currentIndex / total) * 100)
  const correctSoFar = answers.filter((a) => a.isCorrect).length

  function handleSelect(i: number) {
    if (answered) return
    setSelected(i)
  }

  function handleNext() {
    const isCorrect = selected! === q.correctIndex
    applyExamResult(courseSlug, q.topicSlug, isCorrect)
    setAnswers((prev) => [
      ...prev,
      {
        topicSlug: q.topicSlug,
        topicTitle: q.topicTitle,
        isCorrect,
        explanation: q.explanation,
        questionText: q.question,
        selectedOptionText: q.options[selected!],
        correctOptionText: q.options[q.correctIndex],
      },
    ])
    setSelected(null)
    if (currentIndex + 1 >= total) {
      setComplete(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentIndex + 1} of {total}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {correctSoFar} correct
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Topic label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        {q.topicTitle}
      </p>

      {/* Question */}
      <p className="text-lg font-medium mb-6 text-gray-900 dark:text-gray-100">{q.question}</p>

      {/* Options */}
      <ul className="space-y-3 mb-6">
        {q.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === q.correctIndex

          let cls =
            'w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-colors '

          if (!answered) {
            cls += isSelected
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100'
              : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer'
          } else if (isCorrect) {
            cls +=
              'border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100'
          } else if (isSelected) {
            cls +=
              'border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100'
          } else {
            cls +=
              'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-default'
          }

          return (
            <li key={i}>
              <button
                disabled={answered}
                onClick={() => handleSelect(i)}
                className={cls}
              >
                <span className="mr-3 text-xs opacity-60">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-semibold ${
              selected === q.correctIndex
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {selected === q.correctIndex ? '✓ Correct' : '✗ Incorrect'}
          </span>
          <button
            onClick={handleNext}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            {currentIndex + 1 >= total ? 'See results →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}

function ResultsScreen({
  answers,
  total,
  courseSlug,
  onRetake,
}: {
  answers: TestAnswer[]
  total: number
  courseSlug: string
  onRetake: () => void
}) {
  const correct = answers.filter((a) => a.isCorrect).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  // Group answers by topic
  const topicMap = new Map<string, { title: string; correct: number; total: number }>()
  for (const a of answers) {
    const entry = topicMap.get(a.topicSlug) ?? { title: a.topicTitle, correct: 0, total: 0 }
    entry.total++
    if (a.isCorrect) entry.correct++
    topicMap.set(a.topicSlug, entry)
  }
  const topicStats = Array.from(topicMap.entries())
    .map(([slug, t]) => ({
      slug,
      title: t.title,
      correct: t.correct,
      total: t.total,
      pct: t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct)

  const grade =
    pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F'
  const gradeColor =
    pct >= 80
      ? 'text-green-600 dark:text-green-400'
      : pct >= 60
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-red-500 dark:text-red-400'

  const [showReview, setShowReview] = useState(false)

  return (
    <div>
      {/* Score header */}
      <div className="text-center py-6 mb-8 border-b border-gray-100 dark:border-gray-800">
        <div className={`text-6xl font-bold mb-3 ${gradeColor}`}>{grade}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {correct} / {total}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">{pct}% correct</div>
      </div>

      {/* Topic breakdown */}
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Topic Breakdown
      </h2>
      <div className="space-y-2 mb-8">
        {topicStats.map((t) => (
          <div
            key={t.slug}
            className="flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                t.pct >= 80 ? 'bg-green-400' : t.pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
            />
            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 min-w-0 truncate">
              {t.title}
            </span>
            <span className="text-xs tabular-nums text-gray-400 shrink-0">
              {t.correct}/{t.total}
            </span>
            <span
              className={`text-xs font-semibold w-20 text-right shrink-0 ${
                t.pct >= 80
                  ? 'text-green-600 dark:text-green-400'
                  : t.pct >= 50
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-500 dark:text-red-400'
              }`}
            >
              {t.pct >= 80 ? '✓ Strong' : t.pct >= 50 ? '~ Fair' : '✗ Weak'}
            </span>
          </div>
        ))}
      </div>

      {/* Wrong answer review */}
      {answers.some((a) => !a.isCorrect) && (
        <div className="mb-8">
          <button
            onClick={() => setShowReview((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-4"
          >
            <span
              className={`transition-transform duration-200 ${showReview ? 'rotate-90' : ''}`}
            >
              ▶
            </span>
            Review wrong answers ({answers.filter((a) => !a.isCorrect).length})
          </button>

          {showReview && (
            <div className="space-y-4">
              {answers
                .filter((a) => !a.isCorrect)
                .map((a, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-5 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-400 mb-2">
                      {a.topicTitle}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {a.questionText}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                      You selected: <span className="font-medium">{a.selectedOptionText}</span>
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                      Correct: <span className="font-medium">{a.correctOptionText}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 border-t border-red-100 dark:border-red-800 pt-2">
                      {a.explanation}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Retake test
        </button>
        <Link
          href={`/courses/${courseSlug}`}
          className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors text-center"
        >
          ← Back to course
        </Link>
      </div>
    </div>
  )
}
