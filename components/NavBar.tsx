'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTotalSavedCount } from '@/lib/savedQuestions'

export default function NavBar() {
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    function update() {
      setSavedCount(getTotalSavedCount())
    }
    update()
    window.addEventListener('storage', update)
    window.addEventListener('savedQuestionsChanged', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('savedQuestionsChanged', update)
    }
  }, [])

  if (savedCount === 0) return null

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex justify-end">
        <Link
          href="/saved-questions"
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          🚩<span className="hidden sm:inline"> Saved</span>
          <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold leading-none">
            {savedCount}
          </span>
        </Link>
      </div>
    </nav>
  )
}
