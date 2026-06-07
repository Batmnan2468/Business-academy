'use client'
import { useState } from 'react'
import Link from 'next/link'
import PracticeQuestion from './PracticeQuestion'

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

export default function LearnAndPractice({ topicTitle, topicSlug, learn, courseSlug, nextTopic }: Props) {
  const [mode, setMode] = useState<'learn' | 'practice'>(learn ? 'learn' : 'practice')
  const [session, setSession] = useState<Session>(INITIAL_SESSION)
  const [difficulty, setDifficulty] = useState('medium')

  function handleAnswer(isCorrect: boolean) {
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
    setSession((prev) => ({ ...prev, showMastery: true }))
  }

  function handleKeepPracticing() {
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
        {learn && (
          <button
            onClick={() => setMode('learn')}
            className="text-sm text-blue-500 hover:underline mb-8 inline-block"
          >
            ← Review explanation
          </button>
        )}

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

      <div className="flex items-center gap-4 flex-wrap">
        <DifficultySelector value={difficulty} onChange={setDifficulty} />
        <button
          onClick={() => setMode('practice')}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
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
  return (
    <div className="flex items-center justify-between mb-6 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-white">{correct}</span>
        <span className="mx-1 text-gray-300 dark:text-gray-600">/</span>
        <span>{total}</span>
        <span className="ml-1">correct</span>
      </span>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: MASTERY_STREAK }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i < streak
                  ? 'bg-blue-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        {streak > 0 && (
          <span className="text-xs font-medium text-blue-500 tabular-nums">
            {streak} in a row
          </span>
        )}
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

  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mx-auto mb-5">
        🎯
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Topic mastered!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
        4 correct answers in a row on{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{topicTitle}</span>.
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-xs mb-10">
        {correct}/{total} correct this session · {accuracy}% accuracy
      </p>

      <div className="flex flex-col gap-3 items-center">
        {nextTopic && (
          <Link
            href={`/courses/${courseSlug}/${nextTopic.slug}`}
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
