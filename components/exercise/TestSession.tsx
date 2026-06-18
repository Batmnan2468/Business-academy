'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { applyExamResult } from '@/lib/topicState'
import { addXP } from '@/lib/xp'
import { getCourseBest, saveCourseBest, formatTime, formatBestDate, type TimedBest } from '@/lib/timedBests'

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

type Phase = 'start' | 'quiz' | 'results'

const LIMIT_OPTIONS = [5, 10, 15, 20] as const

export function TestSession({ questions, courseSlug, onRetake }: Props) {
  const [phase, setPhase] = useState<Phase>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<TestAnswer[]>([])

  // Timed mode
  const [timedMode, setTimedMode] = useState(false)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [isNewBest, setIsNewBest] = useState(false)
  const [prevBestSeconds, setPrevBestSeconds] = useState<number | null>(null)

  // Snapshot of best before this run (stable — read once at mount)
  const [courseBest] = useState(() => getCourseBest(courseSlug))

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const finishedRef = useRef(false)

  // Callback ref: always holds the latest time-up handler (avoids stale closure)
  const handleTimeUpRef = useRef<() => void>(() => {})
  handleTimeUpRef.current = () => {
    const timeLimitSeconds = timeLimitMinutes * 60
    const finalAnswers = [...answers]
    const q = questions[currentIndex]

    const isCorrect = selected !== null && selected === q.correctIndex
    applyExamResult(courseSlug, q.topicSlug, isCorrect)
    finalAnswers.push({
      topicSlug: q.topicSlug,
      topicTitle: q.topicTitle,
      isCorrect,
      explanation: q.explanation,
      questionText: q.question,
      selectedOptionText: selected !== null ? q.options[selected] : '(no answer)',
      correctOptionText: q.options[q.correctIndex],
    })

    for (let i = currentIndex + 1; i < questions.length; i++) {
      const rq = questions[i]
      applyExamResult(courseSlug, rq.topicSlug, false)
      finalAnswers.push({
        topicSlug: rq.topicSlug,
        topicTitle: rq.topicTitle,
        isCorrect: false,
        explanation: rq.explanation,
        questionText: rq.question,
        selectedOptionText: '(no answer)',
        correctOptionText: rq.options[rq.correctIndex],
      })
    }

    addXP('courseTestCompleted')
    setIsTimedOut(true)
    finishWithAnswers(finalAnswers, timeLimitSeconds)
  }

  // Start countdown when quiz phase begins
  useEffect(() => {
    if (phase !== 'quiz' || !timedMode) return
    const timeLimitSeconds = timeLimitMinutes * 60
    setSecondsRemaining(timeLimitSeconds)

    const id = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          // Schedule after this state update commits
          setTimeout(() => handleTimeUpRef.current(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    timerRef.current = id

    return () => {
      clearInterval(id)
      timerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timedMode])

  function finishWithAnswers(finalAnswers: TestAnswer[], elapsed: number | null) {
    if (finishedRef.current) return
    finishedRef.current = true

    if (elapsed !== null) {
      const correct = finalAnswers.filter((a) => a.isCorrect).length
      const prev = getCourseBest(courseSlug)
      setPrevBestSeconds(prev?.timeSeconds ?? null)
      saveCourseBest(courseSlug, elapsed, correct, finalAnswers.length)
      setIsNewBest(!prev || elapsed < prev.timeSeconds)
    }

    setElapsedSeconds(elapsed)
    setAnswers(finalAnswers)
    setPhase('results')
  }

  if (phase === 'results') {
    return (
      <ResultsScreen
        answers={answers}
        total={questions.length}
        courseSlug={courseSlug}
        onRetake={onRetake}
        elapsedSeconds={elapsedSeconds}
        isTimedOut={isTimedOut}
        isNewBest={isNewBest}
        prevBestSeconds={prevBestSeconds}
        courseBest={courseBest}
      />
    )
  }

  // ── Start screen ───────────────────────────────────────────────────────────
  if (phase === 'start') {
    return (
      <div>
        <div className="mb-8 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            ⏱ Timed Challenge
          </h2>

          {/* Toggle */}
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <div
              role="checkbox"
              aria-checked={timedMode}
              tabIndex={0}
              onClick={() => setTimedMode((v) => !v)}
              onKeyDown={(e) => e.key === 'Enter' && setTimedMode((v) => !v)}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer select-none ${
                timedMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  timedMode ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable timer</span>
          </label>

          {timedMode && (
            <>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Time limit</p>
              <div className="flex gap-2 mb-4 flex-wrap">
                {LIMIT_OPTIONS.map((min) => (
                  <button
                    key={min}
                    onClick={() => setTimeLimitMinutes(min)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      timeLimitMinutes === min
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {min} min
                  </button>
                ))}
              </div>
              {courseBest && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Your best: {formatTime(courseBest.timeSeconds)} · {courseBest.score}/
                  {courseBest.total} correct · {formatBestDate(courseBest.date)}
                </p>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setPhase('quiz')}
          className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Start test →
        </button>
      </div>
    )
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  const q = questions[currentIndex]
  const total = questions.length
  const answered = selected !== null
  const progressPct = Math.round((currentIndex / total) * 100)
  const correctSoFar = answers.filter((a) => a.isCorrect).length

  const timerColor =
    secondsRemaining < 30
      ? 'text-red-500 dark:text-red-400'
      : secondsRemaining < 60
        ? 'text-amber-500 dark:text-amber-400'
        : 'text-gray-400 dark:text-gray-500'

  function handleSelect(i: number) {
    if (answered) return
    setSelected(i)
  }

  function handleNext() {
    if (selected === null) return
    const isCorrect = selected === q.correctIndex
    applyExamResult(courseSlug, q.topicSlug, isCorrect)
    const newAnswer: TestAnswer = {
      topicSlug: q.topicSlug,
      topicTitle: q.topicTitle,
      isCorrect,
      explanation: q.explanation,
      questionText: q.question,
      selectedOptionText: q.options[selected],
      correctOptionText: q.options[q.correctIndex],
    }

    if (currentIndex + 1 >= total) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      const elapsed = timedMode ? timeLimitMinutes * 60 - secondsRemaining : null
      addXP('courseTestCompleted')
      finishWithAnswers([...answers, newAnswer], elapsed)
    } else {
      setAnswers((prev) => [...prev, newAnswer])
      setSelected(null)
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
        <div className="flex items-center gap-4">
          {timedMode && (
            <span className={`text-sm font-medium tabular-nums ${timerColor}`}>
              ⏱ {formatTime(secondsRemaining)} remaining
            </span>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">{correctSoFar} correct</span>
        </div>
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
              <button disabled={answered} onClick={() => handleSelect(i)} className={cls}>
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
  elapsedSeconds,
  isTimedOut,
  isNewBest,
  prevBestSeconds,
  courseBest,
}: {
  answers: TestAnswer[]
  total: number
  courseSlug: string
  onRetake: () => void
  elapsedSeconds: number | null
  isTimedOut: boolean
  isNewBest: boolean
  prevBestSeconds: number | null
  courseBest: TimedBest | null
}) {
  const correct = answers.filter((a) => a.isCorrect).length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

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
        {isTimedOut && (
          <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">
            ⏱ Time&apos;s up!
          </p>
        )}
        <div className={`text-6xl font-bold mb-3 ${gradeColor}`}>{grade}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {correct} / {total}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">{pct}% correct</div>

        {/* Timed result */}
        {elapsedSeconds !== null && (
          <div className="mt-4 space-y-1">
            {!isTimedOut && (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Completed in {formatTime(elapsedSeconds)}
              </p>
            )}
            {isNewBest ? (
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                🏆 New personal best!
              </p>
            ) : prevBestSeconds !== null ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Personal best: {formatTime(prevBestSeconds)}
              </p>
            ) : courseBest ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Personal best: {formatTime(courseBest.timeSeconds)}
              </p>
            ) : null}
          </div>
        )}
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
