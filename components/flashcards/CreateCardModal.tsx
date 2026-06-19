'use client'

import { useState, useEffect, useRef } from 'react'
import { saveCustomCard } from '@/lib/flashcards'
import type { CustomCard } from '@/lib/flashcards'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCardModal({ isOpen, onClose }: Props) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [tags, setTags] = useState('')
  const [savedMsg, setSavedMsg] = useState(false)
  const frontRef = useRef<HTMLTextAreaElement>(null)

  // Focus front field when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => frontRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  function handleClose() {
    setFront('')
    setBack('')
    setTags('')
    setSavedMsg(false)
    onClose()
  }

  function handleSave() {
    if (!front.trim() || !back.trim()) return

    const card: CustomCard = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      front: front.trim(),
      back: back.trim(),
      createdAt: new Date().toISOString(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    saveCustomCard(card)
    setSavedMsg(true)

    setFront('')
    setBack('')
    setTags('')

    setTimeout(() => {
      setSavedMsg(false)
      handleClose()
    }, 900)
  }

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      {/* Panel slides up from bottom */}
      <div className="w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">New Flashcard</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Front (question or term)
            </label>
            <textarea
              ref={frontRef}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="What do you want to remember?"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Back (answer or definition)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="The answer, definition, or explanation"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Tags (optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. accounting, chapter-3"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {savedMsg ? (
            <div className="w-full py-2.5 px-4 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-medium text-sm text-center">
              Card saved! ✓
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!front.trim() || !back.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
            >
              Save Card
            </button>
          )}
          <button
            onClick={handleClose}
            className="w-full py-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
