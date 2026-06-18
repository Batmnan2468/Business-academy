// 4-state topic mastery system stored in localStorage.
// All access is guarded by typeof window so this is safe to import in server-rendered components.

import { syncToDatabase } from './syncProgress'

export type TopicState = 'untouched' | 'inProgress' | 'practiced' | 'mastered'
export type UnitTestState = 'notStarted' | 'inProgress' | 'passed'

export function getTopicState(courseSlug: string, topicSlug: string): TopicState {
  if (typeof window === 'undefined') return 'untouched'
  try {
    const v = localStorage.getItem(`topicState_${courseSlug}_${topicSlug}`)
    return (v as TopicState) ?? 'untouched'
  } catch {
    return 'untouched'
  }
}

export function setTopicState(courseSlug: string, topicSlug: string, state: TopicState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`topicState_${courseSlug}_${topicSlug}`, state)
  } catch { /* quota exceeded */ }
  syncToDatabase('topicState', { courseSlug, topicSlug, state })
}

export function getUnitTestState(courseSlug: string, unitId: string): UnitTestState {
  if (typeof window === 'undefined') return 'notStarted'
  try {
    const v = localStorage.getItem(`unitTestState_${courseSlug}_${unitId}`)
    return (v as UnitTestState) ?? 'notStarted'
  } catch {
    return 'notStarted'
  }
}

export function setUnitTestState(courseSlug: string, unitId: string, state: UnitTestState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`unitTestState_${courseSlug}_${unitId}`, state)
  } catch { /* quota exceeded */ }
  syncToDatabase('unitTestState', { courseSlug, unitId, state })
}

export function countPracticedTopics(courseSlug: string, topicSlugs: string[]): number {
  if (typeof window === 'undefined') return 0
  let count = 0
  for (const slug of topicSlugs) {
    const s = getTopicState(courseSlug, slug)
    if (s === 'practiced' || s === 'mastered') count++
  }
  return count
}

export function applyExamResult(
  courseSlug: string,
  topicSlug: string,
  isCorrect: boolean,
): void {
  const current = getTopicState(courseSlug, topicSlug)
  if (isCorrect) {
    if (current !== 'mastered') {
      setTopicState(courseSlug, topicSlug, 'practiced')
    }
  } else {
    if (current === 'mastered') {
      setTopicState(courseSlug, topicSlug, 'practiced')
    } else {
      setTopicState(courseSlug, topicSlug, 'inProgress')
    }
  }
}
