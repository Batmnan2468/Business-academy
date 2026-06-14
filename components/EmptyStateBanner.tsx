'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  allTopicData: Array<{ courseSlug: string; topicSlugs: string[] }>
}

export default function EmptyStateBanner({ allTopicData }: Props) {
  const [hasProgress, setHasProgress] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      let found = false
      outer: for (const { courseSlug, topicSlugs } of allTopicData) {
        for (const slug of topicSlugs) {
          const state = localStorage.getItem(`topicState_${courseSlug}_${slug}`)
          if (state && state !== 'untouched') {
            found = true
            break outer
          }
        }
      }
      setHasProgress(found)
    } catch {
      setHasProgress(true)
    }
  }, [allTopicData])

  if (hasProgress !== false) return null

  return (
    <div className="mb-10 flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
      <span className="text-xl">👋</span>
      <p className="text-sm text-blue-800">
        New here? Start with{' '}
        <Link
          href="/courses/accounting-101"
          className="font-semibold underline underline-offset-2 hover:text-blue-600"
        >
          ACC 210
        </Link>{' '}
        — it&apos;s the foundation for everything else.
      </p>
    </div>
  )
}
