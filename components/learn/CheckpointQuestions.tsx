'use client'

import { useState, useEffect } from 'react'
import type { PracticeQuestion } from '@/types'

interface Props {
  questions: PracticeQuestion[]
  onComplete: (score: number) => void
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export default function CheckpointQuestions({ questions, onComplete }: Props) {
  const [picked, setPicked] = useState<PracticeQuestion[]>([])
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setPicked(pickRandom(questions, Math.min(3, questions.length)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (picked.length === 0) return null

  const total = picked.length
  const current = picked[idx]

  function handleSelect(optionIdx: number) {
    if (answered) return
    setSelected(optionIdx)
    setAnswered(true)
  }

  function handleNext() {
    const gained = selected === current.correctIndex ? 1 : 0
    const newScore = score + gained
    if (idx < total - 1) {
      setScore(newScore)
      setIdx(idx + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      onComplete(newScore)
    }
  }

  return (
    <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Checkpoint {idx + 1} of {total}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < idx
                  ? 'bg-blue-400'
                  : i === idx
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-relaxed mb-4">
        {current.question}
      </p>

      <div className="space-y-2 mb-4">
        {current.options.map((opt, i) => {
          let cls =
            'w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors cursor-pointer'
          if (!answered) {
            cls +=
              i === selected
                ? ' border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : ' border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          } else {
            if (i === current.correctIndex) {
              cls +=
                ' border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            } else if (i === selected) {
              cls +=
                ' border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
            } else {
              cls += ' border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-default'
            }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={answered} className={cls}>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <>
          <div className="mb-4 px-4 py-3 rounded-lg bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
            <p
              className={`text-xs font-semibold mb-1 ${
                selected === current.correctIndex
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {selected === current.correctIndex ? '✓ Correct' : '✗ Incorrect'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {current.explanation}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            {idx < total - 1 ? 'Next Checkpoint →' : 'See Results →'}
          </button>
        </>
      )}
    </div>
  )
}
