export interface ReportedQuestion {
  questionText: string
  topicSlug: string
  topicName: string
  courseSlug: string
  reportedAt: string
  options: string[]
  correctIndex: number
  explanation: string
  type?: string
}

function getKey(courseSlug: string): string {
  return `reportedQuestions_${courseSlug}`
}

export function getReportedQuestionsForCourse(courseSlug: string): ReportedQuestion[] {
  try {
    const raw = localStorage.getItem(getKey(courseSlug))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setReportedQuestionsForCourse(courseSlug: string, questions: ReportedQuestion[]): void {
  try {
    localStorage.setItem(getKey(courseSlug), JSON.stringify(questions))
  } catch {
    // localStorage unavailable (Safari private browsing)
  }
}

export function isQuestionReported(courseSlug: string, questionText: string): boolean {
  return getReportedQuestionsForCourse(courseSlug).some((q) => q.questionText === questionText)
}

export function reportQuestion(q: ReportedQuestion): void {
  const existing = getReportedQuestionsForCourse(q.courseSlug)
  if (!existing.some((e) => e.questionText === q.questionText)) {
    setReportedQuestionsForCourse(q.courseSlug, [...existing, q])
  }
}

export function getAllReportedGroups(): Array<{ courseSlug: string; questions: ReportedQuestion[] }> {
  try {
    const result: Array<{ courseSlug: string; questions: ReportedQuestion[] }> = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reportedQuestions_')) {
        const courseSlug = key.slice('reportedQuestions_'.length)
        const questions = getReportedQuestionsForCourse(courseSlug)
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

export function getTotalReportedCount(): number {
  try {
    let total = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('reportedQuestions_')) {
        const courseSlug = key.slice('reportedQuestions_'.length)
        total += getReportedQuestionsForCourse(courseSlug).length
      }
    }
    return total
  } catch {
    return 0
  }
}
