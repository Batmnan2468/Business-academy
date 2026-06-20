'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import type { Course } from '@/types'
import { buildCourseCardsForUnit } from '@/lib/courseFlashcards'
import type { TermCard, ConceptCard } from '@/lib/courseFlashcards'
import {
  getCustomCards,
  getDeckCounter,
  getDueCards,
  getFlashcardMastery,
} from '@/lib/flashcards'
import FlashcardSession from './FlashcardSession'
import CreateCardModal from './CreateCardModal'
import type { SessionStats, AnyCard } from './FlashcardSession'

interface Props {
  course: Course
  courseSlug: string
  termCards: TermCard[]
  conceptCards: ConceptCard[]
}

interface ActiveSession {
  cards: AnyCard[]
  deckId: string
}

export default function CourseFlashcardHub({ course, courseSlug, termCards, conceptCards }: Props) {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [customCount, setCustomCount] = useState(0)
  const [dueCount, setDueCount] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)
  const [unitMastered, setUnitMastered] = useState<Record<string, number>>({})
  const [lastStats, setLastStats] = useState<SessionStats | null>(null)

  const allCourseCards = useMemo(() => [...conceptCards, ...termCards], [conceptCards, termCards])

  function refresh() {
    const customCards = getCustomCards()
    setCustomCount(customCards.length)

    const deckId = courseSlug
    const counter = getDeckCounter(deckId)
    const allIds = allCourseCards.map((c) => c.id)
    setDueCount(getDueCards(deckId, allIds, counter).length)

    const mastery = getFlashcardMastery(deckId)
    setMasteredCount(mastery.masteredCardIds.length)

    // Per-unit mastered counts
    if (course.units) {
      const perUnit: Record<string, number> = {}
      for (const unit of course.units) {
        const unitCards = buildCourseCardsForUnit(course, unit.id)
        const unitIds = new Set(unitCards.map((c) => c.id))
        perUnit[unit.id] = mastery.masteredCardIds.filter((id) => unitIds.has(id)).length
      }
      setUnitMastered(perUnit)
    }
  }

  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, allCourseCards])

  function openSession(cards: AnyCard[], deckId: string) {
    setLastStats(null)
    setActiveSession({ cards, deckId })
  }

  function handleComplete(stats: SessionStats) {
    setLastStats(stats)
    setActiveSession(null)
    refresh()
  }

  if (activeSession) {
    return (
      <FlashcardSession
        cards={activeSession.cards}
        deckId={activeSession.deckId}
        onComplete={handleComplete}
        onExit={() => { setActiveSession(null); refresh() }}
      />
    )
  }

  const totalCards = allCourseCards.length
  const hasCards = totalCards > 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-blue-500 hover:underline mb-6 inline-block"
      >
        ← {course.title}
      </Link>

      <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
        {course.title}
      </h1>
      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Flashcards</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
        {termCards.length} term card{termCards.length !== 1 ? 's' : ''} · {conceptCards.length} concept card{conceptCards.length !== 1 ? 's' : ''}
      </p>

      {/* Stats strip */}
      {hasCards && (
        <div className="flex gap-4 mb-6 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900">
          <Stat label="total" value={totalCards} />
          <div className="w-px bg-purple-200 dark:bg-purple-800" />
          <Stat label="due" value={dueCount} />
          <div className="w-px bg-purple-200 dark:bg-purple-800" />
          <Stat label="mastered ⭐" value={masteredCount} color="green" />
        </div>
      )}

      {/* Session complete banner */}
      {lastStats && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-sm">
          <p className="font-medium text-green-800 dark:text-green-300">
            Session done! ⭐ {lastStats.mastered} mastered · +{lastStats.xpEarned} XP
          </p>
        </div>
      )}

      {hasCards ? (
        <>
          {/* Study all button */}
          <button
            onClick={() => openSession(allCourseCards, courseSlug)}
            className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm mb-6 transition-colors"
          >
            Study all {totalCards} cards
          </button>

          {/* Unit breakdown */}
          {course.units && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                By Unit
              </h2>
              <div className="space-y-3">
                {course.units.map((unit) => {
                  const unitCards: AnyCard[] = buildCourseCardsForUnit(course, unit.id)
                  if (unitCards.length === 0) return null
                  const mc = unitMastered[unit.id] ?? 0
                  const pct = Math.round((mc / unitCards.length) * 100)

                  return (
                    <div
                      key={unit.id}
                      className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                          {unit.title}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {unitCards.length} cards
                        </span>
                      </div>

                      {/* Mastery bar */}
                      <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full bg-green-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {mc}/{unitCards.length} mastered
                        </span>
                        <button
                          onClick={() => openSession(unitCards, courseSlug)}
                          className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Study unit →
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mb-6 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          No flashcards yet — this course doesn't have learn content.
          <br />
          You can still create custom cards below.
        </div>
      )}

      {/* Custom cards section */}
      <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            My Custom Cards
          </h2>
          <span className="text-xs text-gray-400">{customCount} card{customCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {customCount > 0 && (
            <button
              onClick={() => {
                const cc = getCustomCards()
                openSession(cc, 'custom')
              }}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors"
            >
              Study custom cards
            </button>
          )}
          <button
            onClick={() => setCreateOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            + Create card
          </button>
        </div>
      </div>

      <CreateCardModal isOpen={createOpen} onClose={() => { setCreateOpen(false); refresh() }} />
    </main>
  )
}

function Stat({
  label,
  value,
  color = 'purple',
}: {
  label: string
  value: number
  color?: 'purple' | 'green'
}) {
  const textColor =
    color === 'green'
      ? 'text-green-600 dark:text-green-400'
      : 'text-purple-700 dark:text-purple-300'
  return (
    <div className="flex flex-col items-center gap-0.5 flex-1">
      <span className={`text-xl font-bold ${textColor}`}>{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  )
}
