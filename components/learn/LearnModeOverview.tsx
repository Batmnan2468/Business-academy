'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getLearnState } from '@/lib/learnState'
import type { LearnState } from '@/lib/learnState'

interface TopicItem {
  id: string
  slug: string
  title: string
}

interface UnitItem {
  id: string
  title: string
  topics: TopicItem[]
}

interface Props {
  courseSlug: string
  units?: UnitItem[]
  topics?: TopicItem[]
}

function LearnStateIcon({ state }: { state: LearnState }) {
  if (state === 'completed') {
    return (
      <span title="Completed" style={{ color: '#22c55e' }} className="text-base shrink-0">
        📗
      </span>
    )
  }
  if (state === 'reading') {
    return (
      <span title="In progress" style={{ color: '#3b82f6' }} className="text-base shrink-0">
        📖
      </span>
    )
  }
  return (
    <span title="Not started" className="text-base shrink-0 opacity-30">
      📓
    </span>
  )
}

export default function LearnModeOverview({ courseSlug, units, topics }: Props) {
  const [stateMap, setStateMap] = useState<Map<string, LearnState>>(new Map())

  function refresh() {
    const allSlugs = [
      ...(units?.flatMap((u) => u.topics.map((t) => t.slug)) ?? []),
      ...(topics?.map((t) => t.slug) ?? []),
    ]
    const map = new Map<string, LearnState>()
    for (const slug of allSlugs) {
      map.set(slug, getLearnState(courseSlug, slug))
    }
    setStateMap(map)
  }

  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug])

  function topicRow(topic: TopicItem, num: number) {
    const state = stateMap.get(topic.slug) ?? 'unread'
    return (
      <li key={topic.id}>
        <Link
          href={`/courses/${courseSlug}/learn/${topic.slug}`}
          className="flex items-center gap-3 px-5 py-4 min-h-[48px] rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group"
        >
          <LearnStateIcon state={state} />
          <span className="text-xs text-gray-400 tabular-nums w-5 shrink-0">{num}</span>
          <span
            className={`flex-1 min-w-0 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 ${
              state === 'completed'
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {topic.title}
          </span>
          {state === 'completed' && (
            <span className="text-xs text-green-500 font-medium shrink-0">Done</span>
          )}
          {state === 'reading' && (
            <span className="text-xs text-blue-500 font-medium shrink-0">In progress</span>
          )}
          <span className="text-gray-400 group-hover:text-blue-400 text-sm ml-1">→</span>
        </Link>
      </li>
    )
  }

  if (units) {
    let globalNum = 0
    return (
      <div className="space-y-8">
        {units.map((unit) => {
          const completedCount = unit.topics.filter(
            (t) => (stateMap.get(t.slug) ?? 'unread') === 'completed',
          ).length

          return (
            <div key={unit.id}>
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {unit.title}
                </h2>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {completedCount}/{unit.topics.length} completed
                </span>
              </div>
              <ul className="list-none space-y-2 m-0 p-0">
                {unit.topics.map((topic) => {
                  globalNum++
                  return topicRow(topic, globalNum)
                })}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Topics
      </h2>
      <ul className="list-none space-y-2 m-0 p-0">
        {(topics ?? []).map((topic, i) => topicRow(topic, i + 1))}
      </ul>
    </>
  )
}
