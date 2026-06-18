'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { getTotalSavedCount } from '@/lib/savedQuestions'

export default function NavBar() {
  const [savedCount, setSavedCount] = useState(0)
  const pathname = usePathname()

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

  function navClass(href: string) {
    const active = pathname === href || pathname.startsWith(href + '/')
    return active
      ? 'text-sm font-medium text-blue-500'
      : 'text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
  }

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
        >
          Business Academy
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/dashboard" className={navClass('/dashboard')}>
            Dashboard
          </Link>
          <Link
            href="/saved-questions"
            className={`${navClass('/saved-questions')} flex items-center gap-1.5`}
          >
            <span className="hidden sm:inline">Saved</span>
            <span className="sm:hidden">🚩</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold leading-none">
                {savedCount}
              </span>
            )}
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
