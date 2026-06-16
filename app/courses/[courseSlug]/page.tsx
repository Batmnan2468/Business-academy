import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics, hasLearnContent } from '@/lib/courses'
import CourseTopicList from '@/components/CourseTopicList'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function CoursePage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)

  if (!course) notFound()

  const allTopics = getAllTopics(course)
  const courseHasLearn = hasLearnContent(course)

  const slimUnits = course.units?.map((u) => ({
    id: u.id,
    title: u.title,
    topics: u.topics.map(({ id, slug, title }) => ({ id, slug, title })),
  }))
  const slimTopics = course.topics?.map(({ id, slug, title }) => ({ id, slug, title }))

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-8 inline-block">
        ← All courses
      </Link>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          {course.subject}
        </span>
        <h1 className="text-3xl font-bold mt-1">{course.title}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{course.description}</p>
      </div>

      <CourseTopicList
        courseSlug={courseSlug}
        units={slimUnits}
        topics={slimTopics}
        totalTopics={allTopics.length}
        hasLearnContent={courseHasLearn}
      />
    </main>
  )
}
