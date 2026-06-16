'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface VisitData {
  courseSlug: string
  topicSlug: string
}

interface Props {
  topicMap: Record<string, string>
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export default function ContinueCard({ topicMap }: Props) {
  const [learnVisit, setLearnVisit] = useState<VisitData | null>(null)
  const [practiceVisit, setPracticeVisit] = useState<VisitData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const lv = localStorage.getItem('lastLearnVisit')
      const pv = localStorage.getItem('lastPracticeVisit')
      if (lv) setLearnVisit(JSON.parse(lv) as VisitData)
      if (pv) setPracticeVisit(JSON.parse(pv) as VisitData)
    } catch {
      // localStorage unavailable
    }
    setMounted(true)
  }, [])

  if (!mounted || (!learnVisit && !practiceVisit)) return null

  function topicTitle(v: VisitData): string {
    return topicMap[`${v.courseSlug}__${v.topicSlug}`] ?? v.topicSlug
  }

  return (
    <div className="mb-8 px-4 py-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Continue studying →</p>
      <div className="flex flex-wrap gap-3">
        {learnVisit && (
          <Link
            href={`/courses/${learnVisit.courseSlug}/learn/${learnVisit.topicSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            📖 Resume: {truncate(topicTitle(learnVisit), 30)}
          </Link>
        )}
        {practiceVisit && (
          <Link
            href={`/courses/${practiceVisit.courseSlug}/practice/${practiceVisit.topicSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          >
            ✏️ Practice: {truncate(topicTitle(practiceVisit), 30)}
          </Link>
        )}
      </div>
    </div>
  )
}
