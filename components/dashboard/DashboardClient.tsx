'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMastery, isDueToday, todayStr } from '@/lib/mastery'
import { getTopicState } from '@/lib/topicState'
import { getLearnState } from '@/lib/learnState'
import { getTotalSavedCount } from '@/lib/savedQuestions'
import { getAggregatedMistakeStats } from '@/lib/mistakeTracker'
import ProgressBar from '@/components/ui/ProgressBar'
import ProgressBackupWidget from '@/components/ProgressBackupWidget'

export interface CourseData {
  slug: string
  title: string
  subject: string
  level: string
  topics: Array<{
    slug: string
    title: string
    hasLearnContent: boolean
  }>
}

interface DueTopic {
  courseSlug: string
  courseTitle: string
  topicSlug: string
  topicTitle: string
  nextReviewDate: string
  masteryLevel: number
  lastReviewedDate: string
}

interface CourseStat {
  slug: string
  title: string
  subject: string
  total: number
  practiced: number
  mastered: number
  learnTotal: number
  learnRead: number
}

interface WeakTopic {
  courseSlug: string
  courseTitle: string
  topicSlug: string
  topicTitle: string
}

interface WeakTypeEntry {
  type: string
  accuracy: number
  count: number
}

const subjectBorderColors: Record<string, string> = {
  Accounting: '#3b82f6',
  'Information Systems': '#8b5cf6',
  'Business Statistics': '#22c55e',
  'Business Analytics': '#f97316',
  'Operations Management': '#ef4444',
  Statistics: '#eab308',
}

function daysSince(dateStr: string): number {
  const a = new Date(dateStr).getTime()
  const b = new Date(todayStr()).getTime()
  return Math.max(0, Math.floor((b - a) / 86_400_000))
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {}
  for (const item of arr) {
    const k = key(item)
    ;(out[k] ??= []).push(item)
  }
  return out
}

export default function DashboardClient({ courses }: { courses: CourseData[] }) {
  const [loaded, setLoaded] = useState(false)
  const [dueTopics, setDueTopics] = useState<DueTopic[]>([])
  const [courseStats, setCourseStats] = useState<CourseStat[]>([])
  const [weakAreas, setWeakAreas] = useState<WeakTopic[]>([])
  const [weakTypes, setWeakTypes] = useState<WeakTypeEntry[]>([])
  const [lastLearnVisit, setLastLearnVisit] = useState<{ courseSlug: string; topicSlug: string } | null>(null)
  const [lastPracticeVisit, setLastPracticeVisit] = useState<{ courseSlug: string; topicSlug: string } | null>(null)
  const [savedCount, setSavedCount] = useState(0)
  const [totalMastered, setTotalMastered] = useState(0)

  useEffect(() => {
    const dueList: DueTopic[] = []
    const stats: CourseStat[] = []
    const weak: WeakTopic[] = []
    let mastered = 0

    for (const course of courses) {
      let practiced = 0
      let masteredCount = 0
      let learnRead = 0
      const learnTopics = course.topics.filter((t) => t.hasLearnContent)

      for (const topic of course.topics) {
        const state = getTopicState(course.slug, topic.slug)
        if (state === 'practiced') practiced++
        if (state === 'mastered') {
          masteredCount++
          mastered++
        }
        if (state === 'inProgress') {
          weak.push({
            courseSlug: course.slug,
            courseTitle: course.title,
            topicSlug: topic.slug,
            topicTitle: topic.title,
          })
        }

        if (topic.hasLearnContent) {
          const ls = getLearnState(course.slug, topic.slug)
          if (ls === 'completed') learnRead++
        }

        const m = getMastery(course.slug, topic.slug)
        if (m && isDueToday(m)) {
          dueList.push({
            courseSlug: course.slug,
            courseTitle: course.title,
            topicSlug: topic.slug,
            topicTitle: topic.title,
            nextReviewDate: m.nextReviewDate,
            masteryLevel: m.masteryLevel,
            lastReviewedDate: m.lastReviewedDate,
          })
        }
      }

      stats.push({
        slug: course.slug,
        title: course.title,
        subject: course.subject,
        total: course.topics.length,
        practiced,
        mastered: masteredCount,
        learnTotal: learnTopics.length,
        learnRead,
      })
    }

    dueList.sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))

    setDueTopics(dueList)
    setCourseStats(stats)
    setWeakAreas(weak.slice(0, 8))
    setTotalMastered(mastered)

    const { weakestTypes } = getAggregatedMistakeStats(courses.map((c) => c.slug))
    setWeakTypes(weakestTypes)

    try {
      const llv = localStorage.getItem('lastLearnVisit')
      if (llv) setLastLearnVisit(JSON.parse(llv))
      const lpv = localStorage.getItem('lastPracticeVisit')
      if (lpv) setLastPracticeVisit(JSON.parse(lpv))
    } catch {
      // Safari private browsing
    }

    setSavedCount(getTotalSavedCount())
    setLoaded(true)
  }, [courses])

  if (!loaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400 text-sm">
        Loading dashboard...
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const dueGroups = groupBy(dueTopics, (t) => t.courseSlug)

  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 sm:pb-12">
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-1">Study Dashboard</h1>
        <p className="text-gray-400 text-sm">{today}</p>
        {totalMastered > 0 && (
          <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
            {totalMastered} topic{totalMastered !== 1 ? 's' : ''} mastered across all courses
          </p>
        )}
      </div>

      {/* ── Due for Review ── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Due for Review Today</h2>
        {dueTopics.length === 0 ? (
          <p className="text-sm text-gray-400">You&apos;re all caught up! No reviews due today.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(dueGroups).map(([courseSlug, topics]) => (
              <div key={courseSlug}>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  {topics[0].courseTitle}
                </p>
                <div className="space-y-2">
                  {topics.map((t) => {
                    const overdueDays = daysSince(t.nextReviewDate)
                    return (
                      <Link
                        key={t.topicSlug}
                        href={`/courses/${courseSlug}/practice/${t.topicSlug}`}
                        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                          {t.topicTitle}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <MasteryBadge level={t.masteryLevel} />
                          <span className="text-xs text-gray-400">
                            {overdueDays === 0
                              ? 'due today'
                              : overdueDays === 1
                              ? '1 day overdue'
                              : `${overdueDays} days overdue`}
                          </span>
                          <span className="text-xs text-blue-500">Practice →</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Course Progress ── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
        <div className="space-y-4">
          {courseStats.map((c) => {
            const done = c.practiced + c.mastered
            const pct = c.total > 0 ? Math.round((done / c.total) * 100) : 0
            const remaining = c.total - done
            const borderColor = subjectBorderColors[c.subject] ?? '#6b7280'

            return (
              <div
                key={c.slug}
                className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
                style={{ borderLeftColor: borderColor, borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.subject}</p>
                  </div>
                  <Link
                    href={`/courses/${c.slug}`}
                    className="text-xs text-blue-500 hover:underline shrink-0"
                  >
                    Continue →
                  </Link>
                </div>

                <ProgressBar percent={pct} />

                <div className="flex items-center gap-4 mt-3">
                  {c.practiced > 0 && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      {c.practiced} practiced
                    </span>
                  )}
                  {c.mastered > 0 && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {c.mastered} mastered
                    </span>
                  )}
                  {remaining > 0 && (
                    <span className="text-xs text-gray-400">{remaining} remaining</span>
                  )}
                  {c.learnTotal > 0 && (
                    <span className="text-xs text-blue-500 ml-auto">
                      {c.learnRead}/{c.learnTotal} topics read
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Weak Areas ── */}
      {weakAreas.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Topics Needing Attention</h2>
          <div className="space-y-2">
            {weakAreas.map((t) => (
              <Link
                key={`${t.courseSlug}__${t.topicSlug}`}
                href={`/courses/${t.courseSlug}/practice/${t.topicSlug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {t.topicTitle}
                  </p>
                  <p className="text-xs text-gray-400">{t.courseTitle}</p>
                </div>
                <span className="text-xs text-blue-500 shrink-0">Practice →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Weak Spots (question type analysis) ── */}
      {weakTypes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Weak Spots</h2>
          <div className="flex flex-wrap gap-3">
            {weakTypes.map((t) => (
              <div
                key={t.type}
                className="px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 min-w-[140px]"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.type}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t.accuracy}% accuracy · {t.count} attempts
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Quick Actions ── */}
      <section className="mb-0">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {lastLearnVisit ? (
            <Link
              href={`/courses/${lastLearnVisit.courseSlug}/learn/${lastLearnVisit.topicSlug}`}
              className="flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <span className="text-xl">📖</span>
              <div className="min-w-0">
                <p className="text-sm font-medium">Continue Learning</p>
                <p className="text-xs text-gray-400 truncate">
                  {courses.find((c) => c.slug === lastLearnVisit.courseSlug)?.topics.find(
                    (t) => t.slug === lastLearnVisit.topicSlug
                  )?.title ?? lastLearnVisit.topicSlug}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/courses/bus-370/learn"
              className="flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <span className="text-xl">📖</span>
              <div>
                <p className="text-sm font-medium">Start Learning</p>
                <p className="text-xs text-gray-400">BUS 370 Learn Mode</p>
              </div>
            </Link>
          )}

          {lastPracticeVisit ? (
            <Link
              href={`/courses/${lastPracticeVisit.courseSlug}/practice/${lastPracticeVisit.topicSlug}`}
              className="flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <span className="text-xl">✏️</span>
              <div className="min-w-0">
                <p className="text-sm font-medium">Quick Practice</p>
                <p className="text-xs text-gray-400 truncate">
                  {courses.find((c) => c.slug === lastPracticeVisit.courseSlug)?.topics.find(
                    (t) => t.slug === lastPracticeVisit.topicSlug
                  )?.title ?? lastPracticeVisit.topicSlug}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/courses"
              className="flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <span className="text-xl">✏️</span>
              <div>
                <p className="text-sm font-medium">Quick Practice</p>
                <p className="text-xs text-gray-400">Pick a topic to practice</p>
              </div>
            </Link>
          )}

          <Link
            href="/saved-questions"
            className="flex items-center gap-3 px-4 py-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
          >
            <span className="text-xl">🚩</span>
            <div>
              <p className="text-sm font-medium">Saved Questions</p>
              <p className="text-xs text-gray-400">
                {savedCount > 0 ? `${savedCount} saved` : 'None saved yet'}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <ProgressBackupWidget />
    </main>
  )
}

function MasteryBadge({ level }: { level: number }) {
  if (level >= 5) {
    return (
      <span className="text-xs font-bold text-green-600 dark:text-green-400">★ Permanent</span>
    )
  }
  if (level >= 3) {
    return (
      <span className="text-xs font-bold text-green-600 dark:text-green-400">×{level} Mastered</span>
    )
  }
  return (
    <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">×{level} Mastered</span>
  )
}
