import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/courses'
import CourseFlashcardHub from '@/components/flashcards/CourseFlashcardHub'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function CourseFlashcardsPage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  return <CourseFlashcardHub course={course} courseSlug={courseSlug} />
}
