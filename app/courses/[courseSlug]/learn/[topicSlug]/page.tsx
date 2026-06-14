import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCourse, getAllTopics } from '@/lib/courses'
import { isLearnContentV2 } from '@/types'
import LearnTopicContent, { LearnTopicContentLegacy } from '@/components/learn/LearnTopicContent'

interface Props {
  params: Promise<{ courseSlug: string; topicSlug: string }>
}

export default async function LearnTopicPage({ params }: Props) {
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
        href={`/courses/${courseSlug}/learn`}
        className="text-sm text-blue-500 hover:underline mb-8 inline-block"
      >
        ← Learn Mode
      </Link>

      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
        {course.subject}
      </div>
      <h1 className="text-2xl font-bold mb-1">{topic.title}</h1>
      <p className="text-sm text-gray-400 mb-10">📖 Read and reflect</p>

      {topic.learn ? (
        isLearnContentV2(topic.learn) ? (
          <LearnTopicContent
            courseSlug={courseSlug}
            topicSlug={topicSlug}
            learnV2={topic.learn}
            nextTopic={nextTopic}
          />
        ) : (
          <LearnTopicContentLegacy
            courseSlug={courseSlug}
            topicSlug={topicSlug}
            learnLegacy={topic.learn}
            nextTopic={nextTopic}
          />
        )
      ) : (
        <div className="text-gray-400 dark:text-gray-500 text-sm">
          No learn content available for this topic yet.
        </div>
      )}
    </main>
  )
}
