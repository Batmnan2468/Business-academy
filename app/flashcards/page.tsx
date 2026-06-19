import { getCourses } from '@/lib/courses'
import GlobalFlashcardHub from '@/components/flashcards/GlobalFlashcardHub'

export default async function FlashcardsPage() {
  const courses = getCourses()

  // Only include courses that have at least one topic with learn content
  const coursesWithLearn = courses.filter((course) => {
    const topics = course.units
      ? course.units.flatMap((u) => u.topics)
      : (course.topics ?? [])
    return topics.some((t) => t.learn)
  })

  return <GlobalFlashcardHub courses={coursesWithLearn} />
}
