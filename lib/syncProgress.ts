import type { TopicMastery } from './mastery'

interface ApiTopicState {
  courseSlug: string
  topicSlug: string
  state: string
}

interface ApiLearnState {
  courseSlug: string
  topicSlug: string
  state: string
  thought: string | null
  rating: string | null
}

interface ApiMasteryRecord {
  courseSlug: string
  topicSlug: string
  masteryLevel: number
  nextReviewDate: string
  lastReviewedDate: string
  permanentlyMastered: boolean
  easeFactor: number
  intervalDays: number
}

interface ApiUnitTestState {
  courseSlug: string
  unitId: string
  state: string
}

interface ApiCheckpointResult {
  courseSlug: string
  topicSlug: string
  score: number
  total: number
  completedAt: string
}

interface ApiUserProfile {
  totalXP: number
  streakCurrent: number
  streakLongest: number
  lastActiveDate: string
  dailyGoalTarget: number
}

interface ProgressApiResponse {
  topicStates: ApiTopicState[]
  learnStates: ApiLearnState[]
  masteryRecords: ApiMasteryRecord[]
  unitTestStates: ApiUnitTestState[]
  checkpoints: ApiCheckpointResult[]
  profile: ApiUserProfile | null
}

// Fire-and-forget sync to /api/progress. Never awaited; never blocks the UI.
export function syncToDatabase(type: string, data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    void fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    })
  } catch {
    // offline or API unavailable — localStorage still has the data
  }
}

// Call once on mount when the user is authenticated.
// Overwrites localStorage with the authoritative database values.
export async function hydrateFromDatabase(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const res = await fetch('/api/progress')
    if (!res.ok) return
    const data = (await res.json()) as ProgressApiResponse

    for (const r of data.topicStates) {
      localStorage.setItem(`topicState_${r.courseSlug}_${r.topicSlug}`, r.state)
    }

    for (const r of data.learnStates) {
      localStorage.setItem(`learnState_${r.courseSlug}_${r.topicSlug}`, r.state)
      if (r.thought) localStorage.setItem(`learnThought_${r.courseSlug}_${r.topicSlug}`, r.thought)
      if (r.rating) localStorage.setItem(`learnRating_${r.courseSlug}_${r.topicSlug}`, r.rating)
    }

    for (const r of data.masteryRecords) {
      const mastery: TopicMastery = {
        interval: r.intervalDays,
        easeFactor: r.easeFactor,
        nextReviewDate: r.nextReviewDate,
        masteryLevel: r.masteryLevel,
        lastReviewedDate: r.lastReviewedDate,
        permanentlyMastered: r.permanentlyMastered,
      }
      localStorage.setItem(`mastery:${r.courseSlug}:${r.topicSlug}`, JSON.stringify(mastery))
    }

    for (const r of data.unitTestStates) {
      localStorage.setItem(`unitTestState_${r.courseSlug}_${r.unitId}`, r.state)
    }

    for (const r of data.checkpoints) {
      localStorage.setItem(
        `checkpointResult_${r.courseSlug}_${r.topicSlug}`,
        JSON.stringify({ score: r.score, total: r.total, completedAt: r.completedAt }),
      )
    }

    if (data.profile) {
      localStorage.setItem('xp:total', JSON.stringify(data.profile.totalXP))
      localStorage.setItem(
        'xp:streak',
        JSON.stringify({
          current: data.profile.streakCurrent,
          longest: data.profile.streakLongest,
          lastActiveDate: data.profile.lastActiveDate,
        }),
      )
      // Preserve today's in-session count; only sync the target from the DB
      try {
        const raw = localStorage.getItem('xp:dailyGoal')
        const existing = raw
          ? (JSON.parse(raw) as { target: number; todayCount: number; lastResetDate: string })
          : { target: 10, todayCount: 0, lastResetDate: '' }
        localStorage.setItem(
          'xp:dailyGoal',
          JSON.stringify({
            target: data.profile.dailyGoalTarget,
            todayCount: existing.todayCount,
            lastResetDate: existing.lastResetDate,
          }),
        )
      } catch {
        localStorage.setItem(
          'xp:dailyGoal',
          JSON.stringify({ target: data.profile.dailyGoalTarget, todayCount: 0, lastResetDate: '' }),
        )
      }
    }

    // One-time migration: if the DB is empty but localStorage has pre-auth progress data
    const isNewUser =
      data.topicStates.length === 0 &&
      data.learnStates.length === 0 &&
      data.unitTestStates.length === 0 &&
      data.profile === null

    if (isNewUser && localStorage.getItem('progressMigrated') !== 'true') {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k) keys.push(k)
      }
      if (keys.some((k) => k.startsWith('topicState_'))) {
        await uploadLocalProgressToDatabase(keys)
      }
    }
  } catch {
    // API unavailable — silently continue using localStorage
  }
}

async function uploadLocalProgressToDatabase(keys: string[]): Promise<void> {
  const posts: Promise<Response>[] = []

  for (const key of keys) {
    if (key.startsWith('topicState_')) {
      const rest = key.slice('topicState_'.length)
      const idx = rest.indexOf('_')
      if (idx === -1) continue
      const courseSlug = rest.slice(0, idx)
      const topicSlug = rest.slice(idx + 1)
      const state = localStorage.getItem(key)
      if (!state) continue
      posts.push(
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'topicState', data: { courseSlug, topicSlug, state } }),
        }),
      )
    } else if (key.startsWith('learnState_')) {
      const rest = key.slice('learnState_'.length)
      const idx = rest.indexOf('_')
      if (idx === -1) continue
      const courseSlug = rest.slice(0, idx)
      const topicSlug = rest.slice(idx + 1)
      const state = localStorage.getItem(key)
      if (!state) continue
      const thought = localStorage.getItem(`learnThought_${courseSlug}_${topicSlug}`) ?? undefined
      const rating = localStorage.getItem(`learnRating_${courseSlug}_${topicSlug}`) ?? undefined
      posts.push(
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'learnState', data: { courseSlug, topicSlug, state, thought, rating } }),
        }),
      )
    } else if (key.startsWith('unitTestState_')) {
      const rest = key.slice('unitTestState_'.length)
      const idx = rest.indexOf('_')
      if (idx === -1) continue
      const courseSlug = rest.slice(0, idx)
      const unitId = rest.slice(idx + 1)
      const state = localStorage.getItem(key)
      if (!state) continue
      posts.push(
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'unitTestState', data: { courseSlug, unitId, state } }),
        }),
      )
    }
  }

  try {
    const totalXP = JSON.parse(localStorage.getItem('xp:total') ?? '0') as number
    const streakRaw = localStorage.getItem('xp:streak')
    const streak = streakRaw
      ? (JSON.parse(streakRaw) as { current: number; longest: number; lastActiveDate: string })
      : { current: 0, longest: 0, lastActiveDate: '' }
    const goalRaw = localStorage.getItem('xp:dailyGoal')
    const goal = goalRaw ? (JSON.parse(goalRaw) as { target: number }) : { target: 10 }
    posts.push(
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'profile',
          data: {
            totalXP,
            streakCurrent: streak.current,
            streakLongest: streak.longest,
            lastActiveDate: streak.lastActiveDate,
            dailyGoalTarget: goal.target,
          },
        }),
      }),
    )
  } catch {
    // couldn't read profile data from localStorage
  }

  await Promise.all(posts)
  localStorage.setItem('progressMigrated', 'true')
}
