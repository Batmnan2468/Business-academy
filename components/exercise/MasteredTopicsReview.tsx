'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMastery } from '@/lib/mastery'
import { TestSession, type TestQuestion } from './TestSession'

interface TopicItem {
  slug: string
  title: string
}

interface Props {
  courseSlug: string
  allTopics: TopicItem[]
}

type Phase = 'loading' | 'insufficient' | 'settings' | 'fetching' | 'session' | 'error'

const COUNT_OPTIONS = [10, 20, 30, 50]

export default function MasteredTopicsReview({ courseSlug, allTopics }: Props) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [masteredTopics, setMasteredTopics] = useState<TopicItem[]>([])
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set())
  const [questionCount, setQuestionCount] = useState(30)
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [generation, setGeneration] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const mastered = allTopics.filter((t) => {
      const m = getMastery(courseSlug, t.slug)
      return m !== null && m.masteryLevel >= 1
    })
    setMasteredTopics(mastered)
    setSelectedSlugs(new Set(mastered.map((t) => t.slug)))
    setPhase(mastered.length >= 5 ? 'settings' : 'insufficient')
  }, [courseSlug, allTopics])

  function toggleTopic(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  function handleSelectAll() {
    setSelectedSlugs(new Set(masteredTopics.map((t) => t.slug)))
  }

  function handleDeselectAll() {
    setSelectedSlugs(new Set())
  }

  async function handleStartTest() {
    const selectedTopics = masteredTopics.filter((t) => selectedSlugs.has(t.slug))
    if (selectedTopics.length === 0) return

    setPhase('fetching')
    setErrorMsg('')

    try {
      const res = await fetch('/api/cache-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug,
          topics: selectedTopics,
          count: questionCount,
        }),
      })
      const data = await res.json()
      if (!data.questions?.length) {
        setErrorMsg('No cached questions found for the selected topics.')
        setPhase('error')
      } else {
        setQuestions(data.questions as TestQuestion[])
        setGeneration((g) => g + 1)
        setPhase('session')
      }
    } catch {
      setErrorMsg('Failed to load questions. Please try again.')
      setPhase('error')
    }
  }

  if (phase === 'loading') {
    return (
      <div className="flex items-center gap-3 py-8">
        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">Loading mastery data…</p>
      </div>
    )
  }

  if (phase === 'insufficient') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl mx-auto mb-5">
          ⭐
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Not enough mastered topics yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          You need at least 5 mastered topics to use this mode.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">
          You currently have{' '}
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {masteredTopics.length}
          </span>{' '}
          mastered topic{masteredTopics.length !== 1 ? 's' : ''}.
        </p>
        <Link href={`/courses/${courseSlug}`} className="text-sm text-blue-500 hover:underline">
          ← Back to course
        </Link>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div>
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-5 py-4 mb-6">
          <p className="text-sm text-red-700 dark:text-red-300">{errorMsg}</p>
        </div>
        <button
          onClick={() => setPhase('settings')}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Back to settings
        </button>
      </div>
    )
  }

  if (phase === 'session') {
    return (
      <TestSession
        key={generation}
        questions={questions}
        courseSlug={courseSlug}
        onRetake={() => setPhase('settings')}
      />
    )
  }

  // Settings panel (phases: 'settings' | 'fetching')
  const isFetching = phase === 'fetching'
  const selectedCount = selectedSlugs.size
  const allSelected = selectedCount === masteredTopics.length
  const noneSelected = selectedCount === 0

  return (
    <div>
      {/* Question count */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Number of questions
        </p>
        <div className="flex gap-2">
          {COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              disabled={isFetching}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                questionCount === n
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Topic selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Topics ({selectedCount}/{masteredTopics.length} selected)
          </p>
          <div className="flex gap-3">
            {!allSelected && (
              <button
                onClick={handleSelectAll}
                disabled={isFetching}
                className="text-xs text-blue-500 hover:underline"
              >
                Select all
              </button>
            )}
            {!noneSelected && (
              <button
                onClick={handleDeselectAll}
                disabled={isFetching}
                className="text-xs text-gray-400 hover:underline"
              >
                Deselect all
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          {masteredTopics.map((t) => {
            const isSelected = selectedSlugs.has(t.slug)
            return (
              <label
                key={t.slug}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleTopic(t.slug)}
                  disabled={isFetching}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span
                  className={`text-sm font-medium flex-1 ${
                    isSelected
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {t.title}
                </span>
                <span className="text-amber-500 text-xs">★</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleStartTest}
        disabled={isFetching || noneSelected}
        className="w-full px-5 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {isFetching ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
            Loading questions…
          </span>
        ) : noneSelected ? (
          'Select at least one topic'
        ) : (
          `Start ${questionCount}-question test →`
        )}
      </button>
    </div>
  )
}
