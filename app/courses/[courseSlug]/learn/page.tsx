import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics } from '@/lib/courses'
import LearnModeOverview from '@/components/learn/LearnModeOverview'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function LearnOverviewPage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const allTopics = getAllTopics(course)

  const slimUnits = course.units?.map((u) => ({
    id: u.id,
    title: u.title,
    topics: u.topics.map(({ id, slug, title }) => ({ id, slug, title })),
  }))
  const slimTopics = course.topics?.map(({ id, slug, title }) => ({ id, slug, title }))

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 sm:py-12">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-blue-500 hover:underline mb-8 inline-block"
      >
        ← {course.title}
      </Link>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          {course.subject}
        </span>
        <h1 className="text-2xl font-bold mt-1">📖 Learn Mode</h1>
        <p className="text-sm text-gray-400 mt-1">
          {allTopics.length} topics — read each concept, then test your understanding.
        </p>
      </div>

      <LearnModeOverview courseSlug={courseSlug} units={slimUnits} topics={slimTopics} />
    </main>
  )
}
