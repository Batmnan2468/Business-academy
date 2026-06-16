'use client'

interface Props {
  xp: number
  label: string
  visible: boolean
}

export default function XPToast({ xp, label, visible }: Props) {
  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 dark:bg-gray-950 shadow-lg text-white text-sm font-medium select-none transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span>⭐</span>
      <span>+{xp} XP</span>
      {label && <span className="text-gray-400 text-xs">{label}</span>}
    </div>
  )
}
