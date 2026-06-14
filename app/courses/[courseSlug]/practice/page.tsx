import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics, hasPracticeQuestions } from '@/lib/courses'
import CourseTopicList from '@/components/CourseTopicList'

interface Props {
  params: Promise<{ courseSlug: string }>
}

export default async function PracticeOverviewPage({ params }: Props) {
  const { courseSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const allTopics = getAllTopics(course)
  const hasQuestions = hasPracticeQuestions(courseSlug)

  const slimUnits = course.units?.map((u) => ({
    id: u.id,
    title: u.title,
    topics: u.topics.map(({ id, slug, title }) => ({ id, slug, title })),
  }))
  const slimTopics = course.topics?.map(({ id, slug, title }) => ({ id, slug, title }))

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
        <h1 className="text-2xl font-bold mt-1">✏️ Practice Mode</h1>
        <p className="text-sm text-gray-400 mt-1">
          {hasQuestions
            ? `${allTopics.length} topics — answer questions and build mastery.`
            : 'Practice questions are being prepared for this course.'}
        </p>
      </div>

      {hasQuestions ? (
        <CourseTopicList
          courseSlug={courseSlug}
          units={slimUnits}
          topics={slimTopics}
          totalTopics={allTopics.length}
          hasLearnContent={false}
        />
      ) : (
        <div>
          <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 px-6 py-8 mb-8 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Practice questions coming soon
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Questions are being generated for this course. Check back soon or start with Learn Mode.
            </p>
            <Link
              href={`/courses/${courseSlug}/learn`}
              className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              📖 Go to Learn Mode
            </Link>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Topics that will be available:
          </p>

          {slimUnits ? (
            <div className="space-y-6">
              {slimUnits.map((unit) => (
                <div key={unit.id}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                    {unit.title}
                  </h3>
                  <ul className="list-none space-y-1.5 m-0 p-0">
                    {unit.topics.map((topic, i) => (
                      <li
                        key={topic.id}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-500"
                      >
                        <span className="text-xs text-gray-300 dark:text-gray-700 tabular-nums w-4 shrink-0">
                          {i + 1}
                        </span>
                        {topic.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="list-none space-y-1.5 m-0 p-0">
              {(slimTopics ?? []).map((topic, i) => (
                <li
                  key={topic.id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-500"
                >
                  <span className="text-xs text-gray-300 dark:text-gray-700 tabular-nums w-4 shrink-0">
                    {i + 1}
                  </span>
                  {topic.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  )
}
