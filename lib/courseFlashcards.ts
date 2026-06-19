// Build flashcard objects from course learn content at runtime.
// Runs in the browser (course data is passed as props from server components).

import type { Course, Topic, LearnContent } from '@/types'
import { isLearnContentV2 } from '@/types'

export interface CourseCard {
  id: string          // "${courseSlug}:${topicSlug}"
  courseSlug: string
  topicSlug: string
  unitId: string      // empty string for flat-topic courses
  topicTitle: string
  front: string       // openingQuestion (v2) or "Title — what is this?" (v1)
  back: string        // anchorSummary (v2) or first keyPoint (v1)
  type: 'course'
}

export interface TermCard {
  id: string
  front: string
  back: string
  tags: string[]
  type: 'term'
  courseSlug: string
}

function topicToCard(topic: Topic, courseSlug: string, unitId: string): CourseCard | null {
  if (!topic.learn) return null

  const learn = topic.learn
  let front: string
  let back: string

  if (isLearnContentV2(learn)) {
    front = learn.openingQuestion
    back = learn.anchorSummary
  } else {
    const v1 = learn as LearnContent
    front = `${topic.title} — what is this?`
    back = v1.keyPoints[0] ?? v1.explanation.slice(0, 120)
  }

  if (!front || !back) return null

  return {
    id: `${courseSlug}:${topic.slug}`,
    courseSlug,
    topicSlug: topic.slug,
    unitId,
    topicTitle: topic.title,
    front,
    back,
    type: 'course',
  }
}

export function buildCourseCards(course: Course): CourseCard[] {
  const cards: CourseCard[] = []

  if (course.units) {
    for (const unit of course.units) {
      for (const topic of unit.topics) {
        const card = topicToCard(topic, course.slug, unit.id)
        if (card) cards.push(card)
      }
    }
  } else if (course.topics) {
    for (const topic of course.topics) {
      const card = topicToCard(topic, course.slug, '')
      if (card) cards.push(card)
    }
  }

  return cards
}

export function buildCourseCardsForUnit(course: Course, unitId: string): CourseCard[] {
  if (!course.units) return []
  const unit = course.units.find((u) => u.id === unitId)
  if (!unit) return []
  return unit.topics
    .map((topic) => topicToCard(topic, course.slug, unitId))
    .filter((c): c is CourseCard => c !== null)
}
