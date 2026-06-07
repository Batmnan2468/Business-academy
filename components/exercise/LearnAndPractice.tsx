'use client'
import { useState } from 'react'
import PracticeQuestion from './PracticeQuestion'

interface LearnContent {
  explanation: string
  example: string
  keyPoints: string[]
}

interface Props {
  topicTitle: string
  learn?: LearnContent
}

export default function LearnAndPractice({ topicTitle, learn }: Props) {
  const [mode, setMode] = useState<'learn' | 'practice'>(learn ? 'learn' : 'practice')

  if (mode === 'practice' || !learn) {
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
        <PracticeQuestion topicTitle={topicTitle} />
      </div>
    )
  }

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

      <button
        onClick={() => setMode('practice')}
        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
      >
        Start Practicing →
      </button>
    </div>
  )
}
