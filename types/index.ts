export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Topic {
  id: string
  slug: string
  title: string
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  subject: string
  level: CourseLevel
  topics: Topic[]
}

export interface UserProgress {
  userId: string
  courseId: string
  completedTopicIds: string[]
  lastAccessedAt: string
  percentComplete: number
}
