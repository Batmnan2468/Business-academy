'use client'

import { useState } from 'react'
import { saveCustomCard } from '@/lib/flashcards'

export interface SaveAsFlashcardButtonProps {
  defaultFront: string
  defaultBack: string
  onSaved?: () => void
}

export default function SaveAsFlashcardButton({
  defaultFront,
  defaultBack,
  onSaved,
}: SaveAsFlashcardButtonProps) {
  const [expanded, setExpanded] = useState(false)
  const [front, setFront] = useState(defaultFront)
  const [back, setBack] = useState(defaultBack)
  const [saved, setSaved] = useState(false)

  function handleExpand() {
    setFront(defaultFront)
    setBack(defaultBack)
    setExpanded(true)
  }

  function handleSave() {
    if (!front.trim() || !back.trim()) return
    saveCustomCard({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      front: front.trim(),
      back: back.trim(),
      createdAt: new Date().toISOString(),
      tags: [],
    })
    setSaved(true)
    setExpanded(false)
    onSaved?.()
    setTimeout(() => setSaved(false), 2000)
  }

  if (saved) {
    return (
      <p className="text-xs font-medium text-green-600 dark:text-green-400">
        ✓ Saved to flashcards
      </p>
    )
  }

  if (!expanded) {
    return (
      <button
        onClick={handleExpand}
        className="text-xs font-medium text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
      >
        🃏 Save as flashcard
      </button>
    )
  }

  return (
    <div className="space-y-2 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/40 dark:bg-purple-950/20 px-4 py-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Front (question)
        </label>
        <textarea
          value={front}
          onChange={(e) => setFront(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Back (answer)
        </label>
        <textarea
          value={back}
          onChange={(e) => setBack(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!front.trim() || !back.trim()}
          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
        >
          Save Card
        </button>
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
