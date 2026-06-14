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
