import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[generate-question] ANTHROPIC_API_KEY is not set in .env.local')
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let topic: string
  try {
    const body = await req.json()
    topic = body.topic
    console.log('[generate-question] request received, topic:', topic)
  } catch (err) {
    console.error('[generate-question] failed to parse request body:', err)
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      temperature: 1,
      system: `You are a professor for NC State ACC 210 (Introduction to Accounting).
Generate a multiple-choice question specifically about "${topic}" for NC State ACC 210.
Each question you generate should be different — vary the specific concept tested, the difficulty angle, and the phrasing so students see a wide range of questions on this topic.
Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Generate one introductory-level multiple-choice question specifically about "${topic}".

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
