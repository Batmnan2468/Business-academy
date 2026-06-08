'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMastery, getMasteryPct, isDueToday } from '@/lib/mastery'
import type { TopicMastery } from '@/lib/mastery'

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
  totalTopics: number
}

function getCompleted(courseSlug: string): Set<string> {
  try {
    const raw = localStorage.getItem(`completed:${courseSlug}`)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function loadMasteryMap(
  courseSlug: string,
  units: UnitItem[] | undefined,
  topics: TopicItem[] | undefined,
): { map: Map<string, TopicMastery>; dueCount: number } {
  const allSlugs = [
    ...(units?.flatMap((u) => u.topics.map((t) => t.slug)) ?? []),
    ...(topics?.map((t) => t.slug) ?? []),
  ]
  const map = new Map<string, TopicMastery>()
  let dueCount = 0
  for (const slug of allSlugs) {
    const m = getMastery(courseSlug, slug)
    if (m) {
      map.set(slug, m)
      if (isDueToday(m)) dueCount++
    }
  }
  return { map, dueCount }
}

export default function CourseTopicList({ courseSlug, units, topics, totalTopics }: Props) {
  const [completed, setCompleted] = useState<Set<string> | null>(null)
  const [masteryMap, setMasteryMap] = useState<Map<string, TopicMastery>>(new Map())
  const [dueCount, setDueCount] = useState(0)

  function refresh() {
    setCompleted(getCompleted(courseSlug))
    const { map, dueCount: due } = loadMasteryMap(courseSlug, units, topics)
    setMasteryMap(map)
    setDueCount(due)
  }

  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug])

  const completedCount = completed?.size ?? 0
  const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  function topicRow(topic: TopicItem, num: number) {
    const done = completed?.has(topic.slug)
    const mastery = masteryMap.get(topic.slug)
    const masteryPct = mastery ? getMasteryPct(mastery) : null
    const isPerm = mastery?.permanentlyMastered ?? false
    const isDecayed = mastery !== undefined && !isPerm && masteryPct === 0

    // Left icon
    let icon: React.ReactNode
    if (isPerm) {
      icon = (
        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500 text-xs font-bold shrink-0">
          ★
        </span>
      )
    } else if (mastery) {
      icon = (
        <span
          className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
            isDecayed
              ? 'bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400'
              : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
          }`}
        >
          {isDecayed ? '!' : '✓'}
        </span>
      )
    } else if (done) {
      // Legacy completed without mastery data
      icon = (
        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold shrink-0">
          ✓
        </span>
      )
    } else {
      icon = (
        <span className="text-sm text-gray-400 w-6 shrink-0 tabular-nums">{num}</span>
      )
    }

    // Mastery level dots (●●○○) and percentage
    let rightBadge: React.ReactNode = null
    if (isPerm) {
      rightBadge = (
        <span className="text-xs text-yellow-500 font-medium shrink-0">Mastered</span>
      )
    } else if (mastery) {
      const level = mastery.masteryLevel
      rightBadge = (
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Dots: filled up to level, empty for remainder (max shown = 4) */}
          <div className="flex gap-0.5">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < level
                    ? isDecayed
                      ? 'bg-red-400 dark:bg-red-500'
                      : 'bg-green-400 dark:bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <span
            className={`text-xs tabular-nums ${
              isDecayed ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {masteryPct}%
          </span>
        </div>
      )
    }

    // Row border color
    let borderClass = 'border-gray-200 dark:border-gray-700'
    if (isPerm) borderClass = 'border-yellow-200 dark:border-yellow-800'
    else if (isDecayed) borderClass = 'border-red-200 dark:border-red-800'

    return (
      <li key={topic.id}>
        <Link
          href={`/courses/${courseSlug}/${topic.slug}`}
          className={`flex items-center gap-4 px-5 py-4 rounded-xl border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group ${borderClass}`}
        >
          {icon}
          <span
            className={`flex-1 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 ${
              done || mastery
                ? 'text-gray-500 dark:text-gray-500'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {topic.title}
          </span>
          {rightBadge}
          <span className="text-gray-400 group-hover:text-blue-400 text-sm ml-1">→</span>
        </Link>
      </li>
    )
  }

  return (
    <div>
      {/* Progress + Daily Review row */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{completedCount}</span>
            /{totalTopics} topics completed
            {completedCount > 0 && (
              <span className="ml-2 text-xs text-gray-400">{pct}%</span>
            )}
          </span>

          {dueCount > 0 && (
            <Link
              href={`/courses/${courseSlug}/review`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-xs font-medium text-blue-700 dark:text-blue-300"
            >
              <span>🔁 Daily Review</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold leading-none">
                {dueCount}
              </span>
            </Link>
          )}
        </div>

        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {units ? (
        <div className="space-y-8">
          {units.map((unit) => (
            <div key={unit.id}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {unit.title}
              </h2>
              <ul className="list-none space-y-2 m-0 p-0">
                {unit.topics.map((topic, i) => {
                  const globalNum = getGlobalNum(units, unit.id, i)
                  return topicRow(topic, globalNum)
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Topics
          </h2>
          <ul className="list-none space-y-2 m-0 p-0">
            {(topics ?? []).map((topic, i) => topicRow(topic, i + 1))}
          </ul>
        </>
      )}
    </div>
  )
}

function getGlobalNum(units: UnitItem[], unitId: string, topicIndex: number): number {
  let count = 0
  for (const unit of units) {
    if (unit.id === unitId) return count + topicIndex + 1
    count += unit.topics.length
  }
  return count + topicIndex + 1
}
