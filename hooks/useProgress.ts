'use client'

import { useEffect, useState } from 'react'
import type { UserProgress } from '@/types'

export function useProgress(userId: string, courseId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !courseId) return
    fetch(`/api/progress?userId=${userId}&courseId=${courseId}`)
      .then((r) => r.json())
      .then((data) => {
        const completedLessonIds: string[] = data
          .filter((r: { completedAt: string | null }) => r.completedAt)
          .map((r: { lessonId: string }) => r.lessonId)
        setProgress({
          userId,
          courseId,
          completedTopicIds: completedLessonIds,
          lastAccessedAt: new Date().toISOString(),
          percentComplete: 0,
        })
      })
      .finally(() => setLoading(false))
  }, [userId, courseId])

  async function markComplete(topicId: string, score?: number) {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, lessonId: topicId, courseId, score }),
    })
    setProgress((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        completedTopicIds: [...new Set([...prev.completedTopicIds, topicId])],
      }
    })
  }

  return { progress, loading, markComplete }
}
