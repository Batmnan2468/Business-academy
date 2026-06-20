'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CourseCard, TermCard, ConceptCard } from '@/lib/courseFlashcards'
import type { CustomCard } from '@/lib/flashcards'
import {
  getSRState,
  saveSRState,
  rateSRCard,
  getDeckCounter,
  saveDeckCounter,
  recordFlashcardSession,
} from '@/lib/flashcards'
import { addXP } from '@/lib/xp'

export type AnyCard = CourseCard | CustomCard | TermCard | ConceptCard

export interface SessionStats {
  total: number
  missed: number
  hard: number
  gotit: number
  mastered: number
  xpEarned: number
  missedCardIds: string[]
}

interface Props {
  cards: AnyCard[]
  deckId: string
  onComplete: (stats: SessionStats) => void
  onExit: () => void
}

type Rating = 'missed' | 'hard' | 'gotit' | 'mastered'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function FlashcardSession({ cards, deckId, onComplete, onExit }: Props) {
  const originalCount = cards.length

  const cardsMap = useMemo(() => {
    const m = new Map<string, AnyCard>()
    for (const c of cards) m.set(c.id, c)
    return m
  }, [cards])

  // queue of card IDs — grows when cards are re-inserted
  const [queue, setQueue] = useState<string[]>(() => shuffle(cards.map((c) => c.id)))
  const [queuePos, setQueuePos] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [phase, setPhase] = useState<'studying' | 'complete'>('studying')

  // persistent card counter, loaded once on mount
  const [cardIndex, setCardIndex] = useState(0)
  const [srStates, setSrStates] = useState<Record<string, import('@/lib/flashcards').SRState>>({})

  // session stats
  const [stats, setStats] = useState<SessionStats>({
    total: 0,
    missed: 0,
    hard: 0,
    gotit: 0,
    mastered: 0,
    xpEarned: 0,
    missedCardIds: [],
  })

  const [seenCardIds, setSeenCardIds] = useState<Set<string>>(new Set())

  // Load SR state and counter from localStorage once on mount
  useEffect(() => {
    setSrStates(getSRState(deckId))
    setCardIndex(getDeckCounter(deckId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== 'studying') return
      if (!isFlipped && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        setIsFlipped(true)
        return
      }
      if (isFlipped) {
        if (e.key === '1') rateCard('missed')
        else if (e.key === '2') rateCard('hard')
        else if (e.key === '3') rateCard('gotit')
        else if (e.key === '4') rateCard('mastered')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFlipped, phase, queuePos, queue, cardIndex, srStates, stats, seenCardIds],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function rateCard(rating: Rating) {
    const cardId = queue[queuePos]
    if (!cardId) return

    const existingState = srStates[cardId] ?? {
      cardId,
      interval: 5,
      easeFactor: 2.5,
      repetitions: 0,
      nextReviewAt: 0,
      lastRating: null,
    }

    const newState = rateSRCard(existingState, rating, cardIndex)
    const newSRStates = { ...srStates, [cardId]: newState }
    setSrStates(newSRStates)

    // Persist immediately
    saveSRState(deckId, newSRStates)
    const newCardIndex = cardIndex + 1
    setCardIndex(newCardIndex)
    saveDeckCounter(deckId, newCardIndex)

    // Update seen set
    setSeenCardIds((prev) => new Set([...prev, cardId]))

    // Re-insert missed/hard cards into the queue
    let newQueue = [...queue]
    if (rating === 'missed' || rating === 'hard') {
      const insertInterval = rating === 'missed' ? 3 : Math.max(5, Math.round(existingState.interval * 1.2))
      const insertAt = Math.min(queuePos + insertInterval + 1, newQueue.length)
      newQueue = [...newQueue.slice(0, insertAt), cardId, ...newQueue.slice(insertAt)]
      setQueue(newQueue)
    }

    // Accumulate XP
    let xpGained = 0
    if (rating === 'gotit') xpGained = addXP('flashcardGotIt')
    else if (rating === 'mastered') xpGained = addXP('flashcardMastered')

    // Update stats
    const newStats: SessionStats = {
      ...stats,
      total: stats.total + 1,
      missed: stats.missed + (rating === 'missed' ? 1 : 0),
      hard: stats.hard + (rating === 'hard' ? 1 : 0),
      gotit: stats.gotit + (rating === 'gotit' ? 1 : 0),
      mastered: stats.mastered + (rating === 'mastered' ? 1 : 0),
      xpEarned: stats.xpEarned + xpGained,
      missedCardIds:
        rating === 'missed'
          ? [...stats.missedCardIds, cardId]
          : stats.missedCardIds,
    }
    setStats(newStats)

    const nextPos = queuePos + 1

    // Session complete when queue is exhausted
    if (nextPos >= newQueue.length) {
      const sessionXP = addXP('flashcardSessionComplete')
      const finalStats: SessionStats = { ...newStats, xpEarned: newStats.xpEarned + sessionXP }
      setStats(finalStats)
      recordFlashcardSession(deckId, {
        totalRated: finalStats.total,
        masteredCardIds: newQueue
          .filter((id, idx, arr) => arr.indexOf(id) === idx)
          .filter((id) => {
            const s = newSRStates[id]
            return s?.lastRating === 'mastered'
          }),
        gotitCardIds: newQueue
          .filter((id, idx, arr) => arr.indexOf(id) === idx)
          .filter((id) => {
            const s = newSRStates[id]
            return s?.lastRating === 'gotit'
          }),
      })
      setPhase('complete')
      return
    }

    setQueuePos(nextPos)
    setIsFlipped(false)
  }

  function restartSession(focusCardIds?: string[]) {
    const deckCards = focusCardIds
      ? focusCardIds.map((id) => cardsMap.get(id)).filter((c): c is AnyCard => c !== undefined)
      : cards
    setQueue(shuffle(deckCards.map((c) => c.id)))
    setQueuePos(0)
    setIsFlipped(false)
    setPhase('studying')
    setStats({ total: 0, missed: 0, hard: 0, gotit: 0, mastered: 0, xpEarned: 0, missedCardIds: [] })
    setSeenCardIds(new Set())
  }

  // ── Complete screen ───────────────────────────────────────────────────────────

  if (phase === 'complete') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Session Complete!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {originalCount} card{originalCount !== 1 ? 's' : ''} studied
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 w-full max-w-sm">
          <StatBox label="Missed" value={stats.missed} color="red" />
          <StatBox label="Hard" value={stats.hard} color="amber" />
          <StatBox label="Got it" value={stats.gotit} color="blue" />
          <StatBox label="Mastered" value={stats.mastered} color="green" />
        </div>

        {stats.xpEarned > 0 && (
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-6">
            +{stats.xpEarned} XP earned ⭐
          </p>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {stats.missedCardIds.length > 0 && (
            <button
              onClick={() => restartSession(stats.missedCardIds)}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors"
            >
              Focus on {stats.missedCardIds.length} missed card{stats.missedCardIds.length !== 1 ? 's' : ''}
            </button>
          )}
          <button
            onClick={() => restartSession()}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors"
          >
            Study again
          </button>
          <button
            onClick={() => onComplete(stats)}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Back to hub
          </button>
        </div>
      </div>
    )
  }

  // ── Studying screen ───────────────────────────────────────────────────────────

  const currentCard = cardsMap.get(queue[queuePos])
  if (!currentCard) return null

  const uniqueSeen = Math.min(seenCardIds.size + 1, originalCount)
  const progressPct = Math.round((uniqueSeen / originalCount) * 100)

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ✕ Exit
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">
            ⭐ {stats.mastered}
          </span>
          <span>·</span>
          <span>
            {uniqueSeen} / {originalCount}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full rounded-full bg-purple-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 flex flex-col justify-center mb-8"
        onClick={() => { if (!isFlipped) setIsFlipped(true) }}
      >
        <div style={{ perspective: '1200px' }}>
          <div
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s ease',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              position: 'relative',
              minHeight: '260px',
            }}
          >
            {/* Front */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer"
            >
              <p className="text-xl sm:text-2xl font-medium text-center text-gray-900 dark:text-white leading-relaxed">
                {currentCard.front}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
                tap to reveal · or press Space
              </p>
            </div>

            {/* Back */}
            <div
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/40"
            >
              <p className="text-xl sm:text-2xl font-medium text-center text-gray-900 dark:text-white leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons (shown when flipped) */}
      {isFlipped && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <RatingButton
            label="😕 Missed"
            sublabel="1"
            color="red"
            onClick={() => rateCard('missed')}
          />
          <RatingButton
            label="😐 Hard"
            sublabel="2"
            color="amber"
            onClick={() => rateCard('hard')}
          />
          <RatingButton
            label="🙂 Got it"
            sublabel="3"
            color="blue"
            onClick={() => rateCard('gotit')}
          />
          <RatingButton
            label="⭐ Mastered"
            sublabel="4"
            color="green"
            onClick={() => rateCard('mastered')}
          />
        </div>
      )}

      {!isFlipped && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          keyboard: Space to flip · 1–4 to rate
        </p>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

type Color = 'red' | 'amber' | 'blue' | 'green'

const colorMap: Record<Color, string> = {
  red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60',
  amber: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60',
  blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60',
  green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/60',
}

function RatingButton({
  label,
  sublabel,
  color,
  onClick,
}: {
  label: string
  sublabel: string
  color: Color
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${colorMap[color]}`}
    >
      {label}
      <span className="text-xs opacity-50">{sublabel}</span>
    </button>
  )
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: Color
}) {
  const textColor: Record<Color, string> = {
    red: 'text-red-600 dark:text-red-400',
    amber: 'text-amber-600 dark:text-amber-400',
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
  }
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60">
      <span className={`text-xl font-bold ${textColor[color]}`}>{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  )
}
