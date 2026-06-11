'use client'

import { useState, useEffect } from 'react'

interface Props {
  courseSlug: string
  subject: string
  title: string
  description: string
  level: string
  totalTopics: number
  topicSlugs: string[]
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function CourseCard({
  courseSlug,
  subject,
  title,
  description,
  level,
  totalTopics,
  topicSlugs,
}: Props) {
  const [practicedCount, setPracticedCount] = useState<number | null>(null)

  useEffect(() => {
    try {
      let count = 0
      for (const slug of topicSlugs) {
        const state = localStorage.getItem(`topicState_${courseSlug}_${slug}`) ?? 'untouched'
        if (state === 'practiced' || state === 'mastered') count++
      }
      setPracticedCount(count)
    } catch {
      setPracticedCount(0)
    }
  }, [courseSlug, topicSlugs])

  const pct =
    practicedCount !== null && totalTopics > 0
      ? Math.round((practicedCount / totalTopics) * 100)
      : null

  return (
    <div className="rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {subject}
        </span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${levelColors[level] ?? ''}`}
        >
          {level}
        </span>
      </div>
      <h3 className="font-semibold text-base leading-snug mb-1">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 flex-1">{description}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-gray-400">
            {practicedCount !== null ? (
              <>
                <span className="font-medium text-gray-600">{practicedCount}</span>
                /{totalTopics} topics practiced
              </>
            ) : (
              <>{totalTopics} topics</>
            )}
          </p>
          {pct !== null && pct > 0 && (
            <p className="text-xs font-medium" style={{ color: '#ca8a04' }}>
              {pct}%
            </p>
          )}
        </div>
        <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct ?? 0}%`, backgroundColor: '#eab308' }}
          />
        </div>
      </div>
    </div>
  )
}
