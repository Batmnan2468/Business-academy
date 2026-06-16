'use client'

interface Props {
  todayCount: number
  target: number
  size?: number
}

export default function DailyGoalRing({ todayCount, target, size = 80 }: Props) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = target > 0 ? Math.min(1, todayCount / target) : 0
  const offset = circumference * (1 - pct)
  const goalMet = todayCount >= target
  const activeColor = goalMet ? '#22c55e' : '#3b82f6'
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        {/* Progress arc — rotated to start at 12 o'clock */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Center label */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12"
          fontWeight="700"
          className={goalMet ? 'fill-green-500' : 'fill-gray-900 dark:fill-gray-100'}
        >
          {todayCount}/{target}
        </text>
      </svg>
      <span className="text-xs text-gray-400">Daily Goal</span>
    </div>
  )
}
