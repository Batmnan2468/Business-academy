import Link from 'next/link'
import { getCourses } from '@/lib/courses'
import CourseCard from '@/components/course/CourseCard'

export default function HomePage() {
  const courses = getCourses()

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Business Academy</h1>
        <p className="mt-2 text-lg text-gray-500">
          Free, world-class business education for everyone.
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-6">Courses</h2>
        {courses.length === 0 ? (
          <p className="text-gray-400">No courses yet — add a course.json to content/courses/.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
