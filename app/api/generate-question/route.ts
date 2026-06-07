import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const QUESTION_TYPES = [
  {
    type: 'Definition',
    instruction:
      'Ask the student to identify or explain what a concept means. Test precise understanding of terminology.',
  },
  {
    type: 'Calculation',
    instruction:
      'Give the student a set of specific numbers and ask them to compute or interpret a result. All numbers must be realistic and the math must be unambiguous.',
  },
  {
    type: 'Application',
    instruction:
      'Present a realistic business scenario and ask what the student would do or conclude. The scenario should feel like a real decision a professional would face.',
  },
  {
    type: 'Error-Finding',
    instruction:
      'State something that is wrong — a misconception, incorrect procedure, or flawed reasoning — and ask the student to identify the error or what is incorrect about it.',
  },
  {
    type: 'Comparison',
    instruction:
      'Ask how two related concepts differ from each other. Both concepts should be plausibly confusable.',
  },
  {
    type: 'Interpretation',
    instruction:
      'Give the student a specific result (a ratio, a number, a chart reading, a test statistic) and ask what it means for a business decision.',
  },
]

const DIFFICULTIES = ['easy', 'medium', 'hard']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[generate-question] ANTHROPIC_API_KEY is not set in .env.local')
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let topic: string
  let body: { topic: string; difficulty?: string }
  try {
    body = await req.json()
    topic = body.topic
    console.log('[generate-question] request received, topic:', topic)
  } catch (err) {
    console.error('[generate-question] failed to parse request body:', err)
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const questionType = pick(QUESTION_TYPES)
  const difficulty = DIFFICULTIES.includes(body.difficulty ?? '') ? body.difficulty! : 'medium'

  console.log(`[generate-question] type: ${questionType.type}, difficulty: ${difficulty}`)

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      temperature: 1,
      system: `You are an expert business professor writing exam questions for university students.
Your questions always use realistic business contexts with specific numbers — never abstract placeholders like "Company X" or "some amount." Use real company names, realistic dollar figures, specific percentages, and named industries.
Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Generate one multiple-choice question about "${topic}".

Question type: ${questionType.type}
Type instruction: ${questionType.instruction}
Difficulty: ${difficulty}

Difficulty guidance:
- easy: tests direct recall or a single straightforward step; appropriate for a student seeing this concept for the first time
- medium: requires applying the concept to a scenario or doing a two-step calculation; appropriate for a student who understands the basics
- hard: involves a nuance, a common misconception, or a multi-step problem where a wrong turn leads to a plausible distractor; appropriate for exam preparation

Requirements:
- Use a realistic business context with specific numbers (dollar amounts, percentages, ratios, time periods)
- The three wrong options should be plausible — common mistakes or related but incorrect ideas
- The explanation should say why the correct answer is right AND why the most tempting wrong answer is wrong

Respond with this exact JSON shape and nothing else:
{
  "question": "the question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "explanation": "brief explanation of the correct answer"
}`,
        },
      ],
    })

    const rawText = message.content.find((b) => b.type === 'text')?.text ?? ''
    console.log('[generate-question] raw API response:', rawText)

    // Strip markdown code fences if the model adds them despite instructions
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('[generate-question] JSON parse failed. cleaned text:', cleaned, 'error:', parseErr)
      return Response.json(
        { error: 'Model returned non-JSON response', raw: rawText },
        { status: 500 },
      )
    }

    console.log('[generate-question] success, returning question:', parsed.question)
    return Response.json(parsed)
  } catch (err) {
    console.error('[generate-question] Anthropic API call failed:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
