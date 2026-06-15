import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics } from '@/lib/courses'
import MasteredTopicsReview from '@/components/exercise/MasteredTopicsReview'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function MasteredReviewPage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const allTopics = getAllTopics(course).map(({ slug, title }) => ({ slug, title }))

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-12">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-blue-500 hover:underline mb-8 inline-block"
      >
        ← {course.title}
      </Link>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
          {course.subject}
        </span>
        <h1 className="text-2xl font-bold mt-1">Mastered Topics Review</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Questions drawn exclusively from topics you&apos;ve already mastered. Customize your test
          below.
        </p>
      </div>

      <MasteredTopicsReview courseSlug={courseSlug} allTopics={allTopics} />
    </main>
  )
}
