import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics } from '@/lib/courses'
import CourseTest from '@/components/exercise/CourseTest'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function TestPage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const allTopics = getAllTopics(course).map(({ slug, title }) => ({ slug, title }))

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
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
        <h1 className="text-2xl font-bold mt-1">Course Test</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          30 random questions drawn from across all topics. No hints — explanations revealed at the
          end.
        </p>
      </div>

      <CourseTest courseSlug={courseSlug} allTopics={allTopics} count={30} />
    </main>
  )
}
