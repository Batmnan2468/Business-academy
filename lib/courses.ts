import fs from 'fs'
import path from 'path'
import type { Course, Topic, PracticeQuestion } from '@/types'
import { isLearnContentV2 } from '@/types'
import type { TermCard } from '@/lib/courseFlashcards'

export function getAllTopics(course: Course): Topic[] {
  if (course.units) return course.units.flatMap((u) => u.topics)
  return course.topics ?? []
}

const contentDir = path.join(process.cwd(), 'content', 'courses')
const questionsDir = path.join(process.cwd(), 'content', 'questions')
const flashcardsDir = path.join(process.cwd(), 'content', 'flashcards')

export function getCourses(): Course[] {
  const slugs = fs.readdirSync(contentDir)
  return slugs
    .map((slug) => {
      try {
        const raw = fs.readFileSync(path.join(contentDir, slug, 'course.json'), 'utf-8')
        return JSON.parse(raw) as Course
      } catch {
        return null
      }
    })
    .filter(Boolean) as Course[]
}

export function getCourse(slug: string): Course | null {
  try {
    const raw = fs.readFileSync(path.join(contentDir, slug, 'course.json'), 'utf-8')
    return JSON.parse(raw) as Course
  } catch {
    return null
  }
}

export function hasLearnContent(course: Course): boolean {
  const topics = getAllTopics(course)
  return topics.some((t) => t.learn && isLearnContentV2(t.learn))
}

export function hasPracticeQuestions(courseSlug: string): boolean {
  try {
    const dir = path.join(questionsDir, courseSlug)
    return fs.existsSync(dir) && fs.readdirSync(dir).length > 0
  } catch {
    return false
  }
}

export function getTopicQuestions(courseSlug: string, topicSlug: string): PracticeQuestion[] {
  try {
    const filePath = path.join(questionsDir, courseSlug, `${topicSlug}.json`)
    if (!fs.existsSync(filePath)) return []
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as PracticeQuestion[]
  } catch {
    return []
  }
}

export function loadTermCards(courseSlug: string): TermCard[] {
  try {
    const filePath = path.join(flashcardsDir, `${courseSlug}-terms.json`)
    if (!fs.existsSync(filePath)) return []
    const raw = fs.readFileSync(filePath, 'utf-8')
    const items = JSON.parse(raw) as Array<{ id: string; front: string; back: string; tags: string[] }>
    return items.map((item) => ({ ...item, type: 'term' as const, courseSlug }))
  } catch {
    return []
  }
}
