const fs = require('fs');
const path = require('path');

const stagingDir = 'content/questions/econ-301/staging';
const outputDir = 'content/questions/econ-301';

const files = fs.readdirSync(stagingDir).filter(f => f.endsWith('.json'));

let total = 0;

for (const file of files) {
    const raw = fs.readFileSync(path.join(stagingDir, file), 'utf8');
    let data;

    try {
        data = JSON.parse(raw);
    } catch (e) {
        console.error(`JSON parse error in ${file}:`, e.message);
        continue;
    }

    const topics = Array.isArray(data) ? data : [data];

    for (const topic of topics) {
        if (!topic.topic || !topic.questions) {
            console.warn(`Skipping malformed topic in ${file}`);
            continue;
        }

        const slug = topic.topic
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        const outPath = path.join(outputDir, `${slug}.json`);
        fs.writeFileSync(outPath, JSON.stringify(topic, null, 2));
        console.log(`Written: ${slug}.json`);
        total++;
    }
}

console.log(`\nDone. ${total} topic files written to ${outputDir}`);