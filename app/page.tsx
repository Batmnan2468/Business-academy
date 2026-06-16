import Link from 'next/link'
import { getCourses, getAllTopics } from '@/lib/courses'
import CourseCard from '@/components/course/CourseCard'
import EmptyStateBanner from '@/components/EmptyStateBanner'
import ContinueCard from '@/components/ContinueCard'

export default function HomePage() {
  const courses = getCourses()
  const totalTopics = courses.reduce((sum, c) => sum + getAllTopics(c).length, 0)
  const allTopicData = courses.map((c) => ({
    courseSlug: c.slug,
    topicSlugs: getAllTopics(c).map((t) => t.slug),
  }))

  const topicMap: Record<string, string> = {}
  for (const course of courses) {
    for (const topic of getAllTopics(course)) {
      topicMap[`${course.slug}__${topic.slug}`] = topic.title
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <section className="mb-10 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Business Academy</h1>
        <p className="text-base sm:text-xl text-gray-500 mb-6">
          Master your NC State business courses before you walk in the door.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {courses.length} courses available
          </span>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {totalTopics} total topics
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#courses"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
          >
            Start Learning →
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard →
          </a>
        </div>
      </section>

      <ContinueCard topicMap={topicMap} />

      <EmptyStateBanner allTopicData={allTopicData} />

      <section id="courses">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Courses</h2>
          <p className="text-gray-500 mt-1">NC State Poole College of Management</p>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-400">No courses yet — add a course.json to content/courses/.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <CourseCard
                  courseSlug={course.slug}
                  subject={course.subject}
                  title={course.title}
                  description={course.description}
                  level={course.level}
                  totalTopics={getAllTopics(course).length}
                  topicSlugs={getAllTopics(course).map((t) => t.slug)}
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
