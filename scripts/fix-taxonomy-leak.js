#!/usr/bin/env node
// Strips "This topic does not directly involve X, so this question uses/substitutes Type N. "
// from Q10 question text, and trailing taxonomy notes from explanations.

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '../content/questions/econ-301');

const FILES = [
  'average-marginal-cost.json',
  'bads-neutrals-satiation.json',
  'cobb-douglas-production.json',
  'conditional-factor-demands.json',
  'cost-minimization.json',
  'deriving-cost-from-production.json',
  'entry-and-exit.json',
  'expansion-paths.json',
  'factor-demand.json',
  'fixed-variable-cost.json',
  'game-theory-basics.json',
  'income-elasticity.json',
  'indifference-curves.json',
  'inputs-and-outputs.json',
  'isocost-lines.json',
  'isoquants.json',
  'long-run-cost.json',
  'marginal-product.json',
  'marginal-rate-of-substitution.json',
  'marginal-revenue-product.json',
  'marginal-utility.json',
  'monotonic-transformations.json',
  'ordinal-utility.json',
  'perfect-substitutes-complements.json',
  'preferences.json',
  'price-taking-firms.json',
  'production-technology.json',
  'profit-maximization.json',
  'returns-to-scale.json',
  'short-run-cost.json',
  'short-run-vs-long-run.json',
  'technical-rate-of-substitution.json',
  'utility.json',
  'zero-economic-profit.json',
];

// Pattern: "This topic does not directly involve ..., so this question uses/substitutes Type N. "
const QUESTION_PREFIX = /^This topic does not directly involve[^.]+\.\s+/;

// Pattern at end of explanation: " Welfare analysis ... so Type N is used."
// or any variant ending "...so Type N is used." or "...so this is Type N."
const EXPLANATION_SUFFIX = /\s+(?:Welfare analysis[^.]+\.|This topic[^.]+\.|[A-Z][^.]*so (?:Type \d|this is Type \d)[^.]*\.)\s*$/;

let changed = 0;
let skipped = 0;

for (const file of FILES) {
  const filepath = path.join(DIR, file);
  if (!fs.existsSync(filepath)) {
    console.warn(`MISSING: ${file}`);
    skipped++;
    continue;
  }

  const raw = fs.readFileSync(filepath, 'utf8');
  const data = JSON.parse(raw);

  const questions = data.questions;
  if (!questions || questions.length < 10) {
    console.warn(`SHORT: ${file} has ${questions?.length} questions`);
    skipped++;
    continue;
  }

  const q10 = questions[9];
  let modified = false;

  // Fix question text
  if (QUESTION_PREFIX.test(q10.question)) {
    q10.question = q10.question.replace(QUESTION_PREFIX, '');
    modified = true;
  }

  // Fix explanation text — strip trailing taxonomy note sentence(s)
  if (q10.explanation) {
    const cleaned = q10.explanation.replace(EXPLANATION_SUFFIX, '');
    if (cleaned !== q10.explanation) {
      q10.explanation = cleaned;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n');
    console.log(`FIXED: ${file}`);
    changed++;
  } else {
    console.log(`CLEAN: ${file}`);
    skipped++;
  }
}

console.log(`\nDone. Fixed: ${changed}, Skipped/clean: ${skipped}`);
