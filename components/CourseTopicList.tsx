'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMastery, getMasteryPct, isDueToday } from '@/lib/mastery'
import type { TopicMastery } from '@/lib/mastery'
import { getTopicState, getUnitTestState } from '@/lib/topicState'
import type { TopicState, UnitTestState } from '@/lib/topicState'

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
  hasLearnContent?: boolean
}

// ── localStorage loaders ──────────────────────────────────────────────────────

function loadMasteryMap(
  courseSlug: string,
  units: UnitItem[] | undefined,
  topics: TopicItem[] | undefined,
): { map: Map<string, TopicMastery>; dueCount: number; masteredCount: number } {
  const allSlugs = [
    ...(units?.flatMap((u) => u.topics.map((t) => t.slug)) ?? []),
    ...(topics?.map((t) => t.slug) ?? []),
  ]
  const map = new Map<string, TopicMastery>()
  let dueCount = 0
  let masteredCount = 0
  for (const slug of allSlugs) {
    const m = getMastery(courseSlug, slug)
    if (m) {
      map.set(slug, m)
      if (isDueToday(m)) dueCount++
      if (m.masteryLevel >= 1) masteredCount++
    }
  }
  return { map, dueCount, masteredCount }
}

function loadTopicStateMap(
  courseSlug: string,
  units: UnitItem[] | undefined,
  topics: TopicItem[] | undefined,
): Map<string, TopicState> {
  const allSlugs = [
    ...(units?.flatMap((u) => u.topics.map((t) => t.slug)) ?? []),
    ...(topics?.map((t) => t.slug) ?? []),
  ]
  const map = new Map<string, TopicState>()
  for (const slug of allSlugs) {
    map.set(slug, getTopicState(courseSlug, slug))
  }
  return map
}

function loadUnitTestStateMap(
  courseSlug: string,
  units: UnitItem[] | undefined,
): Map<string, UnitTestState> {
  const map = new Map<string, UnitTestState>()
  for (const unit of units ?? []) {
    map.set(unit.id, getUnitTestState(courseSlug, unit.id))
  }
  return map
}

// ── State circle icon ────────────────────────────────────────────────────────

function TopicCircle({ state }: { state: TopicState }) {
  if (state === 'mastered') {
    return (
      <span
        className="w-4 h-4 rounded-full shrink-0 block"
        style={{ backgroundColor: '#22c55e' }}
        title="Mastered"
      />
    )
  }
  if (state === 'practiced') {
    return (
      <span
        className="w-4 h-4 rounded-full shrink-0 block"
        style={{ backgroundColor: '#eab308' }}
        title="Practiced"
      />
    )
  }
  if (state === 'inProgress') {
    return (
      <span
        className="w-4 h-4 rounded-full shrink-0 block"
        style={{ backgroundColor: '#ef4444' }}
        title="In Progress"
      />
    )
  }
  // untouched
  return (
    <span
      className="w-4 h-4 rounded-full shrink-0 block border-2"
      style={{ borderColor: '#d1d5db' }}
      title="Not started"
    />
  )
}

// ── Unit test row ────────────────────────────────────────────────────────────

function UnitTestRow({
  courseSlug,
  unitId,
  moduleNum,
  state,
}: {
  courseSlug: string
  unitId: string
  moduleNum: number
  state: UnitTestState
}) {
  const badgeClass =
    state === 'passed'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : state === 'inProgress'
        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'

  const badgeLabel =
    state === 'passed' ? '✓ Passed' : state === 'inProgress' ? 'In Progress' : 'Not Started'

  return (
    <li>
      <Link
        href={`/courses/${courseSlug}/unit-test/${unitId}`}
        className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group"
      >
        <span className="text-base shrink-0">📋</span>
        <span className="flex-1 font-semibold text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
          Module {moduleNum} Unit Test
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeClass}`}>
          {badgeLabel}
        </span>
        <span className="text-gray-400 group-hover:text-blue-400 text-sm ml-1">→</span>
      </Link>
    </li>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CourseTopicList({ courseSlug, units, topics, totalTopics, hasLearnContent = false }: Props) {
  const [masteryMap, setMasteryMap] = useState<Map<string, TopicMastery>>(new Map())
  const [topicStateMap, setTopicStateMap] = useState<Map<string, TopicState>>(new Map())
  const [unitTestStateMap, setUnitTestStateMap] = useState<Map<string, UnitTestState>>(new Map())
  const [dueCount, setDueCount] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)

  function refresh() {
    const { map, dueCount: due, masteredCount: mc } = loadMasteryMap(courseSlug, units, topics)
    setMasteryMap(map)
    setDueCount(due)
    setMasteredCount(mc)
    setTopicStateMap(loadTopicStateMap(courseSlug, units, topics))
    setUnitTestStateMap(loadUnitTestStateMap(courseSlug, units))
  }

  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug])

  // Count topics at practiced or mastered for the top progress bar
  const practicedCount = [...topicStateMap.values()].filter(
    (s) => s === 'practiced' || s === 'mastered',
  ).length
  const pct = totalTopics > 0 ? Math.round((practicedCount / totalTopics) * 100) : 0

  function topicRow(topic: TopicItem, num: number) {
    const state = topicStateMap.get(topic.slug) ?? 'untouched'
    const mastery = masteryMap.get(topic.slug)
    const masteryPct = mastery ? getMasteryPct(mastery) : null
    const isPerm = mastery?.permanentlyMastered ?? false
    const isDecayed = mastery !== undefined && !isPerm && masteryPct === 0

    // Right badge: spaced-repetition mastery level (unchanged)
    let rightBadge: React.ReactNode = null
    if (isPerm) {
      rightBadge = (
        <span className="text-xs text-yellow-500 font-medium shrink-0">Mastered ★</span>
      )
    } else if (mastery) {
      const level = mastery.masteryLevel
      rightBadge = (
        <div className="flex items-center gap-1.5 shrink-0">
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

    // Row border color based on topic state
    let borderClass = 'border-gray-200 dark:border-gray-700'
    if (state === 'mastered') borderClass = 'border-green-200 dark:border-green-800'
    else if (state === 'practiced') borderClass = 'border-yellow-200 dark:border-yellow-800'
    else if (state === 'inProgress') borderClass = 'border-red-100 dark:border-red-900'

    return (
      <li key={topic.id}>
        <Link
          href={`/courses/${courseSlug}/${topic.slug}`}
          className={`flex items-center gap-4 px-5 py-4 rounded-xl border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group ${borderClass}`}
        >
          {/* Left: state circle + topic number */}
          <div className="flex items-center gap-2 shrink-0">
            <TopicCircle state={state} />
            <span className="text-xs text-gray-400 tabular-nums w-5">{num}</span>
          </div>

          <span
            className={`flex-1 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 ${
              state !== 'untouched'
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
      {/* Top progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{practicedCount}</span>
            /{totalTopics} topics practiced
            {practicedCount > 0 && (
              <span className="ml-2 text-xs text-gray-400">{pct}%</span>
            )}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: '#eab308' }}
          />
        </div>
      </div>

      {/* Learn / Practice mode selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {hasLearnContent ? (
          <Link
            href={`/courses/${courseSlug}/learn`}
            className="flex flex-col items-center gap-1.5 px-4 py-5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950 hover:border-blue-400 transition-colors group"
          >
            <span className="text-2xl">📖</span>
            <span className="font-semibold text-sm text-blue-700 dark:text-blue-300 group-hover:text-blue-800">
              Learn Mode
            </span>
          </Link>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-4 py-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 opacity-50 cursor-not-allowed">
            <span className="text-2xl grayscale">📖</span>
            <span className="font-semibold text-sm text-gray-400 dark:text-gray-500">
              Learn Mode
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-600">Coming soon</span>
          </div>
        )}
        <Link
          href={`/courses/${courseSlug}/practice`}
          className="flex flex-col items-center gap-1.5 px-4 py-5 rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950 hover:border-amber-400 transition-colors group"
        >
          <span className="text-2xl">✏️</span>
          <span className="font-semibold text-sm text-amber-700 dark:text-amber-300 group-hover:text-amber-800">
            Practice Mode
          </span>
        </Link>
      </div>

      {/* Practice mode buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/courses/${courseSlug}/test`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          📝 Course Test
        </Link>

        {masteredCount >= 5 && (
          <Link
            href={`/courses/${courseSlug}/mastered-review`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors text-xs font-medium text-amber-700 dark:text-amber-300"
          >
            ⭐ Mastered Review
            <span className="text-amber-500 dark:text-amber-400 font-bold">{masteredCount}</span>
          </Link>
        )}

        {dueCount > 0 && (
          <Link
            href={`/courses/${courseSlug}/review`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-xs font-medium text-blue-700 dark:text-blue-300"
          >
            🔁 Daily Review
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold leading-none">
              {dueCount}
            </span>
          </Link>
        )}
      </div>

      {units ? (
        <div className="space-y-8">
          {units.map((unit, unitIdx) => {
            const moduleNum = unitIdx + 1
            const unitPracticedCount = unit.topics.filter((t) => {
              const s = topicStateMap.get(t.slug) ?? 'untouched'
              return s === 'practiced' || s === 'mastered'
            }).length
            const unitPct =
              unit.topics.length > 0
                ? Math.round((unitPracticedCount / unit.topics.length) * 100)
                : 0
            const utState = unitTestStateMap.get(unit.id) ?? 'notStarted'

            return (
              <div key={unit.id}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  {unit.title}
                </h2>

                {/* Module progress bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${unitPct}%`, backgroundColor: '#eab308' }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 tabular-nums">
                    {unitPracticedCount}/{unit.topics.length}
                  </span>
                </div>

                <ul className="list-none space-y-2 m-0 p-0">
                  {unit.topics.map((topic, i) => {
                    const globalNum = getGlobalNum(units, unit.id, i)
                    return topicRow(topic, globalNum)
                  })}

                  {/* Unit test row */}
                  <UnitTestRow
                    courseSlug={courseSlug}
                    unitId={unit.id}
                    moduleNum={moduleNum}
                    state={utState}
                  />
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
    if (unit.id === unitId) return count + topicIndex + 1
    count += unit.topics.length
  }
  return count + topicIndex + 1
}
