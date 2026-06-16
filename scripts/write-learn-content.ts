// Usage: npx tsx scripts/write-learn-content.ts <courseSlug> <jsonFile>
// Merges learn content from a JSON array into content/courses/<courseSlug>/course.json.
// Each object in the array must have a `slug` field plus all LearnContentV2 fields.
// Topics are matched by slug across all units. The `slug` field is stripped before writing.

import fs from 'fs'
import path from 'path'

interface LearnContentV2 {
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

interface LearnInput extends LearnContentV2 {
  slug: string
}

interface TopicRaw {
  id: string
  slug: string
  title: string
  learn?: LearnContentV2
}

interface UnitRaw {
  id: string
  title: string
  topics: TopicRaw[]
}

interface CourseRaw {
  id: string
  slug: string
  title: string
  description: string
  subject: string
  level: string
  topics?: TopicRaw[]
  units?: UnitRaw[]
}

const [courseSlug, jsonFile] = process.argv.slice(2)

if (!courseSlug || !jsonFile) {
  console.error('Usage: npx tsx scripts/write-learn-content.ts <courseSlug> <jsonFile>')
  process.exit(1)
}

const courseJsonPath = path.join(process.cwd(), 'content', 'courses', courseSlug, 'course.json')

if (!fs.existsSync(courseJsonPath)) {
  console.error(`course.json not found at: ${courseJsonPath}`)
  process.exit(1)
}

if (!fs.existsSync(jsonFile)) {
  console.error(`Input file not found: ${jsonFile}`)
  process.exit(1)
}

const course = JSON.parse(fs.readFileSync(courseJsonPath, 'utf-8')) as CourseRaw
const inputs = JSON.parse(fs.readFileSync(jsonFile, 'utf-8')) as LearnInput[]

if (!Array.isArray(inputs)) {
  console.error('Input JSON must be an array of learn content objects.')
  process.exit(1)
}

// Build a flat slug → topic map across units and top-level topics
const topicMap = new Map<string, TopicRaw>()

for (const unit of course.units ?? []) {
  for (const topic of unit.topics) {
    topicMap.set(topic.slug, topic)
  }
}
for (const topic of course.topics ?? []) {
  topicMap.set(topic.slug, topic)
}

let updatedCount = 0

for (const input of inputs) {
  const { slug, ...learnContent } = input
  const topic = topicMap.get(slug)
  if (!topic) {
    console.log(`  NOT FOUND: ${slug}`)
    continue
  }
  topic.learn = learnContent
  updatedCount++
  console.log(`  updated:   ${slug}`)
}

fs.writeFileSync(courseJsonPath, JSON.stringify(course, null, 2) + '\n', 'utf-8')
console.log(`\nDone. ${updatedCount} of ${inputs.length} topics updated in ${courseJsonPath}`)
