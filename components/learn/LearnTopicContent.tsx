'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { LearnContent, LearnContentV2 } from '@/types'
import {
  getLearnThought,
  setLearnThought,
  setLearnState,
  getLearnRating,
  setLearnRating,
} from '@/lib/learnState'
import type { LearnRating } from '@/lib/learnState'

interface NextTopic {
  slug: string
  title: string
}

interface Props {
  courseSlug: string
  topicSlug: string
  learnV2: LearnContentV2
  nextTopic?: NextTopic | null
}

interface PropsLegacy {
  courseSlug: string
  topicSlug: string
  learnLegacy: LearnContent
  nextTopic?: NextTopic | null
}

// ── Legacy (v1) layout — single page, no progressive reveal ────────────────

export function LearnTopicContentLegacy({ courseSlug, topicSlug, learnLegacy, nextTopic }: PropsLegacy) {
  useEffect(() => {
    setLearnState(courseSlug, topicSlug, 'reading')
  }, [courseSlug, topicSlug])

  return (
    <div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base">
        {learnLegacy.explanation}
      </p>

      <ul className="space-y-2 mb-6">
        {learnLegacy.keyPoints.map((point, i) => (
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
          {learnLegacy.example}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {nextTopic && (
          <Link
            href={`/courses/${courseSlug}/learn/${nextTopic.slug}`}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Next: {nextTopic.title} →
          </Link>
        )}
        <Link
          href={`/courses/${courseSlug}/practice/${topicSlug}`}
          className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Start Practicing →
        </Link>
      </div>
    </div>
  )
}

// ── V2 progressive reveal ─────────────────────────────────────────────────

type Stage = 0 | 1 | 2 | 3

export default function LearnTopicContent({ courseSlug, topicSlug, learnV2, nextTopic }: Props) {
  const [stage, setStage] = useState<Stage>(0)
  const [thought, setThoughtState] = useState('')
  const [rating, setRatingState] = useState<LearnRating | null>(null)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLearnState(courseSlug, topicSlug, 'reading')
    const saved = getLearnThought(courseSlug, topicSlug)
    if (saved) setThoughtState(saved)
    const savedRating = getLearnRating(courseSlug, topicSlug)
    if (savedRating) {
      setRatingState(savedRating)
      setRatingSubmitted(true)
      setStage(3)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleThoughtChange(v: string) {
    setThoughtState(v)
    setLearnThought(courseSlug, topicSlug, v)
  }

  function advance(next: Stage) {
    setStage(next)
    setTimeout(() => {
      revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function submitRating(r: LearnRating) {
    setRatingState(r)
    setRatingSubmitted(true)
    setLearnRating(courseSlug, topicSlug, r)
    setLearnState(courseSlug, topicSlug, 'completed')
  }

  const savedThought = getLearnThought(courseSlug, topicSlug)

  return (
    <div className="space-y-6">
      {/* Stage 0 — Opening question */}
      {stage === 0 ? (
        <div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white leading-snug mb-6">
            {learnV2.openingQuestion}
          </p>
          <textarea
            value={thought}
            onChange={(e) => handleThoughtChange(e.target.value)}
            placeholder="Write your initial thoughts here before seeing the explanation..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 px-4 py-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
          <button
            onClick={() => advance(1)}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            {"I've written my thoughts → Reveal Layer 1"}
          </button>
        </div>
      ) : (
        /* Collapsed opening card */
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 px-5 py-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-1 font-medium">
            {learnV2.openingQuestion}
          </p>
          {savedThought && (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">&ldquo;{savedThought}&rdquo;</p>
          )}
          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Your initial thinking ↑</p>
        </div>
      )}

      {/* Stage 1 — Anchor */}
      {stage >= 1 && (
        <div ref={stage === 1 ? revealRef : undefined}>
          {stage === 1 ? (
            <div
              className="animate-in"
              style={{
                animation: 'fadeSlideIn 0.3s ease-out',
              }}
            >
              <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
              <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-5 py-5 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
                  The Core Idea
                </p>
                <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed">
                  {learnV2.anchor}
                </p>
              </div>
              <button
                onClick={() => advance(2)}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Continue →
              </button>
            </div>
          ) : (
            /* Collapsed anchor summary */
            <p className="text-sm text-gray-400 dark:text-gray-500 italic px-1">
              {learnV2.anchorSummary}
            </p>
          )}
        </div>
      )}

      {/* Stage 2 — Mechanism */}
      {stage >= 2 && (
        <div ref={stage === 2 ? revealRef : undefined}>
          {stage === 2 ? (
            <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-5 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  How and Why
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {learnV2.mechanism}
                </p>
              </div>
              <button
                onClick={() => advance(3)}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                Continue →
              </button>
            </div>
          ) : (
            /* Collapsed mechanism summary */
            <p className="text-sm text-gray-400 dark:text-gray-500 italic px-1">
              {learnV2.mechanismSummary}
            </p>
          )}
        </div>
      )}

      {/* Stage 3 — Final reveal */}
      {stage >= 3 && (
        <div ref={revealRef} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
          {/* Boundary Conditions */}
          <div className="rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
              When this breaks down:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {learnV2.boundaryConditions}
            </p>
          </div>

          {/* Worked Example */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
              Worked Example:
            </p>
            <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed whitespace-pre-line">
              {learnV2.example}
            </p>
          </div>

          {/* Bridge to Abstract */}
          <div className="rounded-xl border border-purple-100 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/20 px-5 py-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-2">
              The general principle:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {learnV2.bridgeToAbstract}
            </p>
          </div>

          {/* Key Points */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              What students get wrong:
            </p>
            <ul className="space-y-2">
              {learnV2.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-blue-500 shrink-0 font-bold mt-0.5">→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Self-rating */}
          {!ratingSubmitted ? (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-5">
              {savedThought && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-400 mb-1">Your initial thinking:</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">&ldquo;{savedThought}&rdquo;</p>
                </div>
              )}
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How did your initial thinking compare?
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => submitRating('nailed')}
                  className="px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors border border-green-200 dark:border-green-800"
                >
                  ✓ Nailed it
                </button>
                <button
                  onClick={() => submitRating('partial')}
                  className="px-4 py-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/60 transition-colors border border-yellow-200 dark:border-yellow-800"
                >
                  ~ Partially right
                </button>
                <button
                  onClick={() => submitRating('missed')}
                  className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors border border-red-200 dark:border-red-800"
                >
                  ✗ Missed it
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 px-5 py-4 mb-4">
                <p className="text-xs text-gray-400 mb-1">
                  Self-assessment:{' '}
                  <span
                    className={
                      rating === 'nailed'
                        ? 'text-green-500 font-medium'
                        : rating === 'partial'
                          ? 'text-yellow-500 font-medium'
                          : 'text-red-500 font-medium'
                    }
                  >
                    {rating === 'nailed' ? '✓ Nailed it' : rating === 'partial' ? '~ Partially right' : '✗ Missed it'}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                {nextTopic && (
                  <Link
                    href={`/courses/${courseSlug}/learn/${nextTopic.slug}`}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                  >
                    Next Topic → {nextTopic.title}
                  </Link>
                )}
                <Link
                  href={`/courses/${courseSlug}/practice/${topicSlug}`}
                  className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Start Practicing →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
