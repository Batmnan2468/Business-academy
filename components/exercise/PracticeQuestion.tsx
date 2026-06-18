'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { isQuestionSaved, saveQuestion, removeQuestion } from '@/lib/savedQuestions'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type?: string
  difficulty?: string
}

function shuffleOptions(q: Question): Question {
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

interface Props {
  topicTitle: string
  topicSlug: string
  courseSlug: string
  courseTitle?: string
  difficulty: string
  onAnswer?: (correct: boolean, questionType: string, difficulty: string) => void
  nextLabel?: string
  onNext?: () => void
  hasLearnContent?: boolean
}

export default function PracticeQuestion({ topicTitle, topicSlug, courseSlug, courseTitle, difficulty, onAnswer, nextLabel, onNext, hasLearnContent }: Props) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [showKeyboardHint, setShowKeyboardHint] = useState(true)

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSelected(null)
    setQuestion(null)
    setIsSaved(false)
    setShowToast(false)
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, topicSlug, courseSlug, difficulty }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const q = shuffleOptions(data as Question)
      setQuestion(q)
      setIsSaved(isQuestionSaved(courseSlug, q.question))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load question. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [topicTitle, topicSlug, courseSlug, difficulty])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  // Keyboard navigation: 1–4 selects the corresponding option
  useEffect(() => {
    if (selected !== null || !question || loading) return

    function onKeyDown(e: KeyboardEvent) {
      if (!question || selected !== null) return
      const num = parseInt(e.key)
      if (isNaN(num) || num < 1 || num > question.options.length) return
      const index = num - 1
      setSelected(index)
      setShowKeyboardHint(false)
      onAnswer?.(
        index === question.correctIndex,
        question.type ?? '',
        question.difficulty ?? difficulty,
      )
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, question, loading, difficulty, onAnswer])

  // Enter or Space advances to next question after answering
  useEffect(() => {
    if (selected === null || !question) return

    const advance = onNext ?? fetchQuestion

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      advance()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, question, onNext, fetchQuestion])

  function handleSelect(index: number) {
    if (selected !== null || !question) return
    setSelected(index)
    setShowKeyboardHint(false)
    onAnswer?.(
      index === question.correctIndex,
      question.type ?? '',
      question.difficulty ?? difficulty,
    )
  }

  function handleSaveToggle() {
    if (!question) return
    if (isSaved) {
      removeQuestion(courseSlug, question.question)
      setIsSaved(false)
    } else {
      saveQuestion({
        topicSlug,
        topicTitle,
        courseSlug,
        courseTitle: courseTitle ?? courseSlug,
        question: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        type: question.type ?? '',
        difficulty: question.difficulty ?? difficulty,
        savedAt: new Date().toISOString(),
      })
      setIsSaved(true)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }
  }

  if (loading) {
    return (
      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
        Generating question…
      </p>
    )
  }

  if (error) {
    return (
      <div
        style={{
          border: '1px solid #fca5a5',
          borderRadius: '0.75rem',
          background: '#fff1f2',
          padding: '1rem 1.25rem',
          color: '#b91c1c',
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Failed to load question</p>
        <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem', fontFamily: 'monospace' }}>
          {error}
        </p>
        <button
          onClick={fetchQuestion}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'underline',
            color: '#b91c1c',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Try again
        </button>
      </div>
    )
  }

  if (!question) return null

  const answered = selected !== null
  const isCorrect = selected === question.correctIndex

  return (
    <div>
      <p className="text-lg font-medium mb-6 text-gray-900 dark:text-gray-100">
        {question.question}
      </p>

      <ul className="space-y-3 mb-2">
        {question.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrectChoice = i === question.correctIndex

          let className =
            'w-full text-left px-5 py-4 min-h-[48px] rounded-xl border text-sm font-medium transition-colors '

          if (!answered) {
            className += isSelected
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100'
              : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer'
          } else if (isCorrectChoice) {
            className +=
              'border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100'
          } else if (isSelected) {
            className +=
              'border-red-400 bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100'
          } else {
            className +=
              'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-default'
          }

          return (
            <li key={i}>
              <button
                disabled={answered}
                onClick={() => handleSelect(i)}
                className={className}
              >
                <span className="mr-3 text-xs opacity-60">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            </li>
          )
        })}
      </ul>

      {showKeyboardHint && !answered && (
        <p className="text-xs text-gray-400 dark:text-gray-600 mb-4 pl-1">
          Tip: press 1–4 to answer, Enter to continue
        </p>
      )}

      {/* Save for later button */}
      <div className="mb-6">
        <button
          onClick={handleSaveToggle}
          className={`block w-full text-left py-2 text-xs font-medium transition-colors ${
            isSaved
              ? 'text-amber-600 dark:text-amber-400 hover:text-red-500 dark:hover:text-red-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {isSaved ? '✓ Saved — tap to remove' : '🚩 Save for later'}
        </button>
        {showToast && (
          <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">
            Question saved to your review list ✓
          </p>
        )}
      </div>

      {answered && (
        <>
          <div
            className={`rounded-xl px-5 py-4 text-sm border mb-4 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            <p className="font-semibold mb-1">{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</p>
            <p>{question.explanation}</p>
          </div>

          {!isCorrect && hasLearnContent && (
            <Link
              href={`/courses/${courseSlug}/learn/${topicSlug}`}
              className="block mt-3 mb-4 text-sm text-blue-500 hover:underline"
            >
              📖 Review this topic in Learn Mode →
            </Link>
          )}

          <button
            onClick={onNext ?? fetchQuestion}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            {nextLabel ?? 'Next question →'}
          </button>
        </>
      )}
    </div>
  )
}
