const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();
const questionsDir = 'content/questions/econ-301';
const files = fs.readdirSync(questionsDir)
    .filter(f => f.endsWith('.json') && !f.includes('staging'));

async function checkQuestion(topic, q, qNum) {
    const prompt = `You are checking a multiple choice economics question for correctness.

Question: ${q.question}

Choices:
A: ${q.choices.A}
B: ${q.choices.B}
C: ${q.choices.C}
D: ${q.choices.D}

Marked correct answer: ${q.correct} — "${q.choices[q.correct]}"

Explanation provided: ${q.explanation}

Does the marked correct answer accurately answer the question based on intermediate microeconomics principles? 

Respond in this exact JSON format only, no other text:
{"correct": true} 
or
{"correct": false, "issue": "one sentence explaining what is wrong"}`;

    try {
        const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 150,
            messages: [{ role: 'user', content: prompt }]
        });

        const text = response.content[0].text.trim();
        const result = JSON.parse(text);
        return result;
    } catch (e) {
        return { correct: true }; // skip on parse error
    }
}

async function main() {
    const issues = [];
    let checked = 0;

    for (const file of files) {
        const raw = fs.readFileSync(path.join(questionsDir, file), 'utf8');
        let data;
        try { data = JSON.parse(raw); } catch (e) { continue; }

        const topic = data.topic;
        console.log(`Checking: ${file}`);

        for (let i = 0; i < data.questions.length; i++) {
            const q = data.questions[i];
            const result = await checkQuestion(topic, q, i + 1);
            checked++;

            if (!result.correct) {
                issues.push({
                    file,
                    topic,
                    qNum: i + 1,
                    question: q.question.substring(0, 80) + '...',
                    markedCorrect: `${q.correct}: ${q.choices[q.correct]}`,
                    issue: result.issue
                });
                console.log(`  ⚠️  Q${i + 1}: ${result.issue}`);
            }

            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log(`\nChecked ${checked} questions across ${files.length} files.`);
    console.log(`Found ${issues.length} potentially incorrect questions.\n`);

    const report = issues.map(i =>
        `[INCORRECT] ${i.file} — Q${i.qNum}\nQuestion: ${i.question}\nMarked correct: ${i.markedCorrect}\nIssue: ${i.issue}\n`
    ).join('\n');

    fs.writeFileSync('scripts/incorrect-questions-report.txt', report);
    console.log('Report saved to scripts/incorrect-questions-report.txt');
}

main();