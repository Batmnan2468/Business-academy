import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics } from '@/lib/courses'
import LearnAndPractice from '@/components/exercise/LearnAndPractice'

interface Props {
  params: Promise<{ courseSlug: string; topicSlug: string }>
}

export default async function PracticePage({ params }: Props) {
  const { courseSlug, topicSlug } = await params
  const course = getCourse(courseSlug)
  if (!course) notFound()

  const allTopics = getAllTopics(course)
  const currentIndex = allTopics.findIndex((t) => t.slug === topicSlug)
  if (currentIndex === -1) notFound()

  const topic = allTopics[currentIndex]
  const nextTopic =
    currentIndex < allTopics.length - 1
      ? { slug: allTopics[currentIndex + 1].slug, title: allTopics[currentIndex + 1].title }
      : null

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm text-blue-500 hover:underline mb-8 inline-block"
      >
        ← {course.title}
      </Link>

      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
        {course.subject}
      </div>
      <h1 className="text-2xl font-bold mb-1">{topic.title}</h1>
      <p className="text-sm text-gray-400 mb-10">Practice question</p>

      <LearnAndPractice
        topicTitle={topic.title}
        learn={topic.learn}
        courseSlug={courseSlug}
        nextTopic={nextTopic}
      />
    </main>
  )
}
