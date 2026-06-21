#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'content', 'courses', 'econ-301', 'course.json');
const course = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const learnData = {

t123: {
  learn: {
    openingTension: `Airlines charge international business travelers ten times what they charge backpackers on the same flight. Movie theaters charge seniors half price. How does charging different prices to different groups increase profit — and what condition must hold for this to work?`,
    coreIdea: `Third-degree price discrimination charges different prices to different identifiable consumer groups based on their price elasticity of demand, with the higher price going to the less elastic (less price-sensitive) group.`,
    mathSetup: `Firm sells in two separable markets (1 and 2) with inverse demands P₁(Q₁) and P₂(Q₂). Maximize π = P₁Q₁ + P₂Q₂ − C(Q₁ + Q₂). FOC for each market: MR₁(Q₁*) = MC and MR₂(Q₂*) = MC. Therefore MR₁ = MR₂ = MC. Using the elasticity form: P₁(1 + 1/ε₁) = P₂(1 + 1/ε₂). If |ε₁| < |ε₂|, then P₁ > P₂ — the less elastic market faces the higher price.`,
    derivation: `1. Profit-maximization in each market independently: set MR_i = MC for i = 1,2. 2. If MR₁ > MR₂ at current allocation, shift a unit from market 2 to market 1: MR₁ increases revenue more than MR₂ costs. Rebalance until MR₁ = MR₂ = MC. 3. This gives the pricing rule: charge more to groups with lower |ε| (less elastic demand). 4. Why: inelastic buyers don't reduce quantity much in response to price increases → raise their price. Elastic buyers reduce quantity sharply → keep their price lower. 5. Requirements: markets must be separable (no arbitrage between groups) and groups must be identifiable by observable characteristics.`,
    graphicalIntuition: `Two-panel diagram: left panel = high-price market (less elastic), right panel = low-price market (more elastic). A shared horizontal line at MR = MC determines Q₁* and Q₂* in each panel separately. The price in the left panel P₁ > P₂ due to lower elasticity. The markup formula shows: P₁/P₂ = [(1 − 1/|ε₂|)]/[(1 − 1/|ε₁|)] > 1 when |ε₂| > |ε₁|.`,
    workedExample: `Airline: business class demand P_B = 900 − 3Q_B (|ε_B| = 2 at optimum). Economy demand P_E = 500 − 2Q_E (|ε_E| = 3 at optimum). MC = 100.\nBusiness: MR_B = MC → 900 − 6Q_B = 100 → Q_B = 133, P_B = 501.\nEconomy: MR_E = MC → 500 − 4Q_E = 100 → Q_E = 100, P_E = 300.\nCheck: MR_B = MR_E = MC = 100 ✓. P_B > P_E because |ε_B| < |ε_E|.\nLerner Indices: L_B = 1/2 = 0.50; L_E = 1/3 = 0.33. Business class markup is larger.`,
    boundaryConditions: `1. Arbitrage prevention is essential: if economy passengers can buy business class tickets and resell, the price differential collapses. Geographic separation, non-transferable IDs, or timing (different booking windows) enforce market separation. 2. 3rd-degree PD increases total output relative to uniform monopoly but may not achieve the efficient quantity — some markets are still underserved. 3. 3rd-degree PD may lower welfare if it excludes some consumers who would have purchased under a uniform price (depends on the specific demand curves).`,
    examTraps: [
      `A student might confuse 3rd-degree with 1st-degree PD, but the correct answer is that 3rd-degree PD charges different prices to different observable groups (all members of each group pay the same price), while 1st-degree PD charges each individual their own WTP. In 3rd-degree PD, all business travelers pay P_B regardless of their individual WTP.`,
      `A student might confuse 3rd-degree with 2nd-degree PD, but the correct answer is that 3rd-degree PD requires identifying group membership (student ID, age, location) — the seller chooses who pays what. 2nd-degree PD offers a quantity menu and lets consumers self-select without any identification. The key distinction: seller-sorted (3rd) vs. self-selected (2nd).`,
      `A student might think the higher price always goes to the group with higher income, but the correct answer is that the higher price goes to the group with LOWER price elasticity of demand. This often correlates with income (business travelers have less flexibility), but the elasticity condition is what matters, not income per se.`
    ],
    frq: {
      prompt: `A pharmaceutical company can sell a patented drug in two markets: domestic (demand P_D = 100 − Q_D) and international (demand P_I = 60 − 2Q_I). MC = 10.`,
      parts: [
        `Find the profit-maximizing price and quantity in each market. Show that MR_D = MR_I = MC.`,
        `Calculate the price elasticity of demand at the optimum in each market using the Lerner Index relationship. Which market has more elastic demand?`,
        `Why would the company charge a higher price in the domestic market? What arbitrage condition must hold for this to work?`,
        `Compare this outcome to a single uniform price (find the best single price and compare profits). How much extra profit does price discrimination generate?`
      ]
    }
  },
  flashcards: [
    { front: `Define third-degree price discrimination.`, back: `Charging different prices to different identifiable groups of consumers based on observable characteristics (age, location, student status). Within each group, a single uniform price is charged. The rule: set MR₁ = MR₂ = MC. Higher price goes to the less elastic group. Requires: (1) identifiable consumer groups, (2) no arbitrage between groups.`, type: `definition` },
    { front: `Contrast 3rd-degree, 2nd-degree, and 1st-degree price discrimination by how groups are sorted.`, back: `3rd degree: seller identifies groups by observable characteristics (student ID, location) and assigns prices — seller-sorted. 2nd degree: seller offers a menu (quantity tiers), buyers choose — self-sorted. 1st degree: seller charges each individual's WTP — perfectly individually sorted. Key distinction: 3rd-degree requires the seller to observe and categorize; 2nd-degree lets buyers reveal themselves; 1st-degree requires complete information about individuals.`, type: `distinction` },
    { front: `What is the pricing rule for 3rd-degree price discrimination?`, back: `Set MR₁ = MR₂ = MC: marginal revenue must be equal across markets and equal to marginal cost. Equivalently: P₁(1 + 1/ε₁) = P₂(1 + 1/ε₂). The market with less elastic demand (lower |ε|) receives the higher price, because the firm can raise price there without losing as many sales.`, type: `condition` },
    { front: `What two conditions must hold for 3rd-degree price discrimination to be feasible?`, back: `(1) Consumer groups must be identifiable by observable characteristics (age, affiliation, location, time of purchase). (2) Arbitrage must be prevented: consumers who buy at the low price cannot resell to those facing the high price. Without arbitrage prevention, the price differential collapses as low-price buyers undercut the monopolist.`, type: `condition` }
  ]
},

t124: {
  learn: {
    openingTension: `An amusement park could charge per ride. Or it could charge a high entry fee and let you ride for free. Or some combination. Which strategy extracts the most revenue from visitors? The answer comes from separating the entry margin from the consumption margin.`,
    coreIdea: `A two-part tariff charges consumers a fixed entry fee (T) plus a per-unit price (p) for each unit consumed; the optimal strategy sets p = MC and T = the entire consumer surplus at that price, extracting the maximum possible revenue.`,
    mathSetup: `Two-part tariff: total payment = T + p·q, where T is the fixed fee and p is the per-unit price. Consumer demand: q*(p). Consumer surplus at price p: CS(p) = ∫_p^{P_max} D(x)dx. Profit: π = (p − MC)·q*(p) + T. To maximize profit: (1) set p = MC (maximizing total surplus available to extract), (2) set T = CS(p = MC) (extract all CS via the fixed fee). Then π = CS(p = MC) + (MC − MC)·Q = CS(MC).`,
    derivation: `1. Given p, consumer demands q*(p) and receives CS(p). The firm captures T. 2. Raising T to CS(p) extracts all consumer surplus — the consumer is just indifferent between buying and not. 3. Now optimize p: total surplus = CS(p) + (p − MC)·q*(p). The firm captures all of it (T + variable profit). This total is maximized when p = MC (standard surplus-maximization condition). 4. At p = MC: all DWL is eliminated; CS(MC) is maximized; setting T = CS(MC) captures it all. 5. Profit = CS(MC) — equal to what perfect 1st-degree PD earns but via a different mechanism.`,
    graphicalIntuition: `At p = MC: the market operates efficiently (Q = Q*). The CS triangle (area between demand and MC, from 0 to Q*) is the maximum extractable surplus. Setting T = CS(MC) captures this triangle as fixed revenue. The firm earns this entire triangle as profit — identical to 1st-degree PD profit — but through a uniform-pricing plus fixed-fee mechanism rather than individual pricing.`,
    workedExample: `Theme park: inverse demand per visitor q*(p) based on representative consumer with demand P = 20 − q. MC = $2/ride.\nAt p = MC = 2: q* = 18 rides. CS = (1/2)(20 − 2)(18) = $162.\nOptimal two-part tariff: p = $2/ride, T = $162 entry fee.\nTotal spent by visitor: $162 + $2×18 = $198. Total revenue: T + pq = 162 + 36 = $198. Total cost: $2×18 = $36. Profit = $162.\nAlternative single price p = $11 (monopoly): q = 9, CS = (1/2)(9)(9) = $40.50, profit = (11−2)×9 = $81. Two-part tariff doubles profit.`,
    boundaryConditions: `1. Homogeneous consumers assumption: the optimal T = CS is derived for a representative consumer. With heterogeneous consumers, setting T = CS_low extracts all surplus from low-WTP consumers but not from high-WTP consumers. A two-part tariff with T too high excludes low-WTP buyers. 2. Optimal T with heterogeneous consumers: trade-off between extracting more per included buyer (high T) vs. including more buyers. 3. Used in practice: amusement parks, gym memberships, Costco/Sam's Club, Amazon Prime, country clubs.`,
    examTraps: [
      `A student might think the per-unit price in a two-part tariff should be above MC to maximize profit, but the correct answer is that setting p = MC maximizes total surplus and therefore maximizes the amount that can be captured via the fixed fee T. Raising p above MC reduces CS (the pool to extract) by more than it gains in per-unit margin.`,
      `A student might think a two-part tariff is a form of 2nd-degree price discrimination, but the correct answer is that a two-part tariff is better classified as 1st-degree PD when consumers are identical (all CS extracted) or can be a form of 2nd-degree when consumers are heterogeneous and self-select into different packages.`,
      `A student might think the fixed fee T is profit and the per-unit price generates separate profit, but the correct answer is that at p = MC, the per-unit sales generate zero operating profit — all profit comes from T. Total profit = T = CS(MC). The per-unit price is set only to induce efficient consumption.`
    ],
    frq: {
      prompt: `A golf club serves identical members with individual demand P = 30 − 2Q for rounds of golf. MC = $6 per round.`,
      parts: [
        `What is the optimal per-unit price and entry fee under a two-part tariff? Calculate total profit per member.`,
        `Compare to a uniform monopoly price (find Q* and π* without the entry fee). How much more profit does the two-part tariff generate?`,
        `If a second type of member has demand P = 20 − 2Q, should the club charge the same T and p to both types? Explain the trade-off.`,
        `Explain why optimal p = MC in a two-part tariff, even though MC pricing gives zero variable profit.`
      ]
    }
  },
  flashcards: [
    { front: `What is a two-part tariff?`, back: `A pricing scheme with two components: (1) a fixed entry fee T paid regardless of quantity consumed, and (2) a per-unit price p charged for each unit. Optimal two-part tariff: set p = MC (eliminating DWL and maximizing CS to extract) and T = CS(p = MC) (extracting all CS via the fixed fee). With identical consumers, total profit = CS(MC).`, type: `definition` },
    { front: `Why is the optimal per-unit price in a two-part tariff equal to MC?`, back: `The firm's total profit = variable profit + T = (p − MC)·q + T. Since T = CS(p), and CS(p) decreases as p rises, the firm maximizes total profit by minimizing the DWL (setting p = MC), which maximizes CS(MC) — the pool of surplus available to extract via T. Raising p above MC reduces T by more than it gains in variable margin.`, type: `condition` },
    { front: `How does a two-part tariff compare to 1st-degree price discrimination in profit?`, back: `With homogeneous consumers, both achieve the same profit: the entire area between the demand curve and MC (from 0 to Q*). Two-part tariff achieves this via T = CS(MC) + zero variable profit. 1st-degree PD achieves it by charging each unit at its demand price. With heterogeneous consumers, 1st-degree PD can earn more because it tailors to each individual, while a single T cannot extract all CS from high-WTP consumers.`, type: `distinction` }
  ]
},

t125: {
  learn: {
    openingTension: `Microsoft once sold Word separately for $200 and Excel separately for $150. If one customer values Word at $250 and Excel at $100, and another values Word at $100 and Excel at $250, what's the best way to price them — individually or as a bundle?`,
    coreIdea: `Bundling sells multiple goods together at a single package price and is profitable when consumers' valuations for individual goods are negatively correlated — meaning the bundle reduces valuation dispersion across buyers and allows more surplus extraction than separate pricing.`,
    mathSetup: `Two goods (A and B). Consumer type 1: (v₁ᴬ, v₁ᴮ). Consumer type 2: (v₂ᴬ, v₂ᴮ). Pure bundling: sell only the bundle at price P_B = min(v₁ᴬ + v₁ᴮ, v₂ᴬ + v₂ᴮ). Mixed bundling: offer individual goods AND the bundle, allowing consumers to self-select. Bundling is profitable when valuations are negatively correlated: one type values A > B, the other values B > A. When valuations are positively correlated (both prefer A over B), separate pricing dominates.`,
    derivation: `1. Separate pricing: set P_A to capture type with higher v_A; P_B to capture type with higher v_B. Some surplus left uncaptured. 2. Bundle: set P_bundle at the sum of valuations for the lowest-sum type. All consumers buy. 3. Bundle profitable when: (sum of valuations dispersion) is lower than (individual valuation dispersion). Negative correlation reduces bundle valuation dispersion. 4. Example: v₁ᴬ = 250, v₁ᴮ = 100; v₂ᴬ = 100, v₂ᴮ = 250. Bundle sums: both = 350. Negative correlation: as v for A rises, v for B falls.`,
    graphicalIntuition: `Plot type 1 and type 2 valuations in (v_A, v_B) space. Negative correlation: type 1 is in the upper-left (high A, low B); type 2 is in lower-right (low A, high B). Bundle line: v_A + v_B = constant. With negative correlation, both types are close to the same bundle isovaluation line → bundle can capture both with a single price. With positive correlation, the types are far apart along the same line, making a single bundle less effective.`,
    workedExample: `Consumer 1: Word = $250, Excel = $100. Consumer 2: Word = $100, Excel = $250. MC = 0.\nSeparate pricing: best Word price = $100 (both buy) → $200; best Excel price = $100 (both buy) → $200. Total = $400. Or: Word at $250 (only type 1 buys) + Excel at $250 (only type 2 buys) = $500.\nBundle price: v₁ᴬ + v₁ᴮ = 350 = v₂ᴬ + v₂ᴮ. Bundle at $350: both buy. Revenue = $700. Bundle wins ($700 > $500).\nInterpret: Negative correlation of valuations makes bundling dominate separate pricing.`,
    boundaryConditions: `1. Positive correlation in valuations: one type values both goods highly, the other values both lowly. Bundling less profitable — separate pricing or 1st-degree PD works better. 2. Mixed bundling (offer both bundle and individual goods) typically dominates pure bundling when consumer types are heterogeneous enough. 3. Bundling is used in software suites, cable TV packages, airline seat upgrades, fast-food meal deals, insurance packages.`,
    examTraps: [
      `A student might think bundling always increases revenue, but the correct answer is that bundling is only profitable when valuations are negatively correlated. With positive correlation, the bundle sum has high dispersion and separate pricing (or 1st-degree PD) captures more surplus.`,
      `A student might think mixed bundling is always superior to pure bundling, but the correct answer is that with homogeneous consumers, both achieve the same outcome. Mixed bundling dominates pure bundling only when consumer types differ enough that some prefer the bundle and others prefer individual items at lower standalone prices.`,
      `A student might confuse tying with bundling: tying requires consumers to purchase a complementary good from the same seller (e.g., printer + ink cartridge). Bundling offers multiple goods at a combined price but does not typically prevent buying substitutes elsewhere.`
    ],
    frq: {
      prompt: `A software firm sells product A and product B. Two consumer types exist: type 1 values A at $300 and B at $50; type 2 values A at $50 and B at $300. MC = 0 for both products.`,
      parts: [
        `Calculate total revenue from optimal separate pricing of A and B.`,
        `Calculate total revenue from pure bundling. Which strategy is better?`,
        `Now suppose type 1 values A at $300 and B at $200; type 2 values A at $200 and B at $300. Repeat the comparison. Does the result change? Why?`,
        `What is mixed bundling? Describe how it might improve on pure bundling in this second scenario.`
      ]
    }
  },
  flashcards: [
    { front: `When is pure bundling more profitable than separate pricing?`, back: `When consumer valuations for the goods are negatively correlated: as valuation for good A rises, valuation for good B falls. Negative correlation means bundle values (sum of individual valuations) are more similar across consumers than the individual valuations are — the firm can set a single bundle price closer to each consumer's total valuation and capture more surplus.`, type: `condition` },
    { front: `What is mixed bundling?`, back: `Offering both the bundle at a package price AND each good separately at individual prices. Consumers with high value for both buy the bundle; those with high value for only one good buy individually. Mixed bundling dominates pure bundling when consumer types are heterogeneous: some strongly prefer one good, so they buy it alone at the individual price rather than paying for a bundle containing a good they don't want.`, type: `definition` },
    { front: `Distinguish: bundling vs. tying.`, back: `Bundling: selling multiple goods at a combined price (package deal). Consumers may or may not have alternative sources. Tying: requiring that purchase of one good (tying good) be accompanied by purchase of another good (tied good) from the same seller. Tying forecloses competition in the tied good market; bundling may not. Both are strategies for extracting surplus across multiple goods.`, type: `distinction` }
  ]
},

t126: {
  learn: {
    openingTension: `Two competing airlines decide simultaneously whether to run aggressive ad campaigns. Each knows that if both advertise, they split a crowded market; if neither advertises, they split a peaceful market; but if one advertises and the other doesn't, the advertiser gains a huge advantage. What does each airline do?`,
    coreIdea: `A game in normal form specifies players, each player's strategy set, and a payoff function mapping strategy combinations to outcomes — capturing interdependence where each player's best choice depends on what others choose.`,
    mathSetup: `Normal-form game: G = {N, {Sᵢ}, {uᵢ}} where N = set of players, Sᵢ = strategy set of player i, uᵢ: S₁ × ... × Sₙ → ℝ = payoff function. Strategy profile: s = (s₁, ..., sₙ). Player i's payoff: uᵢ(s) = uᵢ(sᵢ, s₋ᵢ), where s₋ᵢ are all other players' strategies. The payoff matrix displays uᵢ(sᵢ, s₋ᵢ) for all strategy combinations.`,
    derivation: `Classic example — Prisoner's Dilemma (advertising version):\nTwo airlines: Firm A (rows), Firm B (columns). Strategies: Advertise (Ad) or Don't (D).\nPayoff matrix (A's profit, B's profit):\n           Firm B: Ad     Firm B: D\nFirm A: Ad  (3, 3)        (7, 1)\nFirm A: D   (1, 7)        (5, 5)\nUnits: millions. Interpretation: if both advertise, each spends $2M on ads, nets $3M (war of attrition). If neither advertises, each nets $5M (peaceful duopoly). If only one advertises, the advertiser captures most of the market ($7M) and the other gets only $1M.`,
    graphicalIntuition: `The payoff matrix is the central tool. Row player (A) controls rows; column player (B) controls columns. Each cell shows (payoff to A, payoff to B). Reading the matrix: to find A's best response to Firm B choosing Ad, compare A's payoffs in the Ad column: (3 vs. 1) — A prefers Ad. To find A's best response to B choosing D: (7 vs. 5) — A prefers Ad. A always prefers Ad regardless of B's choice → Ad is A's dominant strategy.`,
    workedExample: `The advertising Prisoner's Dilemma above shows the key structure: each firm has a dominant strategy (Advertise), yet both would be better off if neither advertised (5,5 > 3,3). This is the essence of the Prisoner's Dilemma — individual rationality leads to a collectively worse outcome. The (Ad, Ad) = (3,3) outcome is a Nash equilibrium because neither firm can improve its payoff by unilaterally switching to Don't (Firm A: 3 > 1; Firm B: 3 > 1).`,
    boundaryConditions: `1. The normal form captures simultaneous, one-shot decisions. For sequential decisions (one firm moves first), use the extensive form (game tree) with backward induction. 2. Repeated games: if players interact repeatedly, they may sustain cooperative outcomes (e.g., both Don't) through trigger strategies — even though the one-shot game has an uncooperative Nash equilibrium. 3. Games with more than two players or more than two strategies require larger payoff matrices but use the same analysis.`,
    examTraps: [
      `A student might think the payoff matrix shows total industry profit, but the correct answer is that each cell shows each player's individual payoff — (A's payoff, B's payoff). The format always lists the row player's payoff first.`,
      `A student might think players in a normal-form game communicate before choosing, but the correct answer is that normal-form games capture simultaneous decisions: each player chooses a strategy without observing the other's choice. Communication or sequential play requires a different framework (cooperative game theory or extensive form).`,
      `A student might think the highest combined payoff is always the equilibrium, but the correct answer is that Nash equilibrium is determined by individual best responses, not by maximizing joint payoff. In the Prisoner's Dilemma, the joint-maximizing outcome (D, D) = (5, 5) is NOT the Nash equilibrium.`
    ],
    frq: {
      prompt: `Two competing firms (A and B) simultaneously decide whether to enter a new market. Payoffs (millions):\n       B: Enter  B: Stay\nA: Enter (2, 2)  (6, 0)\nA: Stay  (0, 6)  (0, 0)`,
      parts: [
        `Identify each player's strategy set and payoff for each strategy combination.`,
        `Does Firm A have a dominant strategy? Explain your reasoning by comparing payoffs in each column.`,
        `Does Firm B have a dominant strategy?`,
        `Find all Nash equilibria. Explain why (Enter, Enter) is or is not a Nash equilibrium.`
      ]
    }
  },
  flashcards: [
    { front: `What are the three components of a normal-form game?`, back: `(1) Players: the set N of decision-makers. (2) Strategy sets: for each player i, the set Sᵢ of all possible actions. (3) Payoff functions: for each player i, uᵢ(s₁, ..., sₙ) maps every strategy profile to a numerical payoff. A normal-form game captures simultaneous decision-making by all players, with each player choosing a strategy without observing others' choices first.`, type: `definition` },
    { front: `In a Prisoner's Dilemma payoff matrix, which outcome is the Nash equilibrium and why is it suboptimal?`, back: `NE is (Defect, Defect) — both players defect. It is an equilibrium because neither can gain by unilaterally switching to Cooperate. But it is suboptimal: both (Cooperate, Cooperate) gives higher joint payoffs. Individual rationality leads to collective irrationality. The dilemma arises because each player's dominant strategy is Defect, even though mutual cooperation yields better outcomes for both.`, type: `condition` },
    { front: `How do you read a 2×2 payoff matrix?`, back: `Row player chooses rows (strategies listed on the left). Column player chooses columns. Each cell gives (row player payoff, column player payoff) — row player's payoff is always listed first. To find row player's best response to a given column: compare the row player's payoffs within that column and choose the row with the highest first number.`, type: `definition` }
  ]
},

t127: {
  learn: {
    openingTension: `In a game where you don't know what your opponent will do, is there ever a strategy that is best regardless of their choice? If so, you should always play it — and if your opponent is rational, they should play their dominant strategy too.`,
    coreIdea: `A dominant strategy is one that gives a player the highest payoff regardless of what other players do — and iterated elimination of dominated strategies reduces a game by removing strategies no rational player would ever choose.`,
    mathSetup: `Strategy sᵢ strictly dominates sᵢ′ if uᵢ(sᵢ, s₋ᵢ) > uᵢ(sᵢ′, s₋ᵢ) for ALL s₋ᵢ ∈ S₋ᵢ. Weakly dominates if ≥ for all s₋ᵢ and > for at least one. A rational player never plays a strictly dominated strategy. IESDS: iteratively eliminate strictly dominated strategies until no more can be removed. If one strategy profile survives, it is the unique rationalizable outcome.`,
    derivation: `Payoff matrix example:\n         B: Left   B: Center   B: Right\nA: Up    (4, 3)    (2, 5)      (3, 2)\nA: Middle (3, 2)   (3, 3)      (2, 4)\nA: Down  (1, 4)    (2, 2)      (4, 1)\nStep 1: Does A have a dominated strategy? Compare row by row: Up vs. Down: (4>1, 2≥2, 3<4) — neither dominates. Up vs. Middle: (4>3, 2<3, 3>2) — neither dominates. No dominant strategy for A initially.\nStep 2: Check B's strategies. B's Left: (3, 2, 4). Center: (5, 3, 2). Right: (2, 4, 1). Left vs. Right: (3>2, 2<4, 4>1) — neither dominates B Left. Center vs. Right: (5>2, 3<4, 2>1) — not dominated. \nFor a cleaner example: if B: Right were dominated (always worse than Center), eliminate it. Then re-examine A's strategies in the reduced game.`,
    graphicalIntuition: `Dominant strategy intuition: draw a vertical line through each column of the payoff matrix, find the row player's maximum in that column, and circle it. If the same strategy is circled in every column, it is the dominant strategy for the row player. Repeat for the column player (circle the column player's max in each row). If both players have dominant strategies, the intersection of circled cells is the Nash equilibrium.`,
    workedExample: `Modified Prisoner's Dilemma:\n       B: Coop    B: Defect\nA: Coop (5, 5)    (1, 7)\nA: Defect (7, 1)  (3, 3)\nFirm A: If B Cooperates: Defect gives 7 > 5 (Coop). If B Defects: Defect gives 3 > 1 (Coop). Defect dominates Coop for A. By symmetry, Defect dominates for B.\nIESDES: eliminate Coop for A (dominated) → game collapses to A: Defect. Then eliminate Coop for B → NE: (Defect, Defect) = (3, 3).\nOnly one strategy profile survives IESDS. This is both the dominant strategy equilibrium and the Nash equilibrium.`,
    boundaryConditions: `1. Dominant strategies are rare: most games do not have dominant strategies for all players. IESDS may not fully solve the game. 2. Weak dominance: weakly dominated strategies can sometimes be the equilibrium strategy (if the other player's strategy makes you exactly indifferent). Only eliminate strictly dominated strategies in IESDS. 3. Order of elimination matters for weak dominance but not for strict dominance.`,
    examTraps: [
      `A student might think a dominant strategy is the one with the highest average payoff, but the correct answer is that a dominant strategy gives the highest payoff in EVERY scenario — for every possible opponent strategy. A strategy with a high average but low payoff in some cases is not dominant.`,
      `A student might think IESDS always produces a unique solution, but the correct answer is that IESDS terminates when no more dominated strategies remain — sometimes multiple strategy profiles survive. Only if IESDS yields a unique profile is the game completely solved by rationality alone.`,
      `A student might think weakly dominated strategies should also be eliminated, but the correct answer is that only STRICTLY dominated strategies should be eliminated in IESDS. A weakly dominated strategy may be a best response against certain opponent strategies, so eliminating it can destroy valid equilibria.`
    ],
    frq: {
      prompt: `Two firms (A and B) compete in a market. Each can choose High price (H) or Low price (L). Payoffs (thousands):\n       B: High   B: Low\nA: High (40, 40) (5, 60)\nA: Low  (60, 5)  (20, 20)`,
      parts: [
        `Does Firm A have a dominant strategy? Show your work by comparing payoffs in each column.`,
        `Does Firm B have a dominant strategy?`,
        `Apply iterated elimination of strictly dominated strategies to find the equilibrium.`,
        `Is the equilibrium Pareto efficient? Could both firms do better, and if so, why don't they?`
      ]
    }
  },
  flashcards: [
    { front: `Define a strictly dominant strategy.`, back: `Strategy sᵢ strictly dominates sᵢ′ if player i's payoff from sᵢ is strictly higher than from sᵢ′ for EVERY possible combination of other players' strategies. A rational player always plays their dominant strategy if one exists, regardless of beliefs about opponents. The existence of dominant strategies greatly simplifies prediction in games.`, type: `definition` },
    { front: `What is iterated elimination of strictly dominated strategies (IESDS)?`, back: `A solution method: (1) identify any strictly dominated strategies and eliminate them, (2) re-examine the reduced game for new dominated strategies, (3) repeat until no more can be eliminated. If a unique strategy profile survives, it is the unique rationalizable outcome — what rational players with common knowledge of rationality will play. IESDS applies only to STRICT dominance.`, type: `definition` },
    { front: `Distinguish: dominant strategy equilibrium vs. Nash equilibrium.`, back: `Dominant strategy equilibrium: each player plays their dominant strategy (best regardless of others). Nash equilibrium: each player plays their best response to the other players' actual strategies. Every dominant strategy equilibrium is also a Nash equilibrium (since a dominant strategy is trivially a best response to anything), but not every Nash equilibrium involves dominant strategies.`, type: `distinction` }
  ]
},

t128: {
  learn: {
    openingTension: `Two firms simultaneously choose whether to run large or small ad campaigns. Neither has a dominant strategy — the best choice depends entirely on what the other firm does. Is there any outcome that is stable — where neither firm wants to change its decision given what the other is doing?`,
    coreIdea: `A Nash equilibrium is a strategy profile where every player's strategy is a best response to all other players' strategies — no player can gain by unilaterally deviating, making it the stable prediction for simultaneous games without dominant strategies.`,
    mathSetup: `Strategy profile s* = (s₁*, ..., sₙ*) is a Nash equilibrium if for every player i: uᵢ(sᵢ*, s₋ᵢ*) ≥ uᵢ(sᵢ, s₋ᵢ*) for all sᵢ ∈ Sᵢ. Equivalently: sᵢ* ∈ BR_i(s₋ᵢ*), where BR_i is player i's best response correspondence. A game may have zero, one, or multiple Nash equilibria in pure strategies.`,
    derivation: `Finding NE in a 2×2 game:\n       B: Left    B: Right\nA: Up  (2, 1)    (0, 0)\nA: Down (0, 0)   (1, 2)\nStep 1: Find A's best response to each of B's strategies:\n- If B plays Left: A gets 2 (Up) vs. 0 (Down) → BR_A(Left) = Up.\n- If B plays Right: A gets 0 (Up) vs. 1 (Down) → BR_A(Right) = Down.\nStep 2: Find B's best response:\n- If A plays Up: B gets 1 (Left) vs. 0 (Right) → BR_B(Up) = Left.\n- If A plays Down: B gets 0 (Left) vs. 2 (Right) → BR_B(Down) = Right.\nStep 3: NE where both players are simultaneously best-responding:\n(Up, Left): A best-responds (Up to Left ✓), B best-responds (Left to Up ✓) → NE.\n(Down, Right): A best-responds (Down to Right ✓), B best-responds (Right to Down ✓) → NE.\nTwo pure-strategy NE exist.`,
    graphicalIntuition: `Circle method: in the payoff matrix, for each column, circle the row player's highest payoff. For each row, circle the column player's highest payoff. A cell with BOTH payoffs circled is a Nash equilibrium. Each circled entry represents a best response; double-circled entries are mutual best responses = Nash equilibria. This is the fastest way to identify all pure-strategy NE in a finite matrix.`,
    workedExample: `Battle of the Sexes:\n            B: Football   B: Opera\nA: Football (3, 1)       (0, 0)\nA: Opera    (0, 0)       (1, 3)\nCircle A's payoffs: Football column — 3 > 0 (circle Football row). Opera column — 1 > 0 (circle Opera row).\nCircle B's payoffs: Football row — 1 > 0 (circle Football column). Opera row — 3 > 0 (circle Opera column).\nDouble circles: (Football, Football) = (3,1) and (Opera, Opera) = (1,3). Two NE.\nNote: (3,1) favors A; (1,3) favors B. Neither NE is Pareto superior — the coordination problem remains unsolved by Nash equilibrium alone.`,
    boundaryConditions: `1. Nash equilibrium existence: by Nash's theorem, every finite game has at least one Nash equilibrium (possibly in mixed strategies). 2. Multiple NE: many games have multiple NE (Battle of the Sexes, Stag Hunt, coordination games). Nash equilibrium doesn't tell us which NE will be played — refinements (focal points, backward induction, trembling-hand perfection) are needed. 3. Mixed strategy NE: players randomize over pure strategies. Every finite game has a mixed strategy NE (Nash's theorem).`,
    examTraps: [
      `A student might think Nash equilibrium is the best possible outcome for all players, but the correct answer is that NE is a stability condition — no unilateral deviation is profitable — not an optimality condition. The NE in a Prisoner's Dilemma (Defect, Defect) is stable but Pareto inferior to (Cooperate, Cooperate).`,
      `A student might think every game has exactly one Nash equilibrium, but the correct answer is that games can have zero, one, or multiple pure-strategy NE. The Battle of the Sexes has two NE; the Matching Pennies game has zero pure-strategy NE (but one mixed-strategy NE).`,
      `A student might think unilaterally changing from a NE can be beneficial if the other player also changes, but the correct answer is that NE is defined for UNILATERAL deviations — holding others' strategies fixed. If both change (joint deviation), the new outcome may be better (Pareto improvement from NE), but this requires coordination — which the Nash equilibrium framework does not assume.`
    ],
    frq: {
      prompt: `Two firms simultaneously choose an advertising level: High (H) or Low (L). Payoffs:\n      B: H      B: L\nA: H  (10, 10)  (25, 5)\nA: L  (5, 25)   (15, 15)`,
      parts: [
        `Find all pure-strategy Nash equilibria using the circle method. Show all work.`,
        `Is (H, H) a Nash equilibrium? Would either firm want to deviate? Explain.`,
        `Compare the Nash equilibrium outcome to the Pareto-efficient outcome. Is there a Pareto improvement available from the NE?`,
        `If this game is repeated many times, how might the outcome differ from the one-shot NE? What strategies could support the cooperative outcome?`
      ]
    }
  },
  flashcards: [
    { front: `Define Nash equilibrium formally.`, back: `A strategy profile s* = (s₁*, ..., sₙ*) is a Nash equilibrium if every player's strategy is a best response to all others' strategies: uᵢ(sᵢ*, s₋ᵢ*) ≥ uᵢ(sᵢ, s₋ᵢ*) for all sᵢ and all i. No player can improve their payoff by unilaterally changing their strategy. NE captures mutual best responses — stability against unilateral deviation.`, type: `definition` },
    { front: `How do you find Nash equilibria using the circle method?`, back: `(1) For each column, circle the ROW player's highest payoff in that column — this marks A's best responses. (2) For each row, circle the COLUMN player's highest payoff in that row — this marks B's best responses. (3) Any cell where BOTH entries are circled is a pure-strategy Nash equilibrium. Double-circled cells represent mutual best responses.`, type: `definition` },
    { front: `Distinguish: Nash equilibrium vs. dominant strategy equilibrium vs. Pareto efficient outcome.`, back: `Dominant strategy equilibrium: each player's NE strategy is best for them regardless of others (strongest rationality). Nash equilibrium: each player's strategy is best given what others are actually doing — weaker condition. Pareto efficient: no reallocation improves everyone's payoff — a welfare condition, not a strategic stability condition. A NE can be Pareto inefficient (Prisoner's Dilemma). A Pareto efficient outcome need not be a NE.`, type: `distinction` },
    { front: `Must every finite game have a Nash equilibrium?`, back: `Yes, in mixed strategies. Nash's theorem: every finite game (finite players, finite strategy sets) has at least one Nash equilibrium in mixed strategies. Pure-strategy NE may not exist (e.g., Matching Pennies has no pure-strategy NE). But adding mixed strategies (randomizing over pure strategies) always guarantees at least one NE.`, type: `condition` }
  ]
},

t129: {
  learn: {
    openingTension: `If an established airline threatens to price at $50/ticket to deter a new airline from entering, should the entrant believe this threat? The new airline knows that once it enters, the incumbent would prefer to accommodate at $200/ticket rather than fight at $50 and lose money. Empty threats don't deter rational players.`,
    coreIdea: `In sequential games, backward induction eliminates non-credible threats by solving the game tree from the final decision node backward, finding the subgame perfect Nash equilibrium — the strategy profile that specifies rational play at every node, including off-the-equilibrium-path nodes.`,
    mathSetup: `Sequential game in extensive form: nodes, branches, information sets, terminal payoffs. Backward induction: start at the last decision node, find the optimal action for the player moving there, substitute that payoff upward, repeat until the root. Result: subgame perfect Nash equilibrium (SPNE). Key concept: credible threats must be optimal to carry out when the time comes.`,
    derivation: `Entry deterrence game:\nNodes: Root (Entrant decides) → Branch: Enter or Stay Out.\nIf Stay Out: payoffs (Incumbent: 10, Entrant: 0). Game ends.\nIf Enter → Incumbent decides: Fight or Accommodate.\nIf Fight: payoffs (Incumbent: 0, Entrant: −1).\nIf Accommodate: payoffs (Incumbent: 5, Entrant: 3).\n\nBackward induction:\n1. At Incumbent's node (after Entrant enters): Fight gives 0, Accommodate gives 5. Incumbent chooses Accommodate.\n2. Substitute: if Entrant enters, outcome is (5, 3) — not (0, −1), because the threat to fight is non-credible.\n3. At Entrant's initial node: Enter gives 3 (from step 2), Stay Out gives 0. Entrant enters.\nSPNE: Entrant enters; Incumbent accommodates. Non-credible threat to fight is eliminated.`,
    graphicalIntuition: `Draw the game tree: root → Entrant's decision → if Enter, Incumbent's decision. At each terminal node, write (Incumbent payoff, Entrant payoff). Work backward from terminal nodes: replace each decision node with the payoff from the optimal action at that node. The path traced from root to terminal by always choosing the optimal action is the SPNE path.`,
    workedExample: `Entry game with specific payoffs:\nStay Out: (10, 0). Fight: (0, −1). Accommodate: (5, 3).\nBackward induction:\n- Incumbent's node: Accommodate (5) > Fight (0) → Incumbent accommodates.\n- Entrant's node: Enter (3) > Stay Out (0) → Entrant enters.\nSPNE: (Enter, Accommodate). Equilibrium payoffs: (5, 3).\nNote: (Stay Out, Fight) satisfies the basic Nash equilibrium definition (Entrant won't deviate given the threat, Incumbent doesn't need to act given Stay Out). But (Stay Out, Fight) relies on the Incumbent's off-path threat to fight — which is non-credible. SPNE refines Nash equilibrium by requiring credibility at every node.`,
    boundaryConditions: `1. Commitment solves the credibility problem: if the Incumbent can commit to Fighting before the Entrant moves (e.g., by sinking costs into excess capacity), the threat becomes credible and deters entry. 2. First-mover advantage: in sequential games, the first mover often gains by restricting the opponent's options. But this is not universal — some games give second-mover advantage. 3. Perfect information assumption: backward induction requires each player to observe the entire history of play (perfect information). Imperfect information requires more complex solution concepts.`,
    examTraps: [
      `A student might accept any Nash equilibrium in a sequential game as valid, but the correct answer is that sequential games require the SPNE refinement — NE strategies must be optimal at every subgame, not just on the equilibrium path. A NE that relies on a non-credible off-path threat (like "I'll fight if you enter") is not subgame perfect.`,
      `A student might think the first mover always has an advantage in sequential games, but the correct answer is that first-mover advantages and disadvantages both exist depending on the game structure. In commitment games, the first mover can commit to an aggressive strategy that deters rivals. In other games, moving first reveals information that the second mover can exploit.`,
      `A student might confuse backward induction with finding the highest joint payoff, but the correct answer is that backward induction finds individual best responses working backward, which may or may not coincide with the Pareto-efficient outcome.`
    ],
    frq: {
      prompt: `Firm A (incumbent) and Firm B (entrant) play a sequential game. Firm B first decides to Enter or Stay Out. If Firm B enters, Firm A decides to Cut Price (aggressive) or Maintain Price (cooperative). Payoffs: Stay Out: (A: 8, B: 0). Cut Price: (A: 2, B: −1). Maintain Price: (A: 4, B: 3).`,
      parts: [
        `Draw the game tree with payoffs at each terminal node.`,
        `Apply backward induction to find the subgame perfect Nash equilibrium. State the optimal action at each node.`,
        `Firm A threatens to cut price if Firm B enters. Is this threat credible? Explain.`,
        `If Firm A could commit to cutting price before Firm B makes its entry decision (e.g., by investing in excess capacity), how would this change the equilibrium? What is the economic significance of commitment?`
      ]
    }
  },
  flashcards: [
    { front: `What is backward induction and when is it used?`, back: `Backward induction is a solution method for sequential games in extensive form: start at the last decision node, identify the optimal action for the player there, substitute that payoff one level up, and repeat until the root. It identifies the subgame perfect Nash equilibrium — the strategy profile that specifies rational play at every decision node, including those off the equilibrium path.`, type: `definition` },
    { front: `What is a subgame perfect Nash equilibrium (SPNE)?`, back: `A strategy profile that constitutes a Nash equilibrium in every subgame of the original game — including subgames that are never reached in equilibrium. SPNE eliminates Nash equilibria that rely on non-credible threats: if a player threatens an action that would be suboptimal to carry out when the time comes, SPNE ignores that threat. Backward induction identifies SPNE in finite games of perfect information.`, type: `definition` },
    { front: `What is a non-credible threat and why does it fail in SPNE?`, back: `A non-credible threat is a strategy claiming a player will take an action that would be suboptimal when the time comes. Example: an incumbent threatens to price aggressively if a firm enters, but would prefer to accommodate once entry occurs. A rational entrant knows the incumbent will accommodate, so the threat doesn't deter entry. SPNE eliminates such threats by requiring that every player's strategy be optimal at every node.`, type: `definition` },
    { front: `Does the first mover always have an advantage in sequential games?`, back: `No. First-mover advantage exists when committing first restricts the opponent's profitable options — e.g., Stackelberg leader produces more, limiting the follower. First-mover disadvantage exists when moving first reveals information the second mover exploits — e.g., Bertrand-like games where the first mover's price is undercut. The direction of the advantage depends on the strategic structure (strategic substitutes vs. complements).`, type: `condition` }
  ]
},

t130: {
  learn: {
    openingTension: `Two oil companies each control half of a small country's reserves. Each sets its own production quantity simultaneously, knowing that their combined output determines the market price. How much does each produce? Is the outcome closer to monopoly or to perfect competition?`,
    coreIdea: `In Cournot competition, each firm simultaneously chooses quantity treating the rival's quantity as fixed, leading to a Nash equilibrium where both firms produce more than a monopolist but less than competitors — a solution found by intersecting the two firms' reaction functions.`,
    mathSetup: `Duopoly with inverse demand P = a − b(q₁ + q₂). Firm i's profit: πᵢ = [P − c]·qᵢ = [a − b(q₁ + q₂) − c]·qᵢ. FOC for firm 1: dπ₁/dq₁ = a − 2bq₁ − bq₂ − c = 0 → q₁* = (a−c)/(2b) − q₂/2. Reaction function 1: q₁ = R₁(q₂) = (a−c)/(2b) − q₂/2. By symmetry: q₂ = R₂(q₁) = (a−c)/(2b) − q₁/2. Solve simultaneously: q₁* = q₂* = (a−c)/(3b). Total: Q_C = 2(a−c)/(3b). Price: P_C = a − b·Q_C = a − 2(a−c)/3 = (a+2c)/3.`,
    derivation: `Full derivation for P = 120 − Q, MC = c = 30:\n1. Firm 1's profit: π₁ = (120 − q₁ − q₂ − 30)q₁ = (90 − q₁ − q₂)q₁.\n2. FOC: dπ₁/dq₁ = 90 − 2q₁ − q₂ = 0 → q₁ = (90 − q₂)/2. Reaction function R₁(q₂) = 45 − q₂/2.\n3. By symmetry: R₂(q₁) = 45 − q₁/2.\n4. Solve simultaneously: q₁ = 45 − q₂/2 and q₂ = 45 − q₁/2.\nSubstitute R₂ into R₁: q₁ = 45 − (45 − q₁/2)/2 = 45 − 22.5 + q₁/4 → (3/4)q₁ = 22.5 → q₁* = 30.\nBy symmetry: q₂* = 30. Total: Q* = 60. Price: P* = 120 − 60 = $60.\n5. Profit per firm: π₁ = (60 − 30)·30 = $900.\n6. Comparison to benchmarks:\n   Monopoly: MR = 120 − 2Q = 30 → Q_M = 45, P_M = 75, π_M = 2,025.\n   Competition: P = MC → Q_C = 90, P_C = 30, π_C = 0.\n   Cournot: Q_Cournot = 60, between 45 and 90. P_Cournot = $60, between $30 and $75. Each firm earns $900 vs. monopoly's $2,025 combined (each duopolist earns $1,012.50 if they split monopoly output 22.5 each at P=75: π = 45×22.5 = $1,012.50). Cournot output is 2/3 of competitive.`,
    graphicalIntuition: `Reaction function diagram: q₁ on vertical axis, q₂ on horizontal axis. R₁(q₂) is a downward-sloping line: as q₂ rises, optimal q₁ falls (strategic substitutes). R₂(q₁) is also downward-sloping. Cournot NE: intersection of the two reaction functions — the point (q₁*, q₂*) where both firms are simultaneously best-responding. The 45° line shows symmetric outcomes; Cournot NE lies on the 45° line for symmetric duopoly.`,
    workedExample: `Worked example above (in derivation): P = 120 − Q, MC = 30.\nMonopoly: Q_M = 45, P_M = $75, π_M = $2,025 (if a single firm).\nCournot NE: q₁* = q₂* = 30, Q = 60, P* = $60, π per firm = $900, π total = $1,800.\nCompetitive: Q_C = 90, P_C = $30, π = 0.\nPattern: Q_M < Q_Cournot < Q_C and P_C < P_Cournot < P_M.\nDWL of Cournot = area between demand and MC for Q from 60 to 90: (1/2)(60−30)(90−60) = $450. Smaller than monopoly DWL but larger than zero (competition).`,
    boundaryConditions: `1. Cournot equilibrium with n firms: q* = (a−c)/[(n+1)b], Q* = n(a−c)/[(n+1)b]. As n → ∞: Q* → (a−c)/b = competitive output. As n = 1: Q* = (a−c)/(2b) = monopoly output. 2. Assumes constant MC = c; with asymmetric costs, solve reaction functions for each firm using their own MC. 3. Bertrand critique: if firms compete in prices rather than quantities, even two firms achieve the competitive outcome. 4. Stackelberg: if one firm moves first (leader), it produces more than Cournot; the follower produces less.`,
    examTraps: [
      `A student might think Cournot firms produce the monopoly quantity, but the correct answer is that Cournot total output exceeds monopoly output — each firm treats the rival's output as fixed and ignores the negative effect of its own production on the rival's profits, leading to overproduction relative to monopoly.`,
      `A student might think Cournot firms choose price, but the correct answer is that Cournot firms choose QUANTITY, and price is determined by the market demand function given total quantity. This is the key distinction from Bertrand competition, where firms choose price directly.`,
      `A student might think the Cournot equilibrium is efficient, but the correct answer is that P_Cournot > MC — there is still deadweight loss from underproduction relative to the competitive outcome. Cournot is between monopoly (worst) and competition (best) in efficiency.`
    ],
    frq: {
      prompt: `Two oil firms face market demand P = 150 − Q, where Q = q₁ + q₂. Both have MC = AC = 30.`,
      parts: [
        `Derive firm 1's reaction function. Show all steps including the FOC. Derive firm 2's reaction function by symmetry.`,
        `Solve the system of reaction functions to find the Cournot Nash equilibrium quantities, price, and profit per firm.`,
        `Find the monopoly outcome (what would a single firm produce?) and the competitive outcome (P = MC). Compare all three: monopoly, Cournot, and competition on Q, P, and total industry profit.`,
        `With three Cournot firms (all identical, MC = 30), use the n-firm Cournot formula to find Q*, P*, and profit per firm. What happens as n → ∞?`
      ]
    }
  },
  flashcards: [
    { front: `What is Cournot competition?`, back: `An oligopoly model where firms simultaneously and independently choose quantities, taking rivals' quantities as fixed. Price is determined by total output via the inverse demand function. The Nash equilibrium is found where each firm's quantity is a best response to the other's — at the intersection of reaction functions. Industry output is between the monopoly and competitive levels.`, type: `definition` },
    { front: `Derive the reaction function for a Cournot duopolist with P = a − b(q₁+q₂) and MC = c.`, back: `Firm 1's profit: π₁ = (a − bq₁ − bq₂ − c)q₁. FOC: dπ₁/dq₁ = a − 2bq₁ − bq₂ − c = 0. Solving: q₁ = (a−c)/(2b) − q₂/2 = R₁(q₂). This is the reaction function — firm 1's optimal quantity decreases one-for-one with half of firm 2's quantity. Slope = −1/2 reflects strategic substitutability.`, type: `definition` },
    { front: `What is the Cournot Nash equilibrium for symmetric duopoly with P = a − bQ and MC = c?`, back: `Solve R₁ = R₂ simultaneously: q₁* = q₂* = (a−c)/(3b). Total Q* = 2(a−c)/(3b). Price P* = (a+2c)/3. Profit per firm = (a−c)²/(9b). Total Cournot output = 2/3 of competitive output (a−c)/b; 4/3 of monopoly output (a−c)/(2b). Price is between competitive (c) and monopoly ((a+c)/2).`, type: `definition` },
    { front: `Compare Cournot, monopoly, and competitive outcomes on price and quantity.`, back: `Competitive: Q_C = (a−c)/b, P_C = c (= MC), π = 0. Monopoly: Q_M = (a−c)/(2b), P_M = (a+c)/2, π_M = (a−c)²/(4b). Cournot (duopoly): Q = 2(a−c)/(3b), P = (a+2c)/3, π per firm = (a−c)²/(9b). Ordering: Q_M < Q_Cournot < Q_C and P_C < P_Cournot < P_M. Cournot lies between monopoly and competition.`, type: `condition` },
    { front: `What does the reaction function slope tell us about Cournot competition?`, back: `Slope = −1/2: if firm 2 increases its quantity by 2, firm 1's optimal response is to decrease by 1. Quantities are strategic substitutes — each firm's optimal quantity decreases as the rival produces more (because more rival output lowers price, making the market less profitable for any given quantity). This downward slope means reaction functions cross — the Cournot NE exists and is unique for symmetric demand and costs.`, type: `condition` },
    { front: `How does Cournot equilibrium change as the number of firms n increases?`, back: `With n symmetric Cournot firms: q* = (a−c)/[(n+1)b], Q* = n(a−c)/[(n+1)b], P* = (a + nc)/(n+1). As n → ∞: Q* → (a−c)/b (competitive output), P* → c (= MC). As n = 1: Q* = (a−c)/(2b) (monopoly). Cournot approaches competition as n rises — the oligopoly converges to the competitive outcome with many firms.`, type: `condition` },
    { front: `Why does each Cournot firm produce more than the monopoly output per firm?`, back: `If the two firms colluded, each would produce q_M/2 = (a−c)/(4b) (half the monopoly quantity). But in Cournot, each firm's best response to the rival producing q_M/2 is to produce more than q_M/2 — the firm ignores the negative externality its production imposes on the rival's profit. This over-production relative to collusion is exactly why Cournot output > monopoly output. Each firm free-rides on the other's restraint.`, type: `condition` },
    { front: `What is the difference between Cournot and Bertrand competition?`, back: `Cournot: firms choose quantities simultaneously; price is determined by total output via demand. Equilibrium: P > MC, positive profit for each firm, industry output between monopoly and competition. Bertrand: firms choose prices simultaneously; the low-price firm captures the market. Equilibrium: P = MC, zero profit (Bertrand paradox) — even two firms achieve the competitive outcome. Same market structure; different strategic variable → dramatically different predictions.`, type: `distinction` },
    { front: `What is the Bertrand paradox?`, back: `Under Bertrand price competition with homogeneous goods and constant MC, even two firms compete to the competitive outcome: P* = MC, π = 0. The paradox: two firms seem "competitive" in price even with only a duopoly. Intuition: any firm pricing above MC is undercut by the rival; undercutting continues until P = MC. The result fails if goods are differentiated (each firm has local monopoly power) or if capacity constraints prevent serving the whole market.`, type: `definition` }
  ]
},

t131: {
  learn: {
    openingTension: `Cournot predicted that two firms would share a market and earn positive profit. Bertrand predicted two firms competing to zero profit, the same as a perfectly competitive market. Both assume only two firms. How can the same market structure produce such different outcomes?`,
    coreIdea: `In Bertrand competition, firms simultaneously set prices rather than quantities; with homogeneous goods and constant marginal cost, undercutting drives prices to marginal cost even with only two firms — the Bertrand paradox.`,
    mathSetup: `Two firms simultaneously set prices p₁ and p₂. Demand: all buyers go to the lowest-price firm; if equal, split equally. Payoffs: if pᵢ < p_j: firm i earns (pᵢ − c)·D(pᵢ); firm j earns 0. If pᵢ = p_j = p: each earns (p − c)·D(p)/2. Nash equilibrium: p₁* = p₂* = MC = c. Profit = 0. Proof: any p > c can be undercut by ε, capturing the whole market. This continues until p = c.`,
    derivation: `1. Suppose both firms charge p > c. Firm 1 can undercut to p − ε, capturing the whole market and earning (p − ε − c)·D(p − ε) → (p − c)·D(p) as ε → 0. This is approximately double each firm's current profit. So each firm wants to undercut. 2. The undercutting continues until p = c. At p = c, neither firm can profitably undercut (would earn negative profit). 3. At p = c = MC: neither firm wants to deviate. It is a Nash equilibrium. 4. Paradox: two firms suffice for the competitive outcome — standard industrial organization intuition says "few firms = market power," but Bertrand shows this is not inevitable.`,
    graphicalIntuition: `In Bertrand, there is no quantity-choosing reaction function diagram. Instead, consider the best-response pricing: if pⱼ > c, firm i's best response is to set pᵢ = pⱼ − ε (slightly undercut). If pⱼ = c, firm i's best response is also pᵢ = c (cannot profitably go lower). This gives a unique NE at (c, c). The Bertrand outcome lies on the competitive end of the Cournot spectrum.`,
    workedExample: `P = 120 − Q, MC = 30 for both firms. Bertrand outcome: p* = MC = 30. Q* = 120 − 30 = 90. Profit per firm = 0. Compare to Cournot: p* = $60, Q* = 60, π per firm = $900. Bertrand achieves competitive quantity and zero profit with only two firms. The strategic variable (price vs. quantity) completely changes the outcome.`,
    boundaryConditions: `1. Bertrand paradox disappears with: (a) product differentiation — firms have local monopoly power and p > MC; (b) capacity constraints — if each firm can serve only half the market, undercutting loses its appeal because the undercutter can't serve all demand; (c) dynamic competition — repeated interaction with switching costs allows sustained prices above MC. 2. Bertrand with asymmetric costs: the low-cost firm sets p slightly below the rival's MC and captures the entire market; rival earns zero. 3. Edgeworth cycles: with capacity constraints, Bertrand equilibrium may not exist — prices cycle up and down continuously.`,
    examTraps: [
      `A student might think Bertrand competition with two firms leaves DWL equal to Cournot, but the correct answer is that Bertrand achieves P = MC, so DWL = 0 — the same as perfect competition. Bertrand with homogeneous goods and no capacity constraints is perfectly efficient even with two firms.`,
      `A student might think Bertrand and Cournot competition differ only in the number of firms, but the correct answer is that they differ in the STRATEGIC VARIABLE: Cournot firms choose quantities simultaneously; Bertrand firms choose prices. With the same number of firms and costs, Bertrand is more competitive (P = MC) while Cournot yields P > MC.`,
      `A student might think Bertrand is more realistic than Cournot, but the correct answer is that neither is universally more realistic. Cournot is more appropriate when firms set capacities first (e.g., airlines adding routes, utilities building plants); Bertrand is more appropriate when firms can costlessly adjust prices and capacity is flexible.`
    ],
    frq: {
      prompt: `Two firms compete in a market for homogeneous software. Demand: P = 200 − Q. Both have MC = 20 with no fixed costs.`,
      parts: [
        `Find the Bertrand Nash equilibrium price and quantity. Calculate profit for each firm.`,
        `Find the Cournot Nash equilibrium price, quantity, and profit per firm.`,
        `Why does the Bertrand model predict zero profit with two firms, when Cournot predicts substantial profit? What assumption drives this difference?`,
        `Describe one modification to the Bertrand model that would allow prices above MC even with two firms. Explain the mechanism.`
      ]
    }
  },
  flashcards: [
    { front: `State the Bertrand paradox.`, back: `With two firms selling homogeneous goods and having the same constant MC, Bertrand price competition leads to P = MC and zero economic profit — the same outcome as perfect competition, even with only two firms. The paradox: "few firms = market power" is a common intuition, but Bertrand shows that competition in prices can eliminate all market power regardless of the number of firms (≥ 2).`, type: `definition` },
    { front: `Why is the Bertrand equilibrium P = MC?`, back: `Any p > MC can be profitably undercut: a firm setting p − ε captures the whole market and earns nearly double its current profit. Undercutting continues until p = MC. At p = MC, undercutting earns negative profit, so neither firm deviates. P = MC is the unique Nash equilibrium in Bertrand price competition with homogeneous goods and identical, constant MC.`, type: `condition` },
    { front: `Distinguish Cournot from Bertrand competition.`, back: `Cournot: firms choose quantities simultaneously; price adjusts via demand to clear the market. Equilibrium: P > MC, positive profit. Bertrand: firms choose prices simultaneously; the lower-priced firm serves the market. Equilibrium: P = MC, zero profit. Same cost structure, same demand — but choice of strategic variable (quantity vs. price) produces dramatically different market outcomes. Capacity constraints blur the distinction.`, type: `distinction` },
    { front: `When does the Bertrand paradox break down?`, back: `(1) Product differentiation: firms sell imperfect substitutes, so undercutting doesn't capture the entire market. P > MC possible. (2) Capacity constraints: if each firm can only serve part of the market, the undercutter can't capture all demand; prices above MC can be sustained. (3) Repeated interaction: firms may sustain prices above MC through threat of future undercutting (trigger strategies). (4) Switching costs: consumers don't instantly move to the cheaper firm.`, type: `condition` }
  ]
},

t132: {
  learn: {
    openingTension: `OPEC members collectively agree to cut oil production to raise prices. Every member benefits if all comply. But each individual member can earn more by secretly producing above its quota while others hold back. What keeps OPEC together — and what tears it apart?`,
    coreIdea: `A cartel is a group of firms that coordinate output and pricing to maximize joint profit as if they were a single monopolist, but the cartel is inherently unstable because each member individually benefits from cheating on the agreement.`,
    mathSetup: `Cartel maximizes joint profit: π_total = [P(Q) − c]·Q, solved as if a monopolist. Each firm's quota: q_i = Q_M/n (equal split). Per-firm cartel profit: π_cartel = π_M/n. Incentive to cheat: given other firms produce Q_M − q_i = Q_M(n−1)/n, firm i's best response is to produce its Cournot best-reply quantity — more than its quota. Firm i's profit from cheating > π_M/n: the individual gain from defection exceeds the cartel share.`,
    derivation: `With P = 120 − Q, MC = 30, n = 2 firms:\nCartel: Q_M = 45, P_M = 75. Each firm's quota: q = 22.5. Cartel profit per firm: (75−30)×22.5 = $1,012.50.\nIncentive to cheat: take other firm's output = 22.5 as given. Best response: q₁ = 45 − q₂/2 = 45 − 22.5/2 = 33.75 (from Cournot reaction function). If firm 1 produces 33.75, total Q = 56.25, P = 120 − 56.25 = 63.75. Firm 1 profit = (63.75 − 30)×33.75 = $1,139.06 > $1,012.50. Cheating is individually profitable. Both firms cheat → Cournot equilibrium: q₁ = q₂ = 30, π = $900 < $1,012.50. Paradox: both lose by cheating, but each is individually rational to do so.`,
    graphicalIntuition: `The cartel-vs.-cheat structure is a Prisoner's Dilemma: (Cooperate, Cooperate) = cartel outcome with π_M/n per firm; (Defect, Cooperate) = cheat while partner holds back (highest individual payoff); (Cooperate, Defect) = sucker's payoff; (Defect, Defect) = Cournot equilibrium. Cartel cooperation is not individually rational in a one-shot game; it can be sustained in repeated games through trigger strategies.`,
    workedExample: `(Included in derivation above.) Key numbers: Cartel profit/firm = $1,012.50; Cheat profit ≈ $1,139; Cournot (both cheat) = $900. This is a classic Prisoner's Dilemma: each firm prefers to cheat regardless of what the other does, but both end up worse off (Cournot) than if they had cooperated (cartel).`,
    boundaryConditions: `1. Repeated games sustain cooperation: with infinite repetition and low enough discount rates, firms can sustain the cartel via grim trigger strategy (Cooperate until any defection, then Cournot forever). Condition: π_M/n/(1−δ) ≥ π_deviate + δ·π_Cournot/(1−δ), where δ is the discount factor. 2. More firms → less stable cartel: with more members, each firm's quota share is smaller and the incentive to cheat (gain from deviation) is larger relative to the loss if detected. 3. Legal constraints: explicit cartels are illegal in most jurisdictions under antitrust law. Tacit collusion (without explicit agreement) is harder to detect and prosecute.`,
    examTraps: [
      `A student might think a cartel maximizes each individual firm's profit, but the correct answer is that a cartel maximizes joint (total industry) profit, which is then divided among members. Each individual firm would earn more than its cartel share by cheating — the tension between individual and joint rationality defines the instability.`,
      `A student might think the Cournot equilibrium is the cartel outcome, but the correct answer is that the cartel produces the monopoly output (Q_M < Q_Cournot), and each firm earns more than the Cournot profit per firm under the cartel (π_M/n > π_Cournot per firm). If cartel breaks down, the outcome reverts to Cournot, which is worse for everyone.`,
      `A student might think cartels are always stable if members can communicate, but the correct answer is that communication is necessary but not sufficient for cartel stability. Even with full communication, the short-run incentive to cheat exists — communication must be backed by enforcement (detection, punishment) to sustain cooperation.`
    ],
    frq: {
      prompt: `Two firms in a cartel face demand P = 200 − Q and MC = 40 for both.`,
      parts: [
        `Find the cartel (monopoly) quantity and price. Calculate each firm's cartel profit.`,
        `Show that each firm has an individual incentive to cheat. Use the Cournot reaction function to find the best deviation quantity and profit.`,
        `If both firms cheat, what is the Cournot equilibrium? Compare it to the cartel outcome.`,
        `Describe the grim trigger strategy. Under what condition (involving the discount factor δ) can grim trigger sustain the cartel in an infinitely repeated game?`
      ]
    }
  },
  flashcards: [
    { front: `What is a cartel and what output does it produce?`, back: `A cartel is a group of firms that coordinate to maximize joint profit — acting as if they were a single monopolist. The cartel sets total output at Q_M (monopoly quantity) and divides it among members. Cartel profit per firm > Cournot profit per firm, but each firm has a unilateral incentive to produce above its quota. Cartels are illegal under antitrust law in most jurisdictions.`, type: `definition` },
    { front: `Why is a cartel unstable in a one-shot game?`, back: `Each firm's best response to all rivals producing their cartel quotas is to produce MORE than its own quota (as shown by the Cournot reaction function). The gain from cheating (while others comply) exceeds the cartel share. If all firms cheat, the cartel collapses to Cournot equilibrium, which is worse for everyone. The cartel has a Prisoner's Dilemma structure — individual rationality undermines collective rationality.`, type: `condition` },
    { front: `How can cartel stability be sustained in a repeated game?`, back: `Grim trigger strategy: cooperate each period; if any firm cheats, all firms revert to Cournot forever. Cartel is sustainable if the present value of staying in the cartel exceeds the value of one-time cheating plus permanent Cournot: π_M/(n(1−δ)) ≥ π_deviate + δ·π_Cournot/(1−δ). Sustainability requires: (1) high discount factor δ (patient firms value the future), (2) few firms, (3) easy detection of cheating.`, type: `condition` },
    { front: `Distinguish: cartel outcome vs. Cournot outcome vs. competitive outcome.`, back: `Cartel: Q_M (monopoly output), P_M > P_Cournot, π per firm > π_Cournot — but individually unstable. Cournot: Q between Q_M and Q_C, P between P_C and P_M, positive profit — the noncooperative equilibrium. Competition: Q_C, P = MC, π = 0 — socially efficient. Ordering: Q_M < Q_Cournot < Q_C and P_C < P_Cournot < P_M. Cartel is best for firms, worst for consumers; competition is best for consumers, eliminates firm profit.`, type: `distinction` }
  ]
},

};

for (const unit of course.units) {
  for (const topic of unit.topics) {
    if (learnData[topic.id]) {
      const data = learnData[topic.id];
      topic.learn = data.learn;
      if (data.flashcards !== undefined) {
        topic.flashcards = data.flashcards;
      }
    }
  }
}

fs.writeFileSync(filePath, JSON.stringify(course, null, 2));
console.log('Done! Added t123-t132.');
