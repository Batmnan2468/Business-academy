import { todayStr } from './mastery'
import { syncToDatabase } from './syncProgress'

export const XP_VALUES = {
  learnTopicCompleted: 10,
  practiceCorrect: 2,
  masteryAchieved: 25,
  unitTestPassed: 50,
  courseTestCompleted: 30,
  dailyGoalMet: 20,
  streakBonus: 5,
  flashcardGotIt: 3,
  flashcardMastered: 8,
  flashcardSessionComplete: 15,
} as const

export const LEVELS = [
  { min: 0,    title: 'Business Student' },
  { min: 100,  title: 'Analyst' },
  { min: 300,  title: 'Associate' },
  { min: 600,  title: 'Manager' },
  { min: 1000, title: 'Director' },
  { min: 1500, title: 'VP' },
  { min: 2500, title: 'Executive' },
] as const

// ── Types ──────────────────────────────────────────────────────────────────────

interface XPEvent {
  event: string
  amount: number
  timestamp: string
}

interface StreakData {
  current: number
  longest: number
  lastActiveDate: string
}

interface DailyGoalData {
  target: number
  todayCount: number
  lastResetDate: string
}

interface PersonalBests {
  longestStreak: number
  bestSessionAccuracy: number
  bestSessionCount: number
}

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── XP ─────────────────────────────────────────────────────────────────────────

export function getTotalXP(): number {
  return safeGet<number>('xp:total', 0)
}

export function addXP(event: keyof typeof XP_VALUES, multiplier = 1): number {
  const amount = XP_VALUES[event] * multiplier
  safeSet('xp:total', getTotalXP() + amount)

  const history = safeGet<XPEvent[]>('xp:history', [])
  history.push({ event, amount, timestamp: new Date().toISOString() })
  if (history.length > 200) history.splice(0, history.length - 200)
  safeSet('xp:history', history)

  syncToDatabase('xpEvent', { event, amount })

  return amount
}

// ── Levels ─────────────────────────────────────────────────────────────────────

export function getLevelInfo(): {
  level: number
  title: string
  currentXP: number
  nextLevelXP: number | null
  progressPct: number
} {
  const xp = getTotalXP()
  let levelIdx = 0
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) {
      levelIdx = i
      break
    }
  }

  const current = LEVELS[levelIdx]
  const next = levelIdx < LEVELS.length - 1 ? LEVELS[levelIdx + 1] : null

  const progressPct = next
    ? Math.min(100, Math.round(((xp - current.min) / (next.min - current.min)) * 100))
    : 100

  return {
    level: levelIdx + 1,
    title: current.title,
    currentXP: xp,
    nextLevelXP: next?.min ?? null,
    progressPct,
  }
}

// ── Streak ─────────────────────────────────────────────────────────────────────

export function getStreak(): { current: number; longest: number } {
  const data = safeGet<StreakData>('xp:streak', { current: 0, longest: 0, lastActiveDate: '' })
  return { current: data.current, longest: data.longest }
}

export function updateStreak(): { current: number; longest: number } {
  const today = todayStr()
  const data = safeGet<StreakData>('xp:streak', { current: 0, longest: 0, lastActiveDate: '' })

  if (data.lastActiveDate === today) {
    return { current: data.current, longest: data.longest }
  }

  const d = new Date(today)
  d.setUTCDate(d.getUTCDate() - 1)
  const yesterday = d.toISOString().slice(0, 10)

  const newCurrent = data.lastActiveDate === yesterday ? data.current + 1 : 1
  const newLongest = Math.max(data.longest, newCurrent)

  safeSet('xp:streak', { current: newCurrent, longest: newLongest, lastActiveDate: today } satisfies StreakData)

  syncToDatabase('profile', {
    streakCurrent: newCurrent,
    streakLongest: newLongest,
    lastActiveDate: today,
    totalXP: getTotalXP(),
    dailyGoalTarget: getDailyGoal().target,
  })

  return { current: newCurrent, longest: newLongest }
}

// ── Daily Goal ─────────────────────────────────────────────────────────────────

export function getDailyGoal(): { todayCount: number; target: number; pct: number } {
  const today = todayStr()
  const data = safeGet<DailyGoalData>('xp:dailyGoal', { target: 10, todayCount: 0, lastResetDate: '' })
  const todayCount = data.lastResetDate === today ? data.todayCount : 0
  const pct = Math.min(100, Math.round((todayCount / data.target) * 100))
  return { todayCount, target: data.target, pct }
}

export function recordDailyActivity(): { todayCount: number; target: number; justMetGoal: boolean } {
  const today = todayStr()
  const data = safeGet<DailyGoalData>('xp:dailyGoal', { target: 10, todayCount: 0, lastResetDate: '' })

  const prevCount = data.lastResetDate === today ? data.todayCount : 0
  const newCount = prevCount + 1
  const justMetGoal = prevCount < data.target && newCount >= data.target

  safeSet('xp:dailyGoal', { target: data.target, todayCount: newCount, lastResetDate: today } satisfies DailyGoalData)

  return { todayCount: newCount, target: data.target, justMetGoal }
}

// ── Personal Bests ─────────────────────────────────────────────────────────────

export function getPersonalBests(): {
  longestStreak: number
  bestSessionAccuracy: number
  bestSessionCount: number
} {
  return safeGet<PersonalBests>('xp:personalBests', {
    longestStreak: 0,
    bestSessionAccuracy: 0,
    bestSessionCount: 0,
  })
}

export function updatePersonalBests(sessionData: {
  streak: number
  correct: number
  total: number
}): void {
  const bests = getPersonalBests()
  const sessionAccuracy =
    sessionData.total >= 5
      ? Math.round((sessionData.correct / sessionData.total) * 100)
      : -1

  safeSet('xp:personalBests', {
    longestStreak: Math.max(bests.longestStreak, sessionData.streak),
    bestSessionAccuracy:
      sessionAccuracy >= 0
        ? Math.max(bests.bestSessionAccuracy, sessionAccuracy)
        : bests.bestSessionAccuracy,
    bestSessionCount: Math.max(bests.bestSessionCount, sessionData.total),
  } satisfies PersonalBests)
}
