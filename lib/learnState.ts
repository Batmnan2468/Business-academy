export type LearnState = 'unread' | 'reading' | 'completed'
export type LearnRating = 'nailed' | 'partial' | 'missed'

function safe<T>(fn: () => T, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    return fn()
  } catch {
    return fallback
  }
}

export function getLearnState(courseSlug: string, topicSlug: string): LearnState {
  return safe(() => {
    const v = localStorage.getItem(`learnState_${courseSlug}_${topicSlug}`)
    return (v as LearnState) ?? 'unread'
  }, 'unread')
}

export function setLearnState(courseSlug: string, topicSlug: string, state: LearnState): void {
  safe(() => {
    localStorage.setItem(`learnState_${courseSlug}_${topicSlug}`, state)
  }, undefined)
}

export function getLearnThought(courseSlug: string, topicSlug: string): string {
  return safe(() => localStorage.getItem(`learnThought_${courseSlug}_${topicSlug}`) ?? '', '')
}

export function setLearnThought(courseSlug: string, topicSlug: string, thought: string): void {
  safe(() => {
    localStorage.setItem(`learnThought_${courseSlug}_${topicSlug}`, thought)
  }, undefined)
}

export function getLearnRating(courseSlug: string, topicSlug: string): LearnRating | null {
  return safe(() => {
    const v = localStorage.getItem(`learnRating_${courseSlug}_${topicSlug}`)
    return (v as LearnRating) ?? null
  }, null)
}

export function setLearnRating(courseSlug: string, topicSlug: string, rating: LearnRating): void {
  safe(() => {
    localStorage.setItem(`learnRating_${courseSlug}_${topicSlug}`, rating)
  }, undefined)
}

export interface CheckpointResult {
  score: number
  total: number
  completedAt: string
}

export function getCheckpointResult(courseSlug: string, topicSlug: string): CheckpointResult | null {
  return safe(() => {
    const v = localStorage.getItem(`checkpointResult_${courseSlug}_${topicSlug}`)
    return v ? (JSON.parse(v) as CheckpointResult) : null
  }, null)
}

export function setCheckpointResult(courseSlug: string, topicSlug: string, result: CheckpointResult): void {
  safe(() => {
    localStorage.setItem(`checkpointResult_${courseSlug}_${topicSlug}`, JSON.stringify(result))
  }, undefined)
}

export function setLastLearnVisit(courseSlug: string, topicSlug: string): void {
  safe(() => {
    localStorage.setItem('lastLearnVisit', JSON.stringify({ courseSlug, topicSlug }))
  }, undefined)
}

export function getLastLearnVisit(): { courseSlug: string; topicSlug: string } | null {
  return safe(() => {
    const v = localStorage.getItem('lastLearnVisit')
    return v ? (JSON.parse(v) as { courseSlug: string; topicSlug: string }) : null
  }, null)
}

export function setLastPracticeVisit(courseSlug: string, topicSlug: string): void {
  safe(() => {
    localStorage.setItem('lastPracticeVisit', JSON.stringify({ courseSlug, topicSlug }))
  }, undefined)
}

export function getLastPracticeVisit(): { courseSlug: string; topicSlug: string } | null {
  return safe(() => {
    const v = localStorage.getItem('lastPracticeVisit')
    return v ? (JSON.parse(v) as { courseSlug: string; topicSlug: string }) : null
  }, null)
}
