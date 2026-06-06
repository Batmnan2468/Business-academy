import type { Course } from '@/types'

interface Props {
  course: Course
}

const levelColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export default function CourseCard({ course }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {course.subject}
        </span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${levelColors[course.level] ?? ''}`}
        >
          {course.level}
        </span>
      </div>
      <h3 className="font-semibold text-base leading-snug mb-1">{course.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 flex-1">{course.description}</p>
      <p className="mt-4 text-xs text-gray-400">{course.topics.length} topics</p>
    </div>
  )
}
