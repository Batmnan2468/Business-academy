import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET — fetch all progress for current user
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    topicStates,
    learnStates,
    masteryRecords,
    unitTestStates,
    checkpoints,
    timedBests,
    savedQuestions,
    profile,
  ] = await Promise.all([
    db.topicState.findMany({ where: { userId } }),
    db.learnState.findMany({ where: { userId } }),
    db.masteryRecord.findMany({ where: { userId } }),
    db.unitTestState.findMany({ where: { userId } }),
    db.checkpointResult.findMany({ where: { userId } }),
    db.timedBest.findMany({ where: { userId } }),
    db.savedQuestion.findMany({ where: { userId } }),
    db.userProfile.findUnique({ where: { id: userId } }),
  ])

  return NextResponse.json({
    topicStates,
    learnStates,
    masteryRecords,
    unitTestStates,
    checkpoints,
    timedBests,
    savedQuestions,
    profile,
  })
}

// POST — upsert a single progress event
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, data } = body as {
    type: string
    data: Record<string, unknown>
  }

  // Ensure user profile exists
  await db.userProfile.upsert({
    where: { id: userId },
    create: { id: userId },
    update: {},
  })

  switch (type) {
    case 'topicState':
      await db.topicState.upsert({
        where: {
          userId_courseSlug_topicSlug: {
            userId,
            courseSlug: data.courseSlug as string,
            topicSlug: data.topicSlug as string,
          },
        },
        create: {
          userId,
          courseSlug: data.courseSlug as string,
          topicSlug: data.topicSlug as string,
          state: data.state as string,
        },
        update: { state: data.state as string },
      })
      break

    case 'learnState':
      await db.learnState.upsert({
        where: {
          userId_courseSlug_topicSlug: {
            userId,
            courseSlug: data.courseSlug as string,
            topicSlug: data.topicSlug as string,
          },
        },
        create: {
          userId,
          courseSlug: data.courseSlug as string,
          topicSlug: data.topicSlug as string,
          state: data.state as string,
          thought: data.thought as string | undefined,
          rating: data.rating as string | undefined,
        },
        update: {
          state: data.state as string,
          thought: data.thought as string | undefined,
          rating: data.rating as string | undefined,
        },
      })
      break

    case 'unitTestState':
      await db.unitTestState.upsert({
        where: {
          userId_courseSlug_unitId: {
            userId,
            courseSlug: data.courseSlug as string,
            unitId: data.unitId as string,
          },
        },
        create: {
          userId,
          courseSlug: data.courseSlug as string,
          unitId: data.unitId as string,
          state: data.state as string,
        },
        update: { state: data.state as string },
      })
      break

    case 'xpEvent':
      await db.xPEvent.create({
        data: {
          userId,
          event: data.event as string,
          amount: data.amount as number,
        },
      })
      await db.userProfile.update({
        where: { id: userId },
        data: {
          totalXP: { increment: data.amount as number },
        },
      })
      break

    case 'profile':
      await db.userProfile.upsert({
        where: { id: userId },
        create: {
          id: userId,
          totalXP: (data.totalXP as number) ?? 0,
          streakCurrent: (data.streakCurrent as number) ?? 0,
          streakLongest: (data.streakLongest as number) ?? 0,
          lastActiveDate: (data.lastActiveDate as string) ?? '',
          dailyGoalTarget: (data.dailyGoalTarget as number) ?? 10,
        },
        update: {
          totalXP: data.totalXP as number,
          streakCurrent: data.streakCurrent as number,
          streakLongest: data.streakLongest as number,
          lastActiveDate: data.lastActiveDate as string,
          dailyGoalTarget: data.dailyGoalTarget as number,
        },
      })
      break

    default:
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
