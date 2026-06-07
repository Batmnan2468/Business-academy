'use client'

import { useState, useEffect, useCallback } from 'react'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
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
  difficulty: string
  onAnswer?: (correct: boolean) => void
  nextLabel?: string
  onNext?: () => void
}

export default function PracticeQuestion({ topicTitle, difficulty, onAnswer, nextLabel, onNext }: Props) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSelected(null)
    setQuestion(null)
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, difficulty }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      setQuestion(shuffleOptions(data as Question))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load question. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [topicTitle, difficulty])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

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

      <ul className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrectChoice = i === question.correctIndex

          let className =
            'w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-colors '

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
                onClick={() => {
                  setSelected(i)
                  onAnswer?.(i === question.correctIndex)
                }}
                className={className}
              >
                <span className="mr-3 text-xs opacity-60">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            </li>
          )
        })}
      </ul>

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
