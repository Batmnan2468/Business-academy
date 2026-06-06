import Link from 'next/link'
import { getCourses } from '@/lib/courses'
import ProgressBar from '@/components/ui/ProgressBar'

export default function DashboardPage() {
  const courses = getCourses()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <section>
        <h2 className="text-lg font-semibold mb-4">In Progress</h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{course.title}</p>
                <p className="text-sm text-gray-400">{course.subject}</p>
                <div className="mt-2">
                  <ProgressBar percent={0} />
                </div>
              </div>
              <span className="text-sm text-gray-400 shrink-0">0%</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
