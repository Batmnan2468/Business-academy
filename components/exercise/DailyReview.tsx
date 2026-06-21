'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PracticeQuestion from './PracticeQuestion'
import { getDueTopics, onReviewAnswer } from '@/lib/mastery'

interface TopicItem {
  slug: string
  title: string
}

interface Props {
  courseSlug: string
  courseTitle: string
  allTopics: TopicItem[]
}

interface ReviewResult {
  topicSlug: string
  topicTitle: string
  isCorrect: boolean
}

export default function DailyReview({ courseSlug, courseTitle, allTopics }: Props) {
  const [dueTopics, setDueTopics] = useState<TopicItem[] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentAnswerCorrect, setCurrentAnswerCorrect] = useState<boolean | null>(null)
  const [results, setResults] = useState<ReviewResult[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDueTopics(getDueTopics(courseSlug, allTopics))
  }, [courseSlug, allTopics])

  if (dueTopics === null) {
    return <p className="text-gray-400 text-sm">Loading…</p>
  }

  if (dueTopics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mx-auto mb-5">
          ✅
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Nothing to review today
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          All your topics are up to date. Come back tomorrow.
        </p>
        <Link
          href={`/courses/${courseSlug}`}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Back to {courseTitle}
        </Link>
      </div>
    )
  }

  if (done) {
    const correct = results.filter((r) => r.isCorrect).length
    const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0

    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl mx-auto mb-5">
          🔁
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Review complete!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          {correct}/{results.length} correct · {accuracy}% accuracy
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mb-8">
          {results.length} topic{results.length !== 1 ? 's' : ''} reviewed
        </p>

        <div className="text-left max-w-sm mx-auto mb-8 space-y-2">
          {results.map((r) => (
            <div key={r.topicSlug} className="flex items-center gap-3 text-sm">
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                  r.isCorrect
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                }`}
              >
                {r.isCorrect ? '✓' : '✗'}
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">{r.topicTitle}</span>
            </div>
          ))}
        </div>

        <Link
          href={`/courses/${courseSlug}`}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          ← Back to {courseTitle}
        </Link>
      </div>
    )
  }

  const currentTopic = dueTopics[currentIndex]
  const isLastTopic = currentIndex + 1 >= dueTopics.length

  function handleAnswer(isCorrect: boolean) {
    onReviewAnswer(courseSlug, currentTopic.slug, isCorrect)
    setCurrentAnswerCorrect(isCorrect)
  }

  function handleNext() {
    setResults((prev) => [
      ...prev,
      {
        topicSlug: currentTopic.slug,
        topicTitle: currentTopic.title,
        isCorrect: currentAnswerCorrect ?? false,
      },
    ])
    setCurrentAnswerCorrect(null)
    if (isLastTopic) {
      setDone(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  const progressPct = Math.round((currentIndex / dueTopics.length) * 100)

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">
          Topic {currentIndex + 1} of {dueTopics.length}
        </span>
        <Link
          href={`/courses/${courseSlug}`}
          className="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          Exit review
        </Link>
      </div>
      <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {currentTopic.title}
      </h2>
      <p className="text-xs text-gray-400 mb-6">Daily review question</p>

      <PracticeQuestion
        key={currentTopic.slug}
        topicTitle={currentTopic.title}
        topicSlug={currentTopic.slug}
        courseSlug={courseSlug}
        courseTitle={courseTitle}
        onAnswer={handleAnswer}
        nextLabel={isLastTopic ? 'Finish review →' : 'Next topic →'}
        onNext={handleNext}
      />
    </div>
  )
}
