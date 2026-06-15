import { getCourses, getAllTopics } from '@/lib/courses'
import DashboardClient, { type CourseData } from '@/components/dashboard/DashboardClient'

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

  return <DashboardClient courses={courseData} />
}
