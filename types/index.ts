export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface LearnContent {
  explanation: string
  example: string
  keyPoints: string[]
}

export interface Topic {
  id: string
  slug: string
  title: string
  learn?: LearnContent
}

export interface Unit {
  id: string
  title: string
  topics: Topic[]
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  subject: string
  level: CourseLevel
  topics?: Topic[]
  units?: Unit[]
}

export interface UserProgress {
  userId: string
  courseId: string
  completedTopicIds: string[]
  lastAccessedAt: string
  percentComplete: number
}
