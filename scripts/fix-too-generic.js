#!/usr/bin/env node
// Patches TOO_GENERIC questions by adding concrete numbers and specific agents.
// Only modifies the `question` field; choices, correct, and explanation stay intact.

const fs = require('fs');
const DIR = 'content/questions/econ-301/';

const patches = [
  {
    file: 'bads-neutrals-satiation.json',
    changes: [
      {
        idx: 4,
        question: 'Suppose pollution p (tons) is on the horizontal axis and money m (dollars) is on the vertical axis. Each extra ton of pollution costs Leila $300 in compensating income to stay at the same utility level. What does this imply about the slope of her indifference curves?',
      },
      {
        idx: 6,
        question: "Ben's utility is U(x,z)=x, where x is burritos and z is napkins. In what sense are napkins a neutral good for Ben?",
      },
    ],
  },
  {
    file: 'contingent-consumption.json',
    changes: [
      {
        idx: 5,
        question: "Maria faces two possible states: sick (S) and healthy (H). Her budget line over (c_S, c_H) has slope -3, reflecting prices of the two state-contingent claims. Her indifference curves are smooth and strictly convex. In a contingent consumption diagram with c_S on the horizontal axis, what does tangency between her indifference curve and budget line imply?",
      },
    ],
  },
  {
    file: 'endowments.json',
    changes: [
      {
        idx: 5,
        question: "Rosa owns an endowment of 15 units of x and chooses to consume 9 units of x after trading. In an endowment diagram with x on the horizontal axis, what does the horizontal gap of 6 units between her endowment and chosen bundle represent?",
      },
      {
        idx: 6,
        question: "Oil's price rises from $40 to $60 per barrel. Carlos owns an oil endowment; Fatima earns $2,000 per month with no oil. Why does the price increase affect them differently as oil consumers?",
      },
    ],
  },
  {
    file: 'expansion-paths.json',
    changes: [
      {
        idx: 3,
        question: "A bakery's expansion path bends toward the labor axis as output rises from 200 to 800 units, with the wage fixed at $20/hour and oven rental fixed at $50/hour. What does this imply?",
      },
    ],
  },
  {
    file: 'firm-supply.json',
    changes: [
      {
        idx: 5,
        question: "A bakery's AVC reaches its minimum of $8 per loaf at q=40 loaves. Its MC curve crosses AVC there and slopes upward for q>40. The market price is $14 per loaf. How is the bakery's supplied quantity identified on the cost diagram?",
      },
      {
        idx: 8,
        question: "A cement plant has MC(q)=4+2q and shuts down when price falls below minimum AVC. Which statement correctly distinguishes the plant's short-run supply curve from its MC curve?",
      },
    ],
  },
  {
    file: 'income-offer-curves.json',
    changes: [
      {
        idx: 6,
        question: "Mia's income offer curve for groceries x (p_x=$4) and movie tickets y (p_y=$15) slopes upward when income is below $1,000/month but turns left when income exceeds $1,000. What is the best economic interpretation?",
      },
    ],
  },
  {
    file: 'interior-solutions.json',
    changes: [
      {
        idx: 5,
        question: "Tanya buys concert tickets x at $15 each and parking passes y at $10 each. Her income rises from $80 to $150 and both optimal bundles are interior. Which graphical feature is unchanged between the two situations?",
      },
    ],
  },
  {
    file: 'long-run-cost.json',
    changes: [
      {
        idx: 3,
        question: "A factory's input prices are fixed at w=$20/hour and r=$30/hour, but a new technology doubles output from every input bundle. What happens to the long-run cost curve for any target output q?",
      },
      {
        idx: 9,
        question: "A shipping company's production function changes from Q=L+K (constant returns) to Q=(L+K)^1.3 (increasing returns) over output levels from 100 to 500 units. What happens to LRAC over that range?",
      },
    ],
  },
  {
    file: 'principal-agent-problems.json',
    changes: [
      {
        idx: 3,
        question: "Apex Co. pays its salesperson a 20% commission on revenues. The salesperson's risk aversion doubles due to personal financial stress, while output remains equally noisy and effort is still unobservable. What is the likely effect on the optimal contract?",
      },
      {
        idx: 6,
        question: "Why does a principal-agent problem arise when Walmart hires a store manager to run a local branch?",
      },
    ],
  },
  {
    file: 'private-vs-social-cost.json',
    changes: [
      {
        idx: 8,
        question: "A steel plant emits pollutants while producing. Which statement correctly distinguishes private marginal cost from social marginal cost for steel output?",
      },
    ],
  },
  {
    file: 'production-technology.json',
    changes: [
      {
        idx: 8,
        question: "Which statement best distinguishes a production function from a production set for Pacific Juice Co.?",
      },
    ],
  },
  {
    file: 'screening.json',
    changes: [
      {
        idx: 5,
        question: "TechHire offers two contracts: Contract H (8 hrs/day at $120/day) and Contract L (4 hrs/day at $70/day). High-ability workers have flatter indifference curves because effort is less costly for them. Which menu visually represents a separating screening outcome?",
      },
    ],
  },
  {
    file: 'short-run-vs-long-run.json',
    changes: [
      {
        idx: 6,
        question: "What is the key economic difference between the short run and the long run for a bakery that owns 10 fixed ovens?",
      },
    ],
  },
  {
    file: 'shutdown-condition.json',
    changes: [
      {
        idx: 4,
        question: "Acme Plant's AVC reaches a minimum of $12 at q=50 units. The market price is $9. On the cost diagram, what does this price-AVC relationship imply?",
      },
    ],
  },
  {
    file: 'states-of-nature.json',
    changes: [
      {
        idx: 3,
        question: "Raj purchases state-contingent claims to insure against illness. The bad-state claim price falls from $0.40 to $0.25 per dollar of coverage. What is the direct substitution effect on Raj's consumption choice?",
      },
    ],
  },
  {
    file: 'substitution-effect.json',
    changes: [
      {
        idx: 6,
        question: "When coffee's price rises from $3 to $5 per cup, economists decompose the effect into substitution and income components. Why does the substitution component not depend on whether coffee is normal or inferior?",
      },
    ],
  },
  {
    file: 'tangency-condition.json',
    changes: [
      {
        idx: 5,
        question: "Elena's budget line rotates inward around the y-intercept when x's price rises from $4 to $6, with income fixed at $80. For an interior optimum with convex indifference curves, what graphical change must occur at the new tangency?",
      },
    ],
  },
  {
    file: 'third-degree-price-discrimination.json',
    changes: [
      {
        idx: 2,
        question: "SkyAir price-discriminates between business travelers and tourists at MC=$80/seat. Business demand elasticity rises from -1.5 to -2.5 while tourist demand stays at -1.8. What happens to the optimal relative price for business travelers?",
      },
    ],
  },
  {
    file: 'zero-economic-profit.json',
    changes: [
      {
        idx: 5,
        question: "A bakery produces 200 loaves/day at ATC=$3.50 and price P=$3.50. On the standard cost diagram, what is the profit rectangle?",
      },
    ],
  },
];

let totalFixed = 0;

for (const { file, changes } of patches) {
  const path = DIR + file;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  let modified = false;

  for (const { idx, question } of changes) {
    const q = data.questions[idx];
    if (!q) { console.warn(`MISSING Q${idx+1} in ${file}`); continue; }
    q.question = question;
    modified = true;
    totalFixed++;
    console.log(`FIXED: ${file} Q${idx+1}`);
  }

  if (modified) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  }
}

console.log(`\nTotal questions patched: ${totalFixed}`);
