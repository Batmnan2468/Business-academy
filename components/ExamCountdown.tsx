'use client'

import { useState, useEffect } from 'react'

interface CourseOption {
  slug: string
  abbr: string
}

interface ExamPill {
  slug: string
  abbr: string
  daysRemaining: number
}

interface Props {
  courses: CourseOption[]
}

export default function ExamCountdown({ courses }: Props) {
  const [pills, setPills] = useState<ExamPill[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formCourse, setFormCourse] = useState(courses[0]?.slug ?? '')
  const [formDate, setFormDate] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('examDates')
      if (!stored) return
      const examDates: Record<string, string> = JSON.parse(stored)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const newPills: ExamPill[] = []
      for (const c of courses) {
        const dateStr = examDates[c.slug]
        if (!dateStr) continue
        const examDate = new Date(dateStr)
        examDate.setHours(0, 0, 0, 0)
        const daysRemaining = Math.floor((examDate.getTime() - today.getTime()) / 86_400_000)
        newPills.push({ slug: c.slug, abbr: c.abbr, daysRemaining })
      }
      setPills(newPills)
    } catch {
      // localStorage unavailable
    }
  }, [courses, refreshKey])

  function handleSave() {
    if (!formCourse || !formDate) return
    try {
      const stored = localStorage.getItem('examDates')
      const examDates: Record<string, string> = stored ? JSON.parse(stored) : {}
      examDates[formCourse] = formDate
      localStorage.setItem('examDates', JSON.stringify(examDates))
      setRefreshKey((k) => k + 1)
      setShowForm(false)
      setFormDate('')
    } catch {
      // localStorage unavailable
    }
  }

  function pillClasses(days: number): string {
    if (days > 14) {
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
    }
    if (days >= 7) {
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
    }
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
  }

  function pillLabel(pill: ExamPill): string {
    if (pill.daysRemaining <= 0) return `${pill.abbr} — Today!`
    if (pill.daysRemaining === 1) return `${pill.abbr} — 1 day`
    return `${pill.abbr} — ${pill.daysRemaining}d`
  }

  if (pills.length === 0 && !showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
      >
        + Add exam date
      </button>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {pills.map((pill) => (
          <span
            key={pill.slug}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${pillClasses(pill.daysRemaining)}`}
          >
            {pillLabel(pill)}
          </span>
        ))}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
          >
            + Add exam date
          </button>
        )}
      </div>

      {showForm && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <select
            value={formCourse}
            onChange={(e) => setFormCourse(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.abbr}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setShowForm(false)
              setFormDate('')
            }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
