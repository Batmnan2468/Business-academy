export interface SavedQuestion {
  topicSlug: string
  topicTitle: string
  courseSlug: string
  courseTitle: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  type: string
  difficulty: string
  savedAt: string
}

function getKey(courseSlug: string): string {
  return `savedQuestions_${courseSlug}`
}

export function getSavedQuestionsForCourse(courseSlug: string): SavedQuestion[] {
  try {
    const raw = localStorage.getItem(getKey(courseSlug))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setSavedQuestionsForCourse(courseSlug: string, questions: SavedQuestion[]): void {
  try {
    localStorage.setItem(getKey(courseSlug), JSON.stringify(questions))
  } catch {
    // localStorage unavailable (Safari private browsing)
  }
}

function dispatchChange(): void {
  try {
    window.dispatchEvent(new Event('savedQuestionsChanged'))
  } catch {
    // not in browser
  }
}

export function isQuestionSaved(courseSlug: string, questionText: string): boolean {
  return getSavedQuestionsForCourse(courseSlug).some((q) => q.question === questionText)
}

export function saveQuestion(q: SavedQuestion): void {
  const existing = getSavedQuestionsForCourse(q.courseSlug)
  if (!existing.some((e) => e.question === q.question)) {
    setSavedQuestionsForCourse(q.courseSlug, [...existing, q])
    dispatchChange()
  }
}

export function removeQuestion(courseSlug: string, questionText: string): void {
  const existing = getSavedQuestionsForCourse(courseSlug)
  setSavedQuestionsForCourse(courseSlug, existing.filter((q) => q.question !== questionText))
  dispatchChange()
}

export function getAllSavedGroups(): Array<{ courseSlug: string; questions: SavedQuestion[] }> {
  try {
    const result: Array<{ courseSlug: string; questions: SavedQuestion[] }> = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('savedQuestions_')) {
        const courseSlug = key.slice('savedQuestions_'.length)
        const questions = getSavedQuestionsForCourse(courseSlug)
        if (questions.length > 0) {
          result.push({ courseSlug, questions })
        }
      }
    }
    return result
  } catch {
    return []
  }
}

export function getTotalSavedCount(): number {
  try {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('savedQuestions_')) {
        const courseSlug = key.slice('savedQuestions_'.length)
        total += getSavedQuestionsForCourse(courseSlug).length
      }
    }
    return total
  } catch {
    return 0
  }
}

export function getSavedCountForCourse(courseSlug: string): number {
  return getSavedQuestionsForCourse(courseSlug).length
}
