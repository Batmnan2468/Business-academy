interface Props {
  percent: number
}

export default function ProgressBar({ percent }: Props) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-blue-500 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
