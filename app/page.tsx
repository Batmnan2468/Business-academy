import Link from 'next/link'
import { getCourses, getAllTopics } from '@/lib/courses'
import CourseCard from '@/components/course/CourseCard'
import EmptyStateBanner from '@/components/EmptyStateBanner'

export default function HomePage() {
  const courses = getCourses()
  const totalTopics = courses.reduce((sum, c) => sum + getAllTopics(c).length, 0)
  const allTopicData = courses.map((c) => ({
    courseSlug: c.slug,
    topicSlugs: getAllTopics(c).map((t) => t.slug),
  }))

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">Business Academy</h1>
        <p className="text-xl text-gray-500 mb-6">
          Master your NC State business courses before you walk in the door.
        </p>
        <div className="flex justify-center gap-3 mb-8">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {courses.length} courses available
          </span>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {totalTopics} total topics
          </span>
        </div>
        <a
          href="#courses"
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
        >
          Start Learning →
        </a>
      </section>

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
