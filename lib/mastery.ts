// Spaced-repetition and mastery-decay library.
// All localStorage access is guarded by typeof window checks so this module
// is safe to import from client components that are also server-rendered.

export interface TopicMastery {
  interval: number           // days until next review (SM-2)
  easeFactor: number         // quality multiplier, clamped 1.3–2.5
  nextReviewDate: string     // YYYY-MM-DD
  masteryLevel: number       // 0 = never mastered; 1–4 = mastered N times; 5 = permanent
  lastReviewedDate: string   // YYYY-MM-DD
  permanentlyMastered: boolean
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function daysSince(from: string): number {
  const a = new Date(from).getTime()
  const b = new Date(todayStr()).getTime()
  return Math.max(0, Math.floor((b - a) / 86_400_000))
}

// ── localStorage access ───────────────────────────────────────────────────────

function masteryKey(courseSlug: string, topicSlug: string): string {
  return `mastery:${courseSlug}:${topicSlug}`
}

export function getMastery(courseSlug: string, topicSlug: string): TopicMastery | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(masteryKey(courseSlug, topicSlug))
    return raw ? (JSON.parse(raw) as TopicMastery) : null
  } catch {
    return null
  }
}

export function setMastery(courseSlug: string, topicSlug: string, m: TopicMastery): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(masteryKey(courseSlug, topicSlug), JSON.stringify(m))
  } catch { /* quota exceeded */ }
}

// ── SM-2 constants ────────────────────────────────────────────────────────────

const MIN_EASE = 1.3
const MAX_EASE = 2.5
const INITIAL_EASE = 2.5
const PERMANENT_THRESHOLD = 5

// ── Called from regular practice when 4-in-a-row is achieved ─────────────────

export function onTopicCompleted(courseSlug: string, topicSlug: string): void {
  const existing = getMastery(courseSlug, topicSlug)
  const today = todayStr()
  const tomorrow = addDays(today, 1)
  const prevLevel = existing?.masteryLevel ?? 0
  const newLevel = prevLevel + 1

  const updated: TopicMastery = {
    // First mastery resets to defaults; re-masteries keep existing SM-2 values
    interval: prevLevel === 0 ? 1 : (existing?.interval ?? 1),
    easeFactor: prevLevel === 0 ? INITIAL_EASE : (existing?.easeFactor ?? INITIAL_EASE),
    nextReviewDate: tomorrow,
    masteryLevel: newLevel,
    lastReviewedDate: today,
    permanentlyMastered: newLevel >= PERMANENT_THRESHOLD,
  }

  setMastery(courseSlug, topicSlug, updated)
}

// ── Called after a daily-review question is answered ─────────────────────────

export function onReviewAnswer(
  courseSlug: string,
  topicSlug: string,
  isCorrect: boolean,
): void {
  const existing = getMastery(courseSlug, topicSlug)
  if (!existing) return

  const today = todayStr()
  let { interval, easeFactor } = existing

  if (isCorrect) {
    interval = Math.round(interval * easeFactor)
    easeFactor = Math.min(easeFactor + 0.1, MAX_EASE)
  } else {
    interval = 1
    easeFactor = Math.max(easeFactor - 0.2, MIN_EASE)
  }

  setMastery(courseSlug, topicSlug, {
    ...existing,
    interval,
    easeFactor,
    nextReviewDate: addDays(today, interval),
    lastReviewedDate: today,
  })
}

// ── Decay schedules ───────────────────────────────────────────────────────────
// Each entry is [day, percentage]. Piecewise linear between checkpoints.

const DECAY_SCHEDULES: Record<number, [number, number][]> = {
  1: [[0, 100], [1, 75],  [2, 50],  [3, 25],  [4, 0]],
  2: [[0, 100], [1, 85],  [2, 70],  [3, 50],  [5, 25],  [7, 0]],
  3: [[0, 100], [2, 90],  [4, 75],  [6, 50],  [9, 25],  [12, 0]],
  4: [[0, 100], [4, 90],  [8, 75],  [12, 50], [18, 0]],
}

function lerp(points: [number, number][], days: number): number {
  if (days <= 0) return 100
  const last = points[points.length - 1]
  if (days >= last[0]) return last[1]
  for (let i = 0; i < points.length - 1; i++) {
    const [d0, v0] = points[i]
    const [d1, v1] = points[i + 1]
    if (days >= d0 && days <= d1) {
      const t = (days - d0) / (d1 - d0)
      return Math.round(v0 + t * (v1 - v0))
    }
  }
  return 0
}

export function getMasteryPct(m: TopicMastery): number {
  if (m.permanentlyMastered || m.masteryLevel >= PERMANENT_THRESHOLD) return 100
  if (m.masteryLevel === 0) return 0
  const schedule = DECAY_SCHEDULES[Math.min(m.masteryLevel, 4)]
  return lerp(schedule, daysSince(m.lastReviewedDate))
}

// ── Review scheduling ─────────────────────────────────────────────────────────

export function isDueToday(m: TopicMastery): boolean {
  if (m.permanentlyMastered) return false
  return m.nextReviewDate <= todayStr()
}

export function getDueTopics<T extends { slug: string }>(
  courseSlug: string,
  topics: T[],
): T[] {
  return topics.filter((t) => {
    const m = getMastery(courseSlug, t.slug)
    return m !== null && isDueToday(m)
  })
}
