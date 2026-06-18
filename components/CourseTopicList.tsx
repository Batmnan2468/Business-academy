'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getMastery, getMasteryPct, isDueToday } from '@/lib/mastery'
import type { TopicMastery } from '@/lib/mastery'
import { getTopicState, getUnitTestState } from '@/lib/topicState'
import type { TopicState, UnitTestState } from '@/lib/topicState'
import { getLearnState } from '@/lib/learnState'
import type { LearnState } from '@/lib/learnState'
import { getSavedCountForCourse } from '@/lib/savedQuestions'

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
  courseTitle?: string
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

function loadLearnStateMap(
  courseSlug: string,
  units: UnitItem[] | undefined,
  topics: TopicItem[] | undefined,
): Map<string, LearnState> {
  const allSlugs = [
    ...(units?.flatMap((u) => u.topics.map((t) => t.slug)) ?? []),
    ...(topics?.map((t) => t.slug) ?? []),
  ]
  const map = new Map<string, LearnState>()
  for (const slug of allSlugs) {
    map.set(slug, getLearnState(courseSlug, slug))
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

// ── Guided-flow next-step logic ───────────────────────────────────────────────

type NextStep =
  | { type: 'learn'; topicSlug: string; topicTitle: string }
  | { type: 'practice'; topicSlug: string; topicTitle: string }
  | { type: 'unit-test'; unitId: string; unitNum: number }
  | { type: 'done' }

function computeNextStep(
  units: UnitItem[],
  topicStateMap: Map<string, TopicState>,
  learnStateMap: Map<string, LearnState>,
  unitTestStateMap: Map<string, UnitTestState>,
  hasLearnContent: boolean,
): NextStep {
  for (let ui = 0; ui < units.length; ui++) {
    const unit = units[ui]
    let unitFullyPracticed = true

    for (const topic of unit.topics) {
      const ts = topicStateMap.get(topic.slug) ?? 'untouched'
      if (ts !== 'practiced' && ts !== 'mastered') {
        unitFullyPracticed = false
        const ls = learnStateMap.get(topic.slug) ?? 'unread'
        if (hasLearnContent && ls !== 'completed') {
          return { type: 'learn', topicSlug: topic.slug, topicTitle: topic.title }
        }
        return { type: 'practice', topicSlug: topic.slug, topicTitle: topic.title }
      }
    }

    if (unitFullyPracticed) {
      const utState = unitTestStateMap.get(unit.id) ?? 'notStarted'
      if (utState === 'notStarted') {
        return { type: 'unit-test', unitId: unit.id, unitNum: ui + 1 }
      }
    }
  }

  return { type: 'done' }
}

// ── State circle icon (used in flat-topics fallback) ─────────────────────────

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
  return (
    <span
      className="w-4 h-4 rounded-full shrink-0 block border-2"
      style={{ borderColor: '#d1d5db' }}
      title="Not started"
    />
  )
}

// ── Topic square (unit grid) ──────────────────────────────────────────────────

function TopicSquare({
  topic,
  num,
  courseSlug,
  state,
}: {
  topic: TopicItem
  num: number
  courseSlug: string
  state: TopicState
}) {
  let bgBorder: string
  if (state === 'mastered') {
    bgBorder = 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
  } else if (state === 'practiced') {
    bgBorder = 'bg-yellow-50 dark:bg-amber-950 border-yellow-200 dark:border-yellow-800'
  } else if (state === 'inProgress') {
    bgBorder = 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
  } else {
    bgBorder = 'border-gray-300 dark:border-gray-600'
  }

  const dotColor =
    state === 'mastered'
      ? 'bg-green-500'
      : state === 'practiced'
        ? 'bg-yellow-400'
        : state === 'inProgress'
          ? 'bg-red-500'
          : null

  return (
    <Link
      href={`/courses/${courseSlug}/practice/${topic.slug}`}
      title={topic.title}
      className={`relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors ${bgBorder}`}
    >
      {num}
      {dotColor !== null && (
        <span className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full ${dotColor}`} />
      )}
    </Link>
  )
}

// ── Unit test square (unit grid) ──────────────────────────────────────────────

function UnitTestSquare({
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
  return (
    <Link
      href={`/courses/${courseSlug}/unit-test/${unitId}`}
      title={`Module ${moduleNum} Unit Test`}
      className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors text-base"
    >
      📋
      {state !== 'notStarted' && (
        <span
          className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold ${
            state === 'passed'
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
          }`}
        >
          {state === 'passed' ? '✓' : '~'}
        </span>
      )}
    </Link>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CourseTopicList({
  courseSlug,
  courseTitle,
  units,
  topics,
  totalTopics,
  hasLearnContent = false,
}: Props) {
  const [masteryMap, setMasteryMap] = useState<Map<string, TopicMastery>>(new Map())
  const [topicStateMap, setTopicStateMap] = useState<Map<string, TopicState>>(new Map())
  const [learnStateMap, setLearnStateMap] = useState<Map<string, LearnState>>(new Map())
  const [unitTestStateMap, setUnitTestStateMap] = useState<Map<string, UnitTestState>>(new Map())
  const [dueCount, setDueCount] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const [nextStep, setNextStep] = useState<NextStep | null>(null)

  function refresh() {
    const { map, dueCount: due, masteredCount: mc } = loadMasteryMap(courseSlug, units, topics)
    setMasteryMap(map)
    setDueCount(due)
    setMasteredCount(mc)
    const topicMap = loadTopicStateMap(courseSlug, units, topics)
    setTopicStateMap(topicMap)
    const learnMap = loadLearnStateMap(courseSlug, units, topics)
    setLearnStateMap(learnMap)
    const utMap = loadUnitTestStateMap(courseSlug, units)
    setUnitTestStateMap(utMap)
    setSavedCount(getSavedCountForCourse(courseSlug))
    if (units) {
      setNextStep(computeNextStep(units, topicMap, learnMap, utMap, hasLearnContent))
    }
  }

  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('savedQuestionsChanged', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('savedQuestionsChanged', refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug])

  const practicedCount = [...topicStateMap.values()].filter(
    (s) => s === 'practiced' || s === 'mastered',
  ).length
  const pct = totalTopics > 0 ? Math.round((practicedCount / totalTopics) * 100) : 0

  const anyTouched = useMemo(() => {
    for (const s of topicStateMap.values()) if (s !== 'untouched') return true
    for (const s of learnStateMap.values()) if (s !== 'unread') return true
    return false
  }, [topicStateMap, learnStateMap])

  const nextStepLabel = useMemo(() => {
    if (!nextStep) return ''
    if (nextStep.type === 'done') return "You're done! Review any topic above ✓"
    if (nextStep.type === 'unit-test') return `Unit Test: Unit ${nextStep.unitNum}`
    const title =
      nextStep.topicTitle.length > 35
        ? nextStep.topicTitle.slice(0, 35) + '…'
        : nextStep.topicTitle
    if (!anyTouched) return `Start: ${title}`
    if (nextStep.type === 'learn') return `Learn: ${title}`
    return `Practice: ${title}`
  }, [nextStep, anyTouched])

  const nextStepHref = useMemo((): string | null => {
    if (!nextStep || nextStep.type === 'done') return null
    if (nextStep.type === 'unit-test')
      return `/courses/${courseSlug}/unit-test/${nextStep.unitId}`
    if (nextStep.type === 'learn')
      return `/courses/${courseSlug}/learn/${nextStep.topicSlug}`
    return `/courses/${courseSlug}/practice/${nextStep.topicSlug}`
  }, [nextStep, courseSlug])

  // Flat-topics fallback: full-width topic row (original design)
  function topicRow(topic: TopicItem, num: number) {
    const state = topicStateMap.get(topic.slug) ?? 'untouched'
    const mastery = masteryMap.get(topic.slug)
    const masteryPct = mastery ? getMasteryPct(mastery) : null
    const isPerm = mastery?.permanentlyMastered ?? false
    const isDecayed = mastery !== undefined && !isPerm && masteryPct === 0

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

    let borderClass = 'border-gray-200 dark:border-gray-700'
    if (state === 'mastered') borderClass = 'border-green-200 dark:border-green-800'
    else if (state === 'practiced') borderClass = 'border-yellow-200 dark:border-yellow-800'
    else if (state === 'inProgress') borderClass = 'border-red-100 dark:border-red-900'

    return (
      <li key={topic.id}>
        <Link
          href={`/courses/${courseSlug}/${topic.slug}`}
          className={`flex items-center gap-4 px-5 py-4 min-h-[48px] rounded-xl border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group ${borderClass}`}
        >
          <div className="flex items-center gap-2 shrink-0">
            <TopicCircle state={state} />
            <span className="text-xs text-gray-400 tabular-nums w-5">{num}</span>
          </div>
          <span
            className={`flex-1 min-w-0 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 ${
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

      {/* Completion badge */}
      {practicedCount === totalTopics && totalTopics > 0 && (
        <div className="mb-6 rounded-2xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 px-5 py-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 rounded-2xl border-2 border-green-300 dark:border-green-700 animate-pulse pointer-events-none" />
          <div className="text-3xl mb-2">🏆</div>
          <p className="font-bold text-green-800 dark:text-green-300 text-sm">
            {courseTitle ? `${courseTitle} Complete!` : 'Course Complete!'}
          </p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
            All {totalTopics} topics practiced
          </p>
        </div>
      )}

      {/* Learn / Practice mode selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
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

      {/* Continue studying button (unit-based courses only) */}
      {units && nextStep !== null && (
        <div className="mb-4">
          {nextStep.type === 'done' ? (
            <div className="w-full py-3 px-5 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-medium text-sm text-center">
              {nextStepLabel}
            </div>
          ) : (
            <Link
              href={nextStepHref!}
              className="block w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm text-center transition-colors"
            >
              {nextStepLabel}
            </Link>
          )}
        </div>
      )}

      {/* Saved questions link */}
      {savedCount > 0 && (
        <div className="mb-4">
          <Link
            href="/saved-questions"
            className="text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            🚩 {savedCount} {savedCount === 1 ? 'question' : 'questions'} saved in this course →
          </Link>
        </div>
      )}

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

      {/* Unit grid (unit-based courses) or flat topic list (fallback) */}
      {units ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {units.map((unit, unitIdx) => {
            const moduleNum = unitIdx + 1
            const unitPracticedCount = unit.topics.filter((t) => {
              const s = topicStateMap.get(t.slug) ?? 'untouched'
              return s === 'practiced' || s === 'mastered'
            }).length
            const utState = unitTestStateMap.get(unit.id) ?? 'notStarted'

            return (
              <div
                key={unit.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 leading-tight">
                    {unit.title}
                  </h2>
                  <span className="text-xs text-gray-400 tabular-nums shrink-0">
                    {unitPracticedCount}/{unit.topics.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {unit.topics.map((topic, i) => {
                    const globalNum = getGlobalNum(units, unit.id, i)
                    const state = topicStateMap.get(topic.slug) ?? 'untouched'
                    return (
                      <TopicSquare
                        key={topic.id}
                        topic={topic}
                        num={globalNum}
                        courseSlug={courseSlug}
                        state={state}
                      />
                    )
                  })}
                  <UnitTestSquare
                    courseSlug={courseSlug}
                    unitId={unit.id}
                    moduleNum={moduleNum}
                    state={utState}
                  />
                </div>
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
