import { getCourses, getAllTopics } from '@/lib/courses'
import DashboardClient, { type CourseData } from '@/components/dashboard/DashboardClient'
import ExamCountdown from '@/components/ExamCountdown'

export default function DashboardPage() {
  const courses = getCourses()

  const courseData: CourseData[] = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    subject: c.subject,
    level: c.level,
    topics: getAllTopics(c).map((t) => ({
      slug: t.slug,
      title: t.title,
      hasLearnContent: !!t.learn,
    })),
  }))

  const courseOptions = courses.map((c) => ({
    slug: c.slug,
    abbr: c.slug.split('-').map((p) => p.toUpperCase()).join(' '),
  }))

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12 pb-2">
        <ExamCountdown courses={courseOptions} />
      </div>
      <DashboardClient courses={courseData} />
    </>
  )
}
