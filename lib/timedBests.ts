export interface TimedBest {
  timeSeconds: number
  score: number
  total: number
  date: string
}

function safeGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded */ }
}

export function getUnitBest(courseSlug: string, unitId: string): TimedBest | null {
  return safeGet<TimedBest>(`timedBest:unit:${courseSlug}:${unitId}`)
}

export function saveUnitBest(
  courseSlug: string,
  unitId: string,
  timeSeconds: number,
  score: number,
  total: number,
): void {
  const key = `timedBest:unit:${courseSlug}:${unitId}`
  const existing = safeGet<TimedBest>(key)
  if (existing && existing.timeSeconds <= timeSeconds) return
  safeSet(key, { timeSeconds, score, total, date: new Date().toISOString() } satisfies TimedBest)
}

export function getCourseBest(courseSlug: string): TimedBest | null {
  return safeGet<TimedBest>(`timedBest:course:${courseSlug}`)
}

export function saveCourseBest(
  courseSlug: string,
  timeSeconds: number,
  score: number,
  total: number,
): void {
  const key = `timedBest:course:${courseSlug}`
  const existing = safeGet<TimedBest>(key)
  if (existing && existing.timeSeconds <= timeSeconds) return
  safeSet(key, { timeSeconds, score, total, date: new Date().toISOString() } satisfies TimedBest)
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatBestDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}
