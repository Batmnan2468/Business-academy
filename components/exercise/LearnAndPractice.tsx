'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import PracticeQuestion from './PracticeQuestion'
import { onTopicCompleted } from '@/lib/mastery'
import { getTopicState, setTopicState } from '@/lib/topicState'
import { setLastPracticeVisit } from '@/lib/learnState'
import { recordAnswer } from '@/lib/mistakeTracker'

const MASTERY_STREAK = 4

interface LearnContent {
  explanation: string
  example: string
  keyPoints: string[]
}

interface NextTopic {
  slug: string
  title: string
}

interface Props {
  topicTitle: string
  topicSlug: string
  learn?: LearnContent
  courseSlug: string
  courseTitle?: string
  nextTopic?: NextTopic | null
}

function markTopicComplete(courseSlug: string, topicSlug: string) {
  try {
    const key = `completed:${courseSlug}`
    const existing: string[] = JSON.parse(localStorage.getItem(key) ?? '[]')
    if (!existing.includes(topicSlug)) {
      localStorage.setItem(key, JSON.stringify([...existing, topicSlug]))
    }
  } catch {
    // localStorage unavailable
  }
}

interface Session {
  total: number
  correct: number
  streak: number
  masteryPending: boolean
  showMastery: boolean
}

const INITIAL_SESSION: Session = {
  total: 0,
  correct: 0,
  streak: 0,
  masteryPending: false,
  showMastery: false,
}

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

export default function LearnAndPractice({ topicTitle, topicSlug, learn, courseSlug, courseTitle, nextTopic }: Props) {
  const initialMode = learn ? 'learn' : 'practice'
  const [mode, setMode] = useState<'learn' | 'practice'>(initialMode)
  const [session, setSession] = useState<Session>(INITIAL_SESSION)
  const [difficulty, setDifficulty] = useState('medium')

  // Transition topic state on mount
  useEffect(() => {
    const current = getTopicState(courseSlug, topicSlug)
    if (current === 'untouched') {
      setTopicState(courseSlug, topicSlug, 'inProgress')
    } else if (current === 'practiced' && initialMode === 'practice') {
      // Starting directly in practice mode is a new session — risk of regression
      setTopicState(courseSlug, topicSlug, 'inProgress')
    }
    if (initialMode === 'practice') {
      setLastPracticeVisit(courseSlug, topicSlug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startPractice() {
    const current = getTopicState(courseSlug, topicSlug)
    if (current === 'practiced') {
      setTopicState(courseSlug, topicSlug, 'inProgress')
    }
    setMode('practice')
  }

  function handleAnswer(isCorrect: boolean, questionType: string, questionDifficulty: string) {
    recordAnswer(courseSlug, topicSlug, questionType, questionDifficulty, isCorrect)
    setSession((prev) => {
      const newStreak = isCorrect ? prev.streak + 1 : 0
      return {
        total: prev.total + 1,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        streak: newStreak,
        masteryPending: newStreak >= MASTERY_STREAK,
        showMastery: false,
      }
    })
  }

  function handleMasteryTransition() {
    markTopicComplete(courseSlug, topicSlug)
    onTopicCompleted(courseSlug, topicSlug)
    setTopicState(courseSlug, topicSlug, 'practiced')
    setSession((prev) => ({ ...prev, showMastery: true }))
  }

  function handleKeepPracticing() {
    const current = getTopicState(courseSlug, topicSlug)
    if (current === 'practiced') {
      setTopicState(courseSlug, topicSlug, 'inProgress')
    }
    setSession(INITIAL_SESSION)
  }

  // --- Practice mode ---
  if (mode === 'practice' || !learn) {
    if (session.showMastery) {
      return (
        <MasteryScreen
          topicTitle={topicTitle}
          correct={session.correct}
          total={session.total}
          courseSlug={courseSlug}
          nextTopic={nextTopic}
          onKeepPracticing={handleKeepPracticing}
        />
      )
    }

    return (
      <div>
        {/* Header: back link (left) + session score (right) */}
        <div className="flex flex-wrap items-center justify-between gap-y-1 mb-6">
          {learn ? (
            <button
              onClick={() => setMode('learn')}
              className="text-sm text-blue-500 hover:underline"
            >
              ← Review explanation
            </button>
          ) : (
            <span />
          )}
          <span className="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
            Session:{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">{session.correct}</span>
            {' '}correct / {session.total} answered
          </span>
        </div>

        {session.total > 0 && (
          <ScoreBar
            correct={session.correct}
            total={session.total}
            streak={session.streak}
          />
        )}

        <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={session.total > 0} />

        <PracticeQuestion
          topicTitle={topicTitle}
          topicSlug={topicSlug}
          courseSlug={courseSlug}
          courseTitle={courseTitle}
          difficulty={difficulty}
          onAnswer={handleAnswer}
          nextLabel={session.masteryPending ? 'See results →' : undefined}
          onNext={session.masteryPending ? handleMasteryTransition : undefined}
        />
      </div>
    )
  }

  // --- Learn mode ---
  return (
    <div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base">
        {learn.explanation}
      </p>

      <ul className="space-y-2 mb-6">
        {learn.keyPoints.map((point, i) => (
          <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
            <span className="text-blue-500 shrink-0 font-bold mt-0.5">→</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
          Worked Example
        </p>
        <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-line">
          {learn.example}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
        <button
          onClick={startPractice}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Start Practicing →
        </button>
      </div>
    </div>
  )
}

// --- Sub-components ---

function ScoreBar({
  correct,
  total,
  streak,
}: {
  correct: number
  total: number
  streak: number
}) {
  const [flashGreen, setFlashGreen] = useState(false)
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  useEffect(() => {
    if (streak === MASTERY_STREAK) {
      setFlashGreen(true)
      const t = setTimeout(() => setFlashGreen(false), 700)
      return () => clearTimeout(t)
    }
  }, [streak])

  return (
    <div className="mb-6">
      {/* Thin animated progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${accuracy}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{correct}</span>
          <span className="mx-1 text-gray-300 dark:text-gray-600">/</span>
          <span>{total}</span>
          <span className="ml-1">correct</span>
          <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            ({accuracy}%)
          </span>
        </span>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: MASTERY_STREAK }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i < streak
                    ? flashGreen
                      ? 'bg-green-500 scale-125'
                      : 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          {streak > 0 && (
            <span className={`text-xs font-medium tabular-nums transition-colors ${flashGreen ? 'text-green-500' : 'text-blue-500'}`}>
              {streak} in a row
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function MasteryScreen({
  topicTitle,
  correct,
  total,
  courseSlug,
  nextTopic,
  onKeepPracticing,
}: {
  topicTitle: string
  correct: number
  total: number
  courseSlug: string
  nextTopic?: NextTopic | null
  onKeepPracticing: () => void
}) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const emoji = accuracy >= 90 ? '🎯' : accuracy >= 70 ? '⭐' : '📚'
  const bgColor = accuracy >= 90
    ? 'bg-green-100 dark:bg-green-900/30'
    : accuracy >= 70
    ? 'bg-yellow-100 dark:bg-yellow-900/30'
    : 'bg-blue-100 dark:bg-blue-900/30'

  return (
    <div className="text-center py-6">
      <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center text-3xl mx-auto mb-5`}>
        {emoji}
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Topic practiced!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
        4 correct answers in a row on{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{topicTitle}</span>.
      </p>

      {/* Accuracy breakdown */}
      <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{correct}/{total}</p>
          <p className="text-xs text-gray-400">correct</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
        <div className="text-center">
          <p className={`text-2xl font-bold ${accuracy >= 70 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {accuracy}%
          </p>
          <p className="text-xs text-gray-400">accuracy</p>
        </div>
      </div>

      {accuracy < 70 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-6 px-4">
          Consider reviewing the learn content before moving on.
        </p>
      )}

      <div className={`flex flex-col gap-3 items-center ${accuracy >= 70 ? 'mt-6' : ''}`}>
        {nextTopic && (
          <Link
            href={`/courses/${courseSlug}/practice/${nextTopic.slug}`}
            className="w-full max-w-xs px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Next: {nextTopic.title} →
          </Link>
        )}

        <Link
          href={`/courses/${courseSlug}`}
          className={`w-full max-w-xs px-5 py-3 rounded-xl border text-sm font-medium transition-colors ${
            nextTopic
              ? 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
          }`}
        >
          ← Return to topic list
        </Link>

        <button
          onClick={onKeepPracticing}
          className="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors mt-1"
        >
          Keep practicing this topic
        </button>
      </div>
    </div>
  )
}

function DifficultySelector({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-xs text-gray-400 shrink-0">Difficulty:</span>
      <div className="flex gap-1">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            onClick={() => !disabled && onChange(d.value)}
            disabled={disabled}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              value === d.value
                ? 'bg-blue-600 text-white'
                : disabled
                  ? 'text-gray-300 dark:text-gray-600 cursor-default'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      {disabled && (
        <span className="text-xs text-gray-400 italic">locked during session</span>
      )}
    </div>
  )
}
