import fs from 'fs'
import path from 'path'
import type { Course } from '@/types'

const contentDir = path.join(process.cwd(), 'content', 'courses')

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
