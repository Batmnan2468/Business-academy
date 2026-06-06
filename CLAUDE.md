@AGENTS.md

# Business Academy

This is a Khan Academy-style web app for NC State business courses.

## Stack
- Next.js, TypeScript, Tailwind CSS, Anthropic API

## Rules

- Questions are AI-generated via the Claude API on the server side.
- Never use a database until asked.
- Never add video content.
- Always keep API keys in `.env.local` and call them only from server-side API routes.
- New courses are added as JSON files in `content/courses/` only.
