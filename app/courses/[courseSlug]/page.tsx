import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics } from '@/lib/courses'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function CoursePage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)

  if (!course) notFound()

  const allTopics = getAllTopics(course)
  let globalIndex = 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-blue-500 hover:underline mb-8 inline-block">
        ← All courses
      </Link>

      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          {course.subject}
        </span>
        <h1 className="text-3xl font-bold mt-1">{course.title}</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">{course.description}</p>
        <p className="mt-3 text-sm text-gray-400">{allTopics.length} topics</p>
      </div>

      {course.units ? (
        <div className="space-y-8">
          {course.units.map((unit) => (
            <div key={unit.id}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {unit.title}
              </h2>
              <ul className="list-none space-y-2 m-0 p-0">
                {unit.topics.map((topic) => {
                  const num = ++globalIndex
                  return (
                    <li key={topic.id}>
                      <Link
                        href={`/courses/${courseSlug}/${topic.slug}`}
                        className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group"
                      >
                        <span className="text-sm text-gray-400 w-6 shrink-0 tabular-nums">{num}</span>
                        <span className="flex-1 font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          {topic.title}
                        </span>
                        <span className="text-gray-400 group-hover:text-blue-400 text-sm">→</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Topics
          </h2>
          <ul className="list-none space-y-2 m-0 p-0">
            {(course.topics ?? []).map((topic, i) => (
              <li key={topic.id}>
                <Link
                  href={`/courses/${courseSlug}/${topic.slug}`}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group"
                >
                  <span className="text-sm text-gray-400 w-5 shrink-0 tabular-nums">{i + 1}</span>
                  <span className="flex-1 font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    {topic.title}
                  </span>
                  <span className="text-gray-400 group-hover:text-blue-400 text-sm">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
