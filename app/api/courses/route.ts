import { getCourses } from '@/lib/courses'

export async function GET() {
  const courses = getCourses()
  return Response.json(courses)
}
