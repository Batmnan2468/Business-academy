export interface ProgressBackup {
  version: 1
  exportedAt: string
  entries: Record<string, string>
}

const KEY_PATTERNS = [
  /^topicState_/,
  /^learnState_/,
  /^learnThought_/,
  /^learnRating_/,
  /^checkpointResult_/,
  /^unitTestState_/,
  /^savedQuestions_/,
  /^mastery:/,
  /^completed:/,
  /^mistakes:/,
  /^examDates$/,
  /^lastLearnVisit$/,
  /^lastPracticeVisit$/,
]

function matchesPattern(key: string): boolean {
  return KEY_PATTERNS.some((re) => re.test(key))
}

export function exportProgress(): ProgressBackup {
  const entries: Record<string, string> = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !matchesPattern(key)) continue
      const value = localStorage.getItem(key)
      if (value !== null) entries[key] = value
    }
  } catch {
    // Safari private browsing or quota issues
  }
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
  }
}

export function importProgress(backup: ProgressBackup): void {
  if (backup.version !== 1) {
    throw new Error(`Unsupported backup version: ${backup.version}`)
  }
  try {
    for (const [key, value] of Object.entries(backup.entries)) {
      localStorage.setItem(key, value)
    }
    window.dispatchEvent(new Event('storage'))
  } catch {
    throw new Error('Failed to write to localStorage. Check storage permissions.')
  }
}

export function downloadProgressFile(backup: ProgressBackup): void {
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date(backup.exportedAt).toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `business-academy-progress-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseProgressFile(file: File): Promise<ProgressBackup> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(reader.result as string)
        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          (parsed as Record<string, unknown>).version !== 1 ||
          typeof (parsed as Record<string, unknown>).exportedAt !== 'string' ||
          typeof (parsed as Record<string, unknown>).entries !== 'object'
        ) {
          reject(new Error('Invalid backup file format.'))
          return
        }
        resolve(parsed as ProgressBackup)
      } catch {
        reject(new Error('Could not parse file. Make sure it is a valid JSON backup.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
