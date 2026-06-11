# Business Academy — Question Generation Prompt

## Purpose
This file is the standard prompt template for generating practice question JSON files for Business Academy. Read this entire file before generating any questions.

## Course Context
- Platform: Business Academy (Khan Academy-style web app for NC State Poole College of Management)
- Audience: NC State business students preparing for exams
- Tone: Professional, exam-realistic, uses real company examples where possible
- Goal: Questions should prepare students to succeed on actual NC State exams

## JSON Schema
Each question file is a JSON array. Every question must match this exact structure:

```json
{
  "question": "string — the full question text",
  "options": ["string", "string", "string", "string"],
  "correctIndex": 0,
  "explanation": "string — explains why correct is correct AND why each wrong answer is wrong",
  "type": "Definition|Calculation|Application|Error-Finding|Comparison|Interpretation",
  "difficulty": "easy|medium|hard"
}
```

## Question Type Definitions
- **Definition** — What does this concept mean? Tests vocabulary and core understanding
- **Calculation** — Given numbers, compute or interpret a result (use for quantitative topics)
- **Application** — Given a business scenario, what would you do or conclude?
- **Error-Finding** — What is wrong with this statement, approach, or scenario?
- **Comparison** — How does X differ from Y? When would you use one vs. the other?
- **Interpretation** — Given this result or situation, what does it mean for the business?

## Difficulty Distribution
Every topic must have exactly 15 questions distributed as:
- 4 Easy — straightforward recall or single-step reasoning
- 4 Medium — requires connecting two concepts or applying to a simple scenario
- 7 Hard — multi-step reasoning, nuanced distinctions, complex scenarios

## Answer Quality Rules
1. **Length parity** — all four options must be within 10-15 words of each other in length. Never make the correct answer the longest option.
2. **correctIndex rotation** — distribute correct answers across all four positions. Do not use correctIndex: 0 more than 3 times per file. Aim for roughly equal distribution across 0, 1, 2, 3.
3. **Plausible distractors** — wrong answers must be genuinely tempting, not obviously wrong. Each distractor should represent a real misconception a student might hold.
4. **No giveaway language** — avoid "always," "never," "all of the above," "none of the above." Avoid making the correct answer sound more authoritative than the distractors.

## Explanation Quality Rules
- Always explain why the correct answer is correct
- Always explain why at least 2 of the wrong answers are wrong (what misconception they represent)
- Keep explanations to 3-5 sentences
- Use the same real-world company examples from the question where possible

## Real Company Examples
Use real, recognizable companies in scenario-based questions. Good defaults by topic:
- IS/Technology: Amazon, Google, Netflix, Apple, Salesforce, Microsoft
- Retail/Supply Chain: Walmart, Zara, Target, Nike
- Finance: Goldman Sachs, JPMorgan, Visa
- Healthcare: Johnson & Johnson, UnitedHealth
- Manufacturing: Toyota, Ford, Boeing

## File Naming Convention
- Folder: `content/questions/[course-slug]/`
- File: `[topic-slug].json` (kebab-case matching the topic slug in course.json)
- Example: `content/questions/bus-340/definition-of-information-systems.json`

## Output Rules
- Output ONLY the raw JSON array — no markdown code fences, no explanation text, no preamble
- The file must be valid JSON that passes JSON.parse() without errors
- Do not add trailing commas
- Do not add comments inside the JSON

## Example Question (use this as the quality benchmark)
```json
{
  "question": "A company's CRM system stores customer data but sales reps refuse to update it, causing unreliable records. Which IS component has failed?",
  "options": [
    "Hardware — the servers storing customer data are underpowered",
    "Networks — the connections transmitting CRM data are unstable",
    "People — the human behavior and adoption element is broken",
    "Software — the CRM application interface is poorly designed"
  ],
  "correctIndex": 2,
  "explanation": "The failure is in the people component — IS success depends on users engaging with the system as intended. Hardware, networks, and software may be functioning perfectly, but an IS humans don't use correctly produces unreliable outputs regardless of technical quality. Option A is wrong because server power doesn't affect whether reps choose to enter data. Option D is a possible contributing factor but doesn't explain deliberate non-adoption.",
  "type": "Error-Finding",
  "difficulty": "medium"
}
```
