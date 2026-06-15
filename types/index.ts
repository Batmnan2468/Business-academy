export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export interface LearnContent {
  explanation: string
  example: string
  keyPoints: string[]
}

export interface LearnContentV2 {
  openingQuestion: string
  anchor: string
  anchorSummary: string
  mechanism: string
  mechanismSummary: string
  boundaryConditions: string
  example: string
  bridgeToAbstract: string
  keyPoints: string[]
}

export function isLearnContentV2(c: LearnContent | LearnContentV2): c is LearnContentV2 {
  return 'openingQuestion' in c
}

export interface Topic {
  id: string
  slug: string
  title: string
  learn?: LearnContent | LearnContentV2
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

export interface UnitTestQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topicSlug: string
  topicTitle: string
}

export interface PracticeQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type: string
  difficulty: string
}
