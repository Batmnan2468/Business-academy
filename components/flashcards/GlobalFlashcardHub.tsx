'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Course } from '@/types'
import { buildCourseCards, buildCourseCardsForUnit } from '@/lib/courseFlashcards'
import type { CourseCard } from '@/lib/courseFlashcards'
import { getCustomCards } from '@/lib/flashcards'
import FlashcardSession from './FlashcardSession'
import CreateCardModal from './CreateCardModal'
import type { SessionStats, AnyCard } from './FlashcardSession'

interface Props {
  courses: Course[]
}

interface ActiveSession {
  cards: AnyCard[]
  deckId: string
}

// Track which courses + units are selected
type CourseSelection = {
  [courseSlug: string]: {
    checked: boolean      // entire course checked
    units: Set<string>    // individual unit IDs checked (for unit-based courses)
  }
}

export default function GlobalFlashcardHub({ courses }: Props) {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [customCount, setCustomCount] = useState(0)
  const [lastStats, setLastStats] = useState<SessionStats | null>(null)
  const [selection, setSelection] = useState<CourseSelection>({})
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCustomCount(getCustomCards().length)
    window.addEventListener('storage', () => setCustomCount(getCustomCards().length))
    return () => window.removeEventListener('storage', () => setCustomCount(getCustomCards().length))
  }, [])

  // Build all course cards once
  const courseCardsMap = useMemo(() => {
    const m = new Map<string, CourseCard[]>()
    for (const course of courses) {
      m.set(course.slug, buildCourseCards(course))
    }
    return m
  }, [courses])

  // Compute selected cards + deckId
  const { selectedCards, selectedDeckId, selectedCount } = useMemo(() => {
    const cards: AnyCard[] = []
    const unitIds: string[] = []

    for (const course of courses) {
      const sel = selection[course.slug]
      if (!sel?.checked) continue

      if (course.units) {
        for (const unit of course.units) {
          if (sel.units.has(unit.id)) {
            const unitCards = buildCourseCardsForUnit(course, unit.id)
            cards.push(...unitCards)
            unitIds.push(unit.id)
          }
        }
      } else {
        // flat-topic course: use courseSlug as the "unit id"
        const cc = courseCardsMap.get(course.slug) ?? []
        cards.push(...cc)
        unitIds.push(course.slug)
      }
    }

    // Deduplicate by id
    const seen = new Set<string>()
    const unique = cards.filter((c) => {
      if (seen.has(c.id)) return false
      seen.add(c.id)
      return true
    })

    const deckId = `global:${[...unitIds].sort().join(',')}`
    return { selectedCards: unique, selectedDeckId: deckId, selectedCount: unique.length }
  }, [selection, courses, courseCardsMap])

  function toggleCourse(courseSlug: string) {
    const course = courses.find((c) => c.slug === courseSlug)
    if (!course) return
    const current = selection[courseSlug]
    const isCourseChecked = current?.checked

    if (isCourseChecked) {
      // Uncheck course
      setSelection((prev) => ({ ...prev, [courseSlug]: { checked: false, units: new Set() } }))
      setExpandedCourses((prev) => { const n = new Set(prev); n.delete(courseSlug); return n })
    } else {
      // Check course and select all units
      const allUnits = new Set(course.units?.map((u) => u.id) ?? [])
      setSelection((prev) => ({ ...prev, [courseSlug]: { checked: true, units: allUnits } }))
      setExpandedCourses((prev) => new Set([...prev, courseSlug]))
    }
  }

  function toggleUnit(courseSlug: string, unitId: string) {
    setSelection((prev) => {
      const current = prev[courseSlug] ?? { checked: false, units: new Set<string>() }
      const newUnits = new Set(current.units)
      if (newUnits.has(unitId)) {
        newUnits.delete(unitId)
      } else {
        newUnits.add(unitId)
      }
      const anyCourseChecked = newUnits.size > 0
      return { ...prev, [courseSlug]: { checked: anyCourseChecked, units: newUnits } }
    })
  }

  function selectAll() {
    const newSel: CourseSelection = {}
    for (const course of courses) {
      newSel[course.slug] = {
        checked: true,
        units: new Set(course.units?.map((u) => u.id) ?? []),
      }
    }
    setSelection(newSel)
    setExpandedCourses(new Set(courses.map((c) => c.slug)))
  }

  function deselectAll() {
    setSelection({})
    setExpandedCourses(new Set())
  }

  function openSession(cards: AnyCard[], deckId: string) {
    setLastStats(null)
    setActiveSession({ cards, deckId })
  }

  function handleComplete(stats: SessionStats) {
    setLastStats(stats)
    setActiveSession(null)
  }

  if (activeSession) {
    return (
      <FlashcardSession
        cards={activeSession.cards}
        deckId={activeSession.deckId}
        onComplete={handleComplete}
        onExit={() => setActiveSession(null)}
      />
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Flashcard Study</h1>

      {/* Session complete banner */}
      {lastStats && (
        <div className="mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-sm">
          <p className="font-medium text-green-800 dark:text-green-300">
            Session done! ⭐ {lastStats.mastered} mastered · +{lastStats.xpEarned} XP
          </p>
        </div>
      )}

      {/* Custom cards */}
      <section className="mb-6 p-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">My Custom Cards</h2>
          <span className="text-xs text-gray-400">{customCount} card{customCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {customCount > 0 && (
            <button
              onClick={() => openSession(getCustomCards(), 'custom')}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors"
            >
              Study custom cards →
            </button>
          )}
          <button
            onClick={() => setCreateOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            + Create card
          </button>
        </div>
      </section>

      {/* Course selection */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Study by Course
          </h2>
          <div className="flex gap-3">
            <button
              onClick={selectAll}
              className="text-xs text-blue-500 hover:underline"
            >
              Select all
            </button>
            <button
              onClick={deselectAll}
              className="text-xs text-gray-400 hover:underline"
            >
              Deselect all
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {courses.map((course) => {
            const sel = selection[course.slug]
            const isCourseChecked = sel?.checked ?? false
            const isExpanded = expandedCourses.has(course.slug)
            const courseCards = courseCardsMap.get(course.slug) ?? []
            if (courseCards.length === 0) return null

            return (
              <div
                key={course.slug}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden"
              >
                {/* Course row */}
                <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={isCourseChecked}
                    onChange={() => toggleCourse(course.slug)}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400">{courseCards.length} cards</p>
                  </div>
                  {course.units && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setExpandedCourses((prev) => {
                          const n = new Set(prev)
                          if (n.has(course.slug)) n.delete(course.slug)
                          else n.add(course.slug)
                          return n
                        })
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  )}
                </label>

                {/* Unit rows (expanded) */}
                {course.units && isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 space-y-1">
                    {course.units.map((unit) => {
                      const unitCards = buildCourseCardsForUnit(course, unit.id)
                      if (unitCards.length === 0) return null
                      const isUnitChecked = sel?.units.has(unit.id) ?? false
                      return (
                        <label
                          key={unit.id}
                          className="flex items-center gap-3 py-1.5 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isUnitChecked}
                            onChange={() => toggleUnit(course.slug, unit.id)}
                            className="w-3.5 h-3.5 rounded accent-purple-600"
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">
                            {unit.title}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {unitCards.length}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Start session CTA */}
      <div className="sticky bottom-4">
        <button
          onClick={() => openSession(selectedCards, selectedDeckId)}
          disabled={selectedCount === 0}
          className="w-full py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg"
        >
          {selectedCount > 0
            ? `Study ${selectedCount} card${selectedCount !== 1 ? 's' : ''}`
            : 'Select courses above to start'}
        </button>
      </div>

      <CreateCardModal isOpen={createOpen} onClose={() => { setCreateOpen(false); setCustomCount(getCustomCards().length) }} />
    </main>
  )
}
