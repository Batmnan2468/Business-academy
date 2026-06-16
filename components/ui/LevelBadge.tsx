'use client'

import { useState, useEffect } from 'react'
import { getLevelInfo, LEVELS } from '@/lib/xp'

export default function LevelBadge() {
  const [info, setInfo] = useState<ReturnType<typeof getLevelInfo> | null>(null)

  useEffect(() => {
    setInfo(getLevelInfo())
  }, [])

  if (!info) return null

  const levelIdx = info.level - 1
  const nextTitle =
    levelIdx < LEVELS.length - 1
      ? (LEVELS as readonly { min: number; title: string }[])[levelIdx + 1]?.title
      : null
  const xpToNext = info.nextLevelXP !== null ? info.nextLevelXP - info.currentXP : null

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{info.title}</p>
      <p className="text-xs text-gray-400 mb-2">{info.currentXP} XP total</p>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${info.progressPct}%` }}
        />
      </div>
      {xpToNext !== null && nextTitle ? (
        <p className="text-xs text-gray-400">{xpToNext} XP to {nextTitle}</p>
      ) : (
        <p className="text-xs text-gray-400">Max level reached</p>
      )}
    </div>
  )
}
