import { notFound } from 'next/navigation'
import { getCourse, loadTermCards, loadConceptCards } from '@/lib/courses'
import CourseFlashcardHub from '@/components/flashcards/CourseFlashcardHub'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function CourseFlashcardsPage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const termCards = loadTermCards(courseSlug)
  const conceptCards = loadConceptCards(courseSlug)

  return <CourseFlashcardHub course={course} courseSlug={courseSlug} termCards={termCards} conceptCards={conceptCards} />
}
