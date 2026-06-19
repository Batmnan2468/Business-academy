// Flashcard system — data models, spaced repetition algorithm, localStorage helpers.
// All localStorage access is guarded by typeof window so this is SSR-safe.

export interface CustomCard {
  id: string          // Date.now() + random suffix
  front: string
  back: string
  createdAt: string   // ISO date string
  tags: string[]
}

export interface SRState {
  cardId: string
  interval: number      // cards until next review
  easeFactor: number    // multiplier, starts at 2.5
  repetitions: number   // consecutive Got It / Mastered ratings
  nextReviewAt: number  // absolute card-counter value when this card is due
  lastRating: 'missed' | 'hard' | 'gotit' | 'mastered' | null
}

export interface FlashcardMastery {
  totalSessions: number
  totalCardsRated: number
  masteredCardIds: string[]  // rated Mastered at least once
  gotitCardIds: string[]     // rated Got It at least once
  lastSessionDate: string
}

export const FLASHCARD_XP = {
  gotit: 3,
  mastered: 8,
  sessionComplete: 15,
} as const

// ── Internal storage shape ────────────────────────────────────────────────────

interface DeckStorage {
  counter: number                  // persistent card-count across sessions
  cards: Record<string, SRState>
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded */ }
}

// ── Custom card CRUD ──────────────────────────────────────────────────────────

export function getCustomCards(): CustomCard[] {
  return safeGet<CustomCard[]>('flashcards:custom', [])
}

export function saveCustomCard(card: CustomCard): void {
  const cards = getCustomCards()
  cards.push(card)
  safeSet('flashcards:custom', cards)
}

export function deleteCustomCard(id: string): void {
  safeSet('flashcards:custom', getCustomCards().filter((c) => c.id !== id))
}

export function updateCustomCard(card: CustomCard): void {
  safeSet('flashcards:custom', getCustomCards().map((c) => (c.id === card.id ? card : c)))
}

// ── SR state per deck ─────────────────────────────────────────────────────────

function getDeckStorage(deckId: string): DeckStorage {
  return safeGet<DeckStorage>(`flashcards:sr:${deckId}`, { counter: 0, cards: {} })
}

function saveDeckStorage(deckId: string, storage: DeckStorage): void {
  safeSet(`flashcards:sr:${deckId}`, storage)
}

export function getSRState(deckId: string): Record<string, SRState> {
  return getDeckStorage(deckId).cards
}

export function saveSRState(deckId: string, state: Record<string, SRState>): void {
  const storage = getDeckStorage(deckId)
  saveDeckStorage(deckId, { ...storage, cards: state })
}

export function getDeckCounter(deckId: string): number {
  return getDeckStorage(deckId).counter
}

export function saveDeckCounter(deckId: string, counter: number): void {
  const storage = getDeckStorage(deckId)
  saveDeckStorage(deckId, { ...storage, counter })
}

const DEFAULT_SR: Omit<SRState, 'cardId'> = {
  interval: 5,
  easeFactor: 2.5,
  repetitions: 0,
  nextReviewAt: 0,
  lastRating: null,
}

export function getOrCreateSRState(deckId: string, cardId: string): SRState {
  const storage = getDeckStorage(deckId)
  return storage.cards[cardId] ?? { cardId, ...DEFAULT_SR }
}

// ── SR algorithm (card-count based, not day-based) ────────────────────────────

export function rateSRCard(
  state: SRState,
  rating: 'missed' | 'hard' | 'gotit' | 'mastered',
  currentCardIndex: number,
): SRState {
  let { interval, easeFactor, repetitions } = state
  let nextReviewAt: number

  switch (rating) {
    case 'missed':
      repetitions = 0
      interval = 3
      easeFactor = Math.max(1.3, easeFactor - 0.2)
      nextReviewAt = currentCardIndex + 3
      break
    case 'hard':
      repetitions = Math.max(0, repetitions - 1)
      interval = Math.max(5, Math.round(interval * 1.2))
      easeFactor = Math.max(1.3, easeFactor - 0.1)
      nextReviewAt = currentCardIndex + interval
      break
    case 'gotit':
      repetitions += 1
      if (repetitions === 1) interval = 7
      else if (repetitions === 2) interval = 15
      else interval = Math.round(interval * easeFactor)
      easeFactor = Math.min(3.0, easeFactor + 0.1)
      nextReviewAt = currentCardIndex + interval
      break
    case 'mastered':
      repetitions += 1
      interval = Math.round(interval * easeFactor * 1.5)
      interval = Math.max(50, interval)
      easeFactor = Math.min(3.0, easeFactor + 0.15)
      nextReviewAt = currentCardIndex + interval
      break
  }

  return { ...state, interval, easeFactor, repetitions, nextReviewAt, lastRating: rating }
}

// ── Session helpers ───────────────────────────────────────────────────────────

export function getDueCards(
  deckId: string,
  allCardIds: string[],
  currentIndex: number,
): string[] {
  const storage = getDeckStorage(deckId)
  return allCardIds.filter((id) => {
    const s = storage.cards[id]
    if (!s) return true // never seen = always due
    return s.nextReviewAt <= currentIndex
  })
}

// ── Flashcard mastery (display-only stats) ────────────────────────────────────

export function getFlashcardMastery(deckId: string): FlashcardMastery {
  return safeGet<FlashcardMastery>(`flashcards:mastery:${deckId}`, {
    totalSessions: 0,
    totalCardsRated: 0,
    masteredCardIds: [],
    gotitCardIds: [],
    lastSessionDate: '',
  })
}

export function recordFlashcardSession(
  deckId: string,
  stats: {
    totalRated: number
    masteredCardIds: string[]
    gotitCardIds: string[]
  },
): void {
  const current = getFlashcardMastery(deckId)
  const today = new Date().toISOString().slice(0, 10)
  safeSet(`flashcards:mastery:${deckId}`, {
    totalSessions: current.totalSessions + 1,
    totalCardsRated: current.totalCardsRated + stats.totalRated,
    masteredCardIds: [...new Set([...current.masteredCardIds, ...stats.masteredCardIds])],
    gotitCardIds: [...new Set([...current.gotitCardIds, ...stats.gotitCardIds])],
    lastSessionDate: today,
  } satisfies FlashcardMastery)
}
