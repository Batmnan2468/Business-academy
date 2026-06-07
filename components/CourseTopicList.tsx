'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

export default function CourseTopicList({ courseSlug, units, topics, totalTopics }: Props) {
  const [completed, setCompleted] = useState<Set<string> | null>(null)

  useEffect(() => {
    setCompleted(getCompleted(courseSlug))
    function onStorage() {
      setCompleted(getCompleted(courseSlug))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [courseSlug])

  const completedCount = completed?.size ?? 0
  const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  function topicRow(topic: TopicItem, num: number) {
    const done = completed?.has(topic.slug)
    return (
      <li key={topic.id}>
        <Link
          href={`/courses/${courseSlug}/${topic.slug}`}
          className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group"
        >
          {done ? (
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold shrink-0">
              ✓
            </span>
          ) : (
            <span className="text-sm text-gray-400 w-6 shrink-0 tabular-nums">{num}</span>
          )}
          <span
            className={`flex-1 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 ${
              done
                ? 'text-gray-500 dark:text-gray-500'
                : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {topic.title}
          </span>
          <span className="text-gray-400 group-hover:text-blue-400 text-sm">→</span>
        </Link>
      </li>
    )
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{completedCount}</span>
            /{totalTopics} topics completed
          </span>
          {completedCount > 0 && (
            <span className="text-xs text-gray-400">{pct}%</span>
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
          {units.map((unit) => {
            return (
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
            )
          })}
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
    if (unit.id === unitId) {
      return count + topicIndex + 1
    }
    count += unit.topics.length
  }
  return count + topicIndex + 1
}
