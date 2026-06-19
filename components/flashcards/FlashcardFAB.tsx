'use client'

import { useState, useEffect } from 'react'
import CreateCardModal from './CreateCardModal'

// Floating Action Button that lives in app/layout.tsx.
// Also listens for the 'openFlashcardCreate' custom event so any component
// on any page can trigger the modal without prop drilling.
export default function FlashcardFAB() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onEvent() { setOpen(true) }
    window.addEventListener('openFlashcardCreate', onEvent)
    return () => window.removeEventListener('openFlashcardCreate', onEvent)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Create flashcard"
        aria-label="Create flashcard"
        className="fixed bottom-20 right-4 z-40 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg flex items-center justify-center text-white text-lg transition-colors"
      >
        🃏
      </button>

      <CreateCardModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
