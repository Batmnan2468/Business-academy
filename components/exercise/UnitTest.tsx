'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { UnitTestQuestion } from '@/types'
import { getTopicState, setTopicState, setUnitTestState } from '@/lib/topicState'

interface TopicItem {
  slug: string
  title: string
}

interface Props {
  courseSlug: string
  unitId: string
  unitTitle: string
  questions: UnitTestQuestion[]
  topics: TopicItem[]
}

function shuffleOptions(q: UnitTestQuestion): UnitTestQuestion {
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

interface TopicResult {
  slug: string
  title: string
  correct: number
  total: number
  stateChange: 'mastered' | 'regressed' | null
}

export default function UnitTest({ courseSlug, unitId, questions: rawQuestions, topics }: Props) {
  // Shuffle options client-side on first render
  const [questions] = useState(() => rawQuestions.map(shuffleOptions))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ correct: boolean; topicSlug: string }[]>([])
  const [phase, setPhase] = useState<'quiz' | 'results'>('quiz')
  const [topicResults, setTopicResults] = useState<TopicResult[]>([])

  const total = questions.length
  const currentQuestion = questions[currentIdx]
  const isLastQuestion = currentIdx === total - 1
  const answered = selected !== null

  function handleSelect(i: number) {
    if (answered) return
    setSelected(i)
  }

  function handleNext() {
    if (selected === null) return
    const isCorrect = selected === currentQuestion.correctIndex
    const allAnswers = [...answers, { correct: isCorrect, topicSlug: currentQuestion.topicSlug }]

    if (isLastQuestion) {
      finishTest(allAnswers)
    } else {
      setAnswers(allAnswers)
      setCurrentIdx((idx) => idx + 1)
      setSelected(null)
    }
  }

  function finishTest(allAnswers: { correct: boolean; topicSlug: string }[]) {
    // Tally per-topic scores
    const tally: Record<string, { correct: number; total: number }> = {}
    for (const a of allAnswers) {
      if (!tally[a.topicSlug]) tally[a.topicSlug] = { correct: 0, total: 0 }
      tally[a.topicSlug].total++
      if (a.correct) tally[a.topicSlug].correct++
    }

    // Update topic states and build results array
    const results: TopicResult[] = topics.map((topic) => {
      const r = tally[topic.slug]
      if (!r) return { slug: topic.slug, title: topic.title, correct: 0, total: 0, stateChange: null }

      const passed3of3 = r.correct === r.total && r.total >= 3
      const prevState = getTopicState(courseSlug, topic.slug)
      let stateChange: 'mastered' | 'regressed' | null = null

      if (passed3of3) {
        setTopicState(courseSlug, topic.slug, 'mastered')
        stateChange = 'mastered'
      } else if (prevState === 'mastered') {
        setTopicState(courseSlug, topic.slug, 'practiced')
        stateChange = 'regressed'
      }

      return { slug: topic.slug, title: topic.title, correct: r.correct, total: r.total, stateChange }
    })

    // Determine unit test pass/fail: all testable topics scored 3/3
    const testable = results.filter((r) => r.total > 0)
    const allPassed = testable.length > 0 && testable.every((r) => r.correct === r.total)
    setUnitTestState(courseSlug, unitId, allPassed ? 'passed' : 'inProgress')

    setAnswers(allAnswers)
    setTopicResults(results)
    setPhase('results')
  }

  function retake() {
    setCurrentIdx(0)
    setSelected(null)
    setAnswers([])
    setPhase('quiz')
    setTopicResults([])
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (phase === 'results') {
    const testable = topicResults.filter((r) => r.total > 0)
    const totalCorrect = testable.reduce((s, r) => s + r.correct, 0)
    const totalQ = testable.reduce((s, r) => s + r.total, 0)
    const allPassed = testable.every((r) => r.correct === r.total)

    return (
      <div>
        {/* Overall banner */}
        <div
          className={`rounded-2xl p-6 mb-8 text-center border ${
            allPassed
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
          }`}
        >
          <div className="text-4xl mb-3">{allPassed ? '🎉' : '📊'}</div>
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
            {allPassed ? 'All topics mastered!' : 'Unit test complete'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalCorrect} / {totalQ} correct
          </p>
        </div>

        {/* Per-topic breakdown */}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Results by topic
        </h3>
        <div className="space-y-3 mb-8">
          {testable.map((result) => {
            const perfect = result.correct === result.total
            return (
              <div
                key={result.slug}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${
                  perfect
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                    {result.title}
                  </p>
                  {result.stateChange === 'mastered' && (
                    <p className="text-xs mt-0.5 text-green-600 dark:text-green-400">
                      → Mastered ✓
                    </p>
                  )}
                  {result.stateChange === 'regressed' && (
                    <p className="text-xs mt-0.5 text-amber-600 dark:text-amber-400">
                      → Needs more practice
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      perfect
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {result.correct}/{result.total}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      perfect
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400'
                    }`}
                  >
                    {perfect ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 items-center">
          <Link
            href={`/courses/${courseSlug}`}
            className="w-full max-w-xs px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium text-center transition-colors"
          >
            ← Return to course
          </Link>
          <button
            onClick={retake}
            className="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            Retake unit test
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  const correctSoFar = answers.filter((a) => a.correct).length

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentIdx + 1} of {total}
        </span>
        <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
          {correctSoFar} correct
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${(currentIdx / total) * 100}%` }}
        />
      </div>

      {/* Topic label */}
      <div className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
        {currentQuestion.topicTitle}
      </div>

      {/* Question */}
      <p className="text-lg font-medium mb-6 text-gray-900 dark:text-gray-100">
        {currentQuestion.question}
      </p>

      {/* Options */}
      <ul className="space-y-3 mb-6">
        {currentQuestion.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrectChoice = i === currentQuestion.correctIndex

          let cls =
            'w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-colors '
          if (!answered) {
            cls += isSelected
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100'
              : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer'
          } else if (isCorrectChoice) {
            cls +=
              'border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100'
          } else if (isSelected) {
            cls += 'border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100'
          } else {
            cls +=
              'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-default'
          }

          return (
            <li key={i}>
              <button disabled={answered} onClick={() => handleSelect(i)} className={cls}>
                <span className="mr-3 text-xs opacity-60">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Correct/incorrect indicator — no explanation until results */}
      {answered && (
        <div
          className={`rounded-xl px-5 py-3 text-sm border mb-4 ${
            selected === currentQuestion.correctIndex
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          <p className="font-semibold">
            {selected === currentQuestion.correctIndex ? '✓ Correct!' : '✗ Not quite.'}
          </p>
        </div>
      )}

      {answered && (
        <button
          onClick={handleNext}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          {isLastQuestion ? 'See results →' : 'Next question →'}
        </button>
      )}
    </div>
  )
}
