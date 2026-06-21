const fs = require('fs');
const path = require('path');

const questionsDir = 'content/questions/econ-301';
const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json') && !f.includes('staging'));

const issues = [];

for (const file of files) {
    const raw = fs.readFileSync(path.join(questionsDir, file), 'utf8');
    let data;
    try { data = JSON.parse(raw); } catch (e) {
        issues.push({ file, type: 'PARSE_ERROR', detail: e.message });
        continue;
    }

    const questions = data.questions || [];

    questions.forEach((q, i) => {
        const qNum = i + 1;

        // Flags Type taxonomy leaking into content
        if (/Type \d/.test(q.question) || Object.values(q.choices).some(c => /Type \d/.test(c))) {
            issues.push({ file, qNum, type: 'TAXONOMY_LEAK', detail: 'Question or answer mentions "Type X"' });
        }

        // Flags questions that are too short to be meaningful
        if (q.question.length < 40) {
            issues.push({ file, qNum, type: 'TOO_SHORT', detail: `Question only ${q.question.length} chars` });
        }

        // Flags missing explanation
        if (!q.explanation || q.explanation.length < 20) {
            issues.push({ file, qNum, type: 'MISSING_EXPLANATION', detail: 'Explanation missing or too short' });
        }

        // Flags duplicate correct answers
        const correctText = q.choices[q.correct];
        const otherTexts = Object.entries(q.choices)
            .filter(([k]) => k !== q.correct)
            .map(([, v]) => v);
        if (otherTexts.some(t => t === correctText)) {
            issues.push({ file, qNum, type: 'DUPLICATE_ANSWER', detail: 'Correct answer text duplicated in wrong answers' });
        }

        // Flags answers that are suspiciously similar to each other
        const allChoices = Object.values(q.choices);
        if (new Set(allChoices).size < 4) {
            issues.push({ file, qNum, type: 'DUPLICATE_CHOICES', detail: 'Two or more answer choices are identical' });
        }

        // Flags generic placeholder-style questions
        const genericPhrases = ['a consumer', 'a firm', 'a good', 'some good'];
        const hasNoNumbers = !/\d/.test(q.question);
        if (hasNoNumbers && genericPhrases.some(p => q.question.toLowerCase().includes(p))) {
            issues.push({ file, qNum, type: 'TOO_GENERIC', detail: 'No specific numbers and uses generic placeholder language' });
        }
    });
}

// Output report
if (issues.length === 0) {
    console.log('No issues found.');
} else {
    console.log(`\nFound ${issues.length} issues:\n`);
    issues.forEach(({ file, qNum, type, detail }) => {
        const loc = qNum ? `Q${qNum}` : 'FILE';
        console.log(`[${type}] ${file} — ${loc}: ${detail}`);
    });

    // Write to file for reference
    fs.writeFileSync('scripts/question-audit-report.txt',
        issues.map(({ file, qNum, type, detail }) =>
            `[${type}] ${file} — ${qNum ? `Q${qNum}` : 'FILE'}: ${detail}`
        ).join('\n')
    );
    console.log('\nReport saved to scripts/question-audit-report.txt');
}