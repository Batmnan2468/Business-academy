interface MistakeEntry {
  topicSlug: string
  questionType: string
  difficulty: string
  isCorrect: boolean
  timestamp: number
}

interface TypeStats {
  type: string
  accuracy: number
  count: number
}

interface TopicStats {
  slug: string
  accuracy: number
  count: number
}

const MAX_ENTRIES = 500

export function recordAnswer(
  courseSlug: string,
  topicSlug: string,
  questionType: string,
  difficulty: string,
  isCorrect: boolean,
): void {
  if (typeof window === 'undefined') return
  try {
    const key = `mistakes:${courseSlug}`
    const existing: MistakeEntry[] = JSON.parse(localStorage.getItem(key) ?? '[]')
    const entry: MistakeEntry = { topicSlug, questionType, difficulty, isCorrect, timestamp: Date.now() }
    const updated = [...existing, entry]
    if (updated.length > MAX_ENTRIES) updated.splice(0, updated.length - MAX_ENTRIES)
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {
    // localStorage unavailable
  }
}

export function getMistakeStats(courseSlug: string): {
  weakestTypes: TypeStats[]
  weakestTopics: TopicStats[]
} {
  if (typeof window === 'undefined') return { weakestTypes: [], weakestTopics: [] }
  try {
    const key = `mistakes:${courseSlug}`
    const entries: MistakeEntry[] = JSON.parse(localStorage.getItem(key) ?? '[]')

    const typeMap: Record<string, { correct: number; total: number }> = {}
    const topicMap: Record<string, { correct: number; total: number }> = {}

    for (const entry of entries) {
      if (entry.questionType) {
        typeMap[entry.questionType] ??= { correct: 0, total: 0 }
        typeMap[entry.questionType].total++
        if (entry.isCorrect) typeMap[entry.questionType].correct++
      }
      topicMap[entry.topicSlug] ??= { correct: 0, total: 0 }
      topicMap[entry.topicSlug].total++
      if (entry.isCorrect) topicMap[entry.topicSlug].correct++
    }

    const weakestTypes = Object.entries(typeMap)
      .filter(([, s]) => s.total >= 3)
      .map(([type, s]) => ({ type, accuracy: Math.round((s.correct / s.total) * 100), count: s.total }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)

    const weakestTopics = Object.entries(topicMap)
      .filter(([, s]) => s.total >= 3)
      .map(([slug, s]) => ({ slug, accuracy: Math.round((s.correct / s.total) * 100), count: s.total }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3)

    return { weakestTypes, weakestTopics }
  } catch {
    return { weakestTypes: [], weakestTopics: [] }
  }
}

export function getAggregatedMistakeStats(courseSlugs: string[]): {
  weakestTypes: TypeStats[]
} {
  if (typeof window === 'undefined') return { weakestTypes: [] }
  const typeMap: Record<string, { correct: number; total: number }> = {}

  for (const courseSlug of courseSlugs) {
    try {
      const key = `mistakes:${courseSlug}`
      const entries: MistakeEntry[] = JSON.parse(localStorage.getItem(key) ?? '[]')
      for (const entry of entries) {
        if (entry.questionType) {
          typeMap[entry.questionType] ??= { correct: 0, total: 0 }
          typeMap[entry.questionType].total++
          if (entry.isCorrect) typeMap[entry.questionType].correct++
        }
      }
    } catch {
      // localStorage unavailable
    }
  }

  const weakestTypes = Object.entries(typeMap)
    .filter(([, s]) => s.total >= 5)
    .map(([type, s]) => ({ type, accuracy: Math.round((s.correct / s.total) * 100), count: s.total }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)

  return { weakestTypes }
}
