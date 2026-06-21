#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'content', 'courses', 'econ-301', 'course.json');
const course = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const learnData = {

t115: {
  learn: {
    openingTension: `A competitive firm that raises its price loses every customer instantly. A monopolist that raises its price loses only some customers. What structural difference produces this power, and why can't competition eliminate it?`,
    coreIdea: `A monopolist is the sole seller in a market and faces the entire downward-sloping market demand curve, giving it price-setting power — it chooses a price-quantity combination on the demand curve, not a quantity given an exogenous price.`,
    mathSetup: `Monopolist faces inverse demand P(Q). Total revenue: TR(Q) = P(Q)·Q. Marginal revenue: MR(Q) = dTR/dQ = P + Q·(dP/dQ) < P (since dP/dQ < 0). Profit: π(Q) = TR(Q) − C(Q). Profit-maximizing condition: MR(Q*) = MC(Q*). Price set from demand: P* = P(Q*). Profit: π* = (P* − AC(Q*))·Q*.`,
    derivation: `1. Unlike a competitive firm (MR = P), the monopolist faces a downward-sloping demand. To sell one more unit, it must lower the price on ALL units. So MR < P. 2. Maximize profit: set MR = MC. This gives Q*. 3. Read price from demand curve at Q*: P* = P(Q*). 4. The monopolist does not produce at P = MC — it restricts output below the competitive level, raising price above MC. 5. This gap (P > MC) means the last unit consumed is valued more than it costs to produce — a welfare loss.`,
    graphicalIntuition: `On a diagram with downward-sloping demand and its associated MR curve (which lies below demand for all Q > 0), the monopolist produces at Q* where MR = MC. Price is read from the demand curve at Q*, giving P* > MC. The DWL triangle is the area between demand and MC for units Q* to Q_c (competitive output). Monopoly profit rectangle: (P* − AC)·Q*.`,
    workedExample: `Demand: P = 100 − Q. MC = AC = 20 (constant). Find monopoly outcome.\nMR = 100 − 2Q. Set MR = MC: 100 − 2Q = 20 → Q* = 40. P* = 100 − 40 = $60.\nProfit = (60 − 20)·40 = $1,600. Competitive: P = MC → 100 − Q = 20 → Q_c = 80, P_c = $20.\nDWL = (1/2)(60 − 20)(80 − 40) = $800.\nInterpret: Monopolist produces 40 vs. competitive 80 — half the output at three times the price. $800 of surplus is destroyed.`,
    boundaryConditions: `1. Barriers to entry are required for monopoly to persist: patents, licenses, control of key inputs, large sunk costs, or natural monopoly (declining AC). Without barriers, positive profit attracts entry that erodes market power. 2. Monopsony: a single buyer — the mirror image of monopoly on the demand side, restricting quantity purchased below the competitive level. 3. Potential competition: even a monopolist may price below the pure monopoly price if the threat of entry constrains it (contestable markets theory).`,
    examTraps: [
      `A student might think a monopolist has no supply curve, but technically correct — monopolists don't have a supply curve in the usual sense because price is set from demand at the profit-maximizing quantity, not taken as given. The relationship between P and Q depends on the entire demand curve, not just a supply function.`,
      `A student might think a monopolist always earns positive profit, but the correct answer is that a monopolist can earn negative profit if AC > P* at Q*. Monopoly power means P > MC, not necessarily P > AC. The monopolist still minimizes losses by setting MR = MC.`,
      `A student might think the monopolist produces where demand is inelastic, but the correct answer is that the monopolist always produces in the elastic region of demand (|ε| > 1). When |ε| < 1, MR < 0, so any output in that region has MR < MC, and the monopolist raises profit by reducing output.`
    ],
    frq: {
      prompt: `A monopolist faces demand P = 80 − 0.5Q and has total cost C(Q) = 0.5Q² + 10Q.`,
      parts: [
        `Derive MR and MC. Find the profit-maximizing quantity and price.`,
        `Calculate profit. Calculate the competitive equilibrium price and quantity.`,
        `Calculate deadweight loss from monopoly.`,
        `Explain why the monopolist does not produce at P = MC. What is the social cost of this decision?`
      ]
    }
  },
  flashcards: [
    { front: `What distinguishes a monopolist from a competitive firm in its price-setting ability?`, back: `A competitive firm is a price-taker — it faces a horizontal demand curve and takes market price as given. A monopolist faces the entire downward-sloping market demand curve and can choose any point on it. By restricting output, the monopolist raises price above marginal cost. This price-setting power arises from being the sole seller with no close substitutes.`, type: `distinction` },
    { front: `Why does a monopolist never produce in the inelastic region of demand?`, back: `When demand is inelastic (|ε| < 1), marginal revenue is negative — selling another unit reduces total revenue. Since MC ≥ 0, MR = MC cannot hold when MR < 0. The monopolist can always raise profit by reducing output (which raises price and reduces quantity, increasing TR when demand is inelastic). Monopoly production always occurs where |ε| > 1.`, type: `condition` },
    { front: `What is the monopoly profit formula?`, back: `π* = (P* − AC(Q*))·Q*. The profit per unit is the gap between price and average cost at the profit-maximizing quantity, multiplied by total output. This equals total revenue minus total cost. When P* > AC, the firm earns positive profit. The profit rectangle on the diagram has height (P* − AC) and width Q*.`, type: `definition` }
  ]
},

t116: {
  learn: {
    openingTension: `A monopolist wants to sell one more unit. To do so, it must lower its price — not just for the new unit, but for every unit it was already selling. So the extra revenue from selling one more unit is less than the price of that unit. By how much exactly?`,
    coreIdea: `Marginal revenue for a monopolist equals price minus the revenue lost by reducing price on all existing units — formally derived via the chain rule on total revenue — giving MR = P + Q·(dP/dQ), which is always below the demand curve for downward-sloping demand.`,
    mathSetup: `Total revenue: TR(Q) = P(Q)·Q. By the product rule: MR(Q) = dTR/dQ = d[P(Q)·Q]/dQ. Applying the chain rule (product rule): MR = P(Q)·(dQ/dQ) + Q·(dP/dQ) = P + Q·(dP/dQ). Since demand slopes downward, dP/dQ < 0, so Q·(dP/dQ) < 0. Therefore MR < P for all Q > 0.`,
    derivation: `Step-by-step chain rule derivation:\n1. TR(Q) = P(Q) · Q. This is a product of two functions of Q.\n2. Apply the product rule: d[f·g]/dQ = f·(dg/dQ) + g·(df/dQ), where f = P(Q) and g = Q.\n3. df/dQ = dP/dQ (the slope of the inverse demand). dg/dQ = 1.\n4. Therefore: MR = P(Q)·1 + Q·(dP/dQ) = P + Q·(dP/dQ).\n5. Economic interpretation: the first term P is the revenue gained from selling the marginal unit at price P. The second term Q·(dP/dQ) is negative — the revenue LOST because all Q existing units must now be sold at the lower price (dP/dQ < 0 times Q units).\n6. For linear demand P = a − bQ: dP/dQ = −b, so MR = (a − bQ) + Q·(−b) = a − bQ − bQ = a − 2bQ. The MR curve has the same intercept as demand but twice the slope — it bisects the horizontal distance between the demand curve and the vertical axis.`,
    graphicalIntuition: `For linear inverse demand P = a − bQ, the MR curve is MR = a − 2bQ. Both start at P = a when Q = 0, but MR falls twice as steeply. At every Q > 0, the MR curve lies below the demand curve. The MR curve hits zero (MR = 0) at Q = a/(2b), which is exactly the midpoint of the demand curve. The horizontal gap between demand and MR at any given price doubles as Q doubles.`,
    workedExample: `Given: P = 120 − 2Q. Derive MR and compare to demand slope.\nStep 1: TR = P·Q = (120 − 2Q)·Q = 120Q − 2Q².\nStep 2: MR = dTR/dQ = 120 − 4Q. (Chain rule: d[120Q]/dQ − d[2Q²]/dQ = 120 − 4Q.)\nAlternatively, MR = P + Q·(dP/dQ) = (120 − 2Q) + Q·(−2) = 120 − 2Q − 2Q = 120 − 4Q. ✓\nDemand slope: dP/dQ = −2. MR slope: dMR/dQ = −4. MR slope is twice as steep.\nAt Q = 20: P = 80, MR = 40. The revenue from the 21st unit is $40, but the selling price is $80 — the gap ($40) is the loss on the first 20 units due to the lower price needed to sell 21.`,
    boundaryConditions: `1. For a price-taking competitive firm, dP/dQ = 0 (the firm faces horizontal demand), so MR = P + Q·0 = P. This confirms MR = P for a price-taker as a special case of the same formula. 2. MR can be expressed in terms of elasticity: MR = P·(1 + 1/ε), where ε = (dQ/dP)·(P/Q) < 0. When |ε| → ∞ (perfectly elastic), MR → P. When ε = −1 (unit elastic), MR = 0. 3. For non-linear demand, MR is derived the same way but the MR curve is not a straight line.`,
    examTraps: [
      `A student might think MR = P/Q or MR = P·ΔQ, but the correct answer is MR = dTR/dQ = P + Q·(dP/dQ). The chain rule derivation shows MR depends on both the price and the rate at which price changes with quantity. Confusing MR with average revenue (AR = TR/Q = P) is the most common error.`,
      `A student might think the MR curve intersects the demand curve at some positive quantity, but the correct answer is that MR starts at the same intercept as demand (when Q = 0, MR = P = a) but lies strictly below demand for all Q > 0. They do not intersect except at Q = 0.`,
      `A student might think MR is always positive, but the correct answer is that MR turns negative when |ε| < 1 (inelastic demand). At the midpoint of linear demand, MR = 0. To the right of the midpoint, MR < 0 and TR is declining. The monopolist never operates there.`
    ],
    frq: {
      prompt: `A monopolist faces inverse demand P = 90 − 3Q.`,
      parts: [
        `Use the chain rule (product rule) to derive the MR function from TR = P(Q)·Q. Show every step explicitly.`,
        `Verify your answer using the formula MR = P + Q·(dP/dQ).`,
        `At what quantity does MR = 0? What is the price elasticity of demand at this point?`,
        `Explain in words why MR < P for a monopolist. What economic force creates this wedge?`
      ]
    }
  },
  flashcards: [
    { front: `Derive MR for a monopolist using the product rule.`, back: `TR(Q) = P(Q)·Q. MR = dTR/dQ. Product rule: d[P(Q)·Q]/dQ = P·(dQ/dQ) + Q·(dP/dQ) = P + Q·(dP/dQ). Since dP/dQ < 0 for downward-sloping demand, Q·(dP/dQ) < 0, so MR < P. First term: revenue from marginal unit. Second term: revenue lost on all inframarginal units from the price reduction needed to sell more.`, type: `definition` },
    { front: `For linear inverse demand P = a − bQ, what is MR?`, back: `MR = a − 2bQ. Derivation: TR = (a − bQ)Q = aQ − bQ². MR = dTR/dQ = a − 2bQ. MR has the same intercept (a) as demand but twice the slope (−2b vs −b). The MR curve bisects the horizontal distance between the demand curve and the vertical axis at any price level.`, type: `definition` },
    { front: `What is the relationship between MR and price elasticity of demand?`, back: `MR = P(1 + 1/ε), where ε = (dQ/dP)(P/Q) < 0. When |ε| > 1 (elastic): MR > 0. When |ε| = 1 (unit elastic): MR = 0 (TR is maximized). When |ε| < 1 (inelastic): MR < 0. A monopolist sets MR = MC > 0, so it always operates in the elastic region.`, type: `condition` },
    { front: `Why is MR < P for a monopolist but MR = P for a competitive firm?`, back: `A monopolist must lower price on ALL units to sell one more (dP/dQ < 0), so the revenue gain from the marginal unit is reduced by the revenue lost on inframarginal units: MR = P + Q·(dP/dQ) < P. A competitive firm faces dP/dQ = 0 (horizontal demand) — it sells any quantity at the same market price, so MR = P + Q·0 = P.`, type: `distinction` }
  ]
},

t117: {
  learn: {
    openingTension: `A monopolist with cost data and a demand curve wants to maximize profit. The profit-maximizing process looks identical to a competitive firm's — set MR = MC — but leads to a very different outcome. Why?`,
    coreIdea: `A monopolist maximizes profit by producing the quantity where MR = MC, then charging the price consumers are willing to pay for that quantity as read from the demand curve — resulting in P > MC and a welfare loss.`,
    mathSetup: `Max π(Q) = P(Q)·Q − C(Q). FOC: MR(Q) = MC(Q). SOC: MR′(Q) < MC′(Q). Then set P* = P(Q*) from the inverse demand curve. Profit: π* = (P* − AC(Q*))·Q*. The monopoly markup: P* − MC = P*·(1/|ε|) > 0 (Lerner Index result).`,
    derivation: `1. Write profit: π = TR(Q) − TC(Q). 2. FOC: dπ/dQ = MR − MC = 0 → MR = MC. Solve for Q*. 3. Find P*: substitute Q* into inverse demand P(Q*). 4. Calculate π*: TR* − TC*, or equivalently (P* − AC*)·Q*. 5. Key asymmetry: the monopolist reads price from the demand curve after finding Q*. A competitive firm reads price from the market (exogenous) and then finds Q*. The monopolist has both steps: find Q from MR = MC, then find P from demand.`,
    graphicalIntuition: `On the graph: MR = MC determines Q* (vertical dotted line). Travel straight up from Q* to the demand curve → this gives P*. The profit rectangle has height (P* − AC) and width Q*. DWL triangle is bounded by demand curve above, MC curve below, between Q* and the competitive quantity Q_c where P = MC.`,
    workedExample: `P = 100 − Q; TC(Q) = Q² + 10Q + 100.\nMR = 100 − 2Q. MC = 2Q + 10. Set MR = MC: 100 − 2Q = 2Q + 10 → 4Q = 90 → Q* = 22.5.\nP* = 100 − 22.5 = $77.50. AC(22.5) = 22.5 + 10 + 100/22.5 ≈ 36.94.\nπ* = (77.50 − 36.94)·22.5 ≈ $912.60.\nCompetitive: P = MC → 100 − Q = 2Q + 10 → Q_c ≈ 30, P_c ≈ $70.\nDWL ≈ (1/2)(77.50 − 70)(30 − 22.5) ≈ $28.13 (using linear approximation).`,
    boundaryConditions: `1. If MR = MC has no solution where both are positive and MC is rising faster than MR, the SOC fails — check the second-order condition. 2. The monopolist produces at a loss if AC > P* at Q*. MR = MC still gives profit-maximizing (loss-minimizing) quantity. 3. If MC > MR at all Q > 0, the firm produces zero (corner solution). 4. Multiple intersections of MR and MC: check SOC at each to find the global maximum.`,
    examTraps: [
      `A student might think the monopoly price is found by setting MR = MC and reading off the MR curve, but the correct answer is that price is read from the DEMAND curve at Q*, not the MR curve. At Q*, MR < P* — the MR curve lies below demand. Reading from MR would understate the actual monopoly price.`,
      `A student might think monopoly profit equals (P* − MC)·Q*, but the correct answer is that profit equals (P* − AC)·Q*. The firm pays AC per unit, not MC. (P* − MC)·Q* overstates profit whenever fixed costs > 0.`,
      `A student might think setting MR = MC is unique to competitive markets, but the correct answer is that MR = MC is the universal profit-maximization condition. For a competitive firm, MR = P, so P = MC. For a monopolist, MR < P, so MR = MC implies P > MC.`
    ],
    frq: {
      prompt: `A monopolist faces demand P = 60 − 0.5Q and total cost C(Q) = 2Q² + 5Q + 50.`,
      parts: [
        `Derive MR and MC. Find the profit-maximizing quantity and price.`,
        `Calculate economic profit. Is this a short-run or long-run result? Explain why (hint: barriers to entry).`,
        `Find the socially optimal (competitive) price and quantity where P = MC. Calculate DWL from the monopoly restriction.`,
        `A regulator forces the monopolist to price at P = MC. What happens to profit? Is this a sustainable long-run solution? Explain.`
      ]
    }
  },
  flashcards: [
    { front: `What are the steps to find monopoly price and quantity?`, back: `(1) Derive MR from the demand curve. (2) Set MR = MC to find Q*. (3) Substitute Q* into the DEMAND curve (not MR) to find P*. (4) Calculate profit as (P* − AC(Q*))·Q*. Common error: reading P* from the MR curve instead of the demand curve.`, type: `definition` },
    { front: `Why is P > MC at the monopoly optimum?`, back: `At Q* where MR = MC, MR < P (because the monopolist faces downward-sloping demand). Therefore P > MR = MC. The gap P − MC represents the markup — the extra amount charged above cost on each unit. This markup causes allocative inefficiency: units where MB = P > MC go unproduced, creating DWL.`, type: `condition` },
    { front: `Can a monopolist earn negative profit?`, back: `Yes. A monopolist maximizes profit (or minimizes loss) by setting MR = MC, but this does not guarantee π ≥ 0. If AC > P* at the optimal Q*, the monopolist operates at a loss. In the short run, it continues operating if P* > AVC (same shutdown condition as a competitive firm). In the long run, it exits if losses persist.`, type: `condition` }
  ]
},

t118: {
  learn: {
    openingTension: `Why does insulin cost more in the U.S. than in Canada? Why do movie theaters charge more for popcorn than for tickets? The answer lies in the relationship between a firm's market power and the elasticity of demand facing it — formalized in the Lerner Index.`,
    coreIdea: `The Lerner Index measures market power as the percentage markup of price over marginal cost: L = (P − MC)/P = 1/|ε|, showing that firms with more inelastic demand set larger markups.`,
    mathSetup: `Lerner Index: L = (P − MC)/P ∈ [0, 1]. Derivation from MR = MC: MR = P(1 + 1/ε) = MC → P − MC = −P/ε = P/|ε| → (P−MC)/P = 1/|ε|. For a competitive firm: P = MC → L = 0. For a pure monopolist: L = 1/|ε_D|, where ε_D is the price elasticity of demand at the profit-maximizing quantity. A higher L means more market power.`,
    derivation: `1. Start from the profit-maximizing condition: MR = MC. 2. Express MR in terms of elasticity: MR = P + Q·(dP/dQ) = P·[1 + (Q/P)·(dP/dQ)] = P·[1 + 1/ε], where ε = (dQ/dP)·(P/Q). 3. At optimum: P·(1 + 1/ε) = MC. 4. Rearrange: P − P/|ε| = MC → P − MC = P/|ε|. 5. Divide both sides by P: (P − MC)/P = 1/|ε|. 6. This is the Lerner Index. 7. Interpretation: a monopolist with |ε| = 2 sets L = 0.5 — price is 50% above MC. With |ε| = 4, L = 0.25 — price is 25% above MC. More elastic demand → lower markup.`,
    graphicalIntuition: `The Lerner Index equals the inverse of the elasticity of demand at the optimum. On a demand-MR diagram, the vertical distance between demand and MR at Q* divided by the height of the demand curve at Q* equals L. As demand becomes more elastic (flatter), this ratio shrinks toward zero. The Lerner Index thus converts a geometric relationship into a simple elasticity formula.`,
    workedExample: `Insulin (US): demand elasticity |ε| = 0.25 (very inelastic — diabetics must have it). Lerner Index: L = 1/0.25 = 4.0 — but this exceeds 1, which is impossible.\nCorrection: L ∈ [0,1] by construction, so |ε| must be ≥ 1 at the profit max (since MR ≥ 0). Let's say |ε| = 1.3 at the optimum, giving L ≈ 0.77 — price is 77% above MC.\nMovie popcorn: |ε| ≈ 1.5 (patrons are already in the theater, few substitutes). L = 1/1.5 ≈ 0.67. Price is 67% above MC. This is why popcorn margins vastly exceed ticket margins.`,
    boundaryConditions: `1. The Lerner Index equals zero for a competitive firm (L = 0 since P = MC), and approaches 1 as |ε| approaches 1 from above. L cannot exceed 1. 2. The Lerner Index requires the firm to be at its profit-maximizing output — it does not hold for arbitrary price-quantity combinations. 3. The markup formula applies to firms with any market power: monopolists, oligopolists with market power, or monopolistic competitors. For an oligopolist in Cournot competition: L = s_i/|ε|, where s_i is market share.`,
    examTraps: [
      `A student might think higher elasticity means higher markup, but the correct answer is the opposite: L = 1/|ε|, so MORE elastic demand gives a LOWER markup. Consumers with elastic demand are more price-sensitive, limiting the firm's ability to raise price above MC.`,
      `A student might think the Lerner Index measures profitability, but the correct answer is that it measures market power — the percentage gap between price and marginal cost. A firm with L = 0.8 need not be profitable if fixed costs are high. Profit depends on both the markup and the volume of sales.`,
      `A student might think the Lerner Index applies only to monopolists, but the correct answer is that it applies to any firm with pricing power. A monopolistic competitor, dominant firm, or Cournot oligopolist all have L = 1/|ε| at the firm level (where ε is the firm's individual demand elasticity, not the market elasticity).`,
      `A student might think ε is always negative so 1/ε < 0, making L negative, but the correct answer is that the Lerner formula uses the ABSOLUTE VALUE: L = 1/|ε|. The sign convention matters: ε < 0 by the law of demand, so |ε| > 0, and L = 1/|ε| ∈ (0,1].`
    ],
    frq: {
      prompt: `A pharmaceutical company is the sole producer of a patented drug. At its profit-maximizing output, the price elasticity of demand is −2.5 and marginal cost is $40/unit.`,
      parts: [
        `Derive the Lerner Index from the profit-maximizing condition MR = MC. Show all algebraic steps.`,
        `Calculate the Lerner Index and find the profit-maximizing price.`,
        `If the patent expires and the market becomes competitive, what happens to the Lerner Index and the price? Explain the mechanism.`,
        `A generic drug manufacturer enters with |ε| = 8 at its profit-maximizing output and MC = $10. What is its markup? Why is this markup lower than the branded drug's markup?`
      ]
    }
  },
  flashcards: [
    { front: `What is the Lerner Index and what does it measure?`, back: `L = (P − MC)/P. It measures market power: the fraction by which price exceeds marginal cost, expressed as a share of price. L = 0 for competitive firms (P = MC). L = 1/|ε| at the profit-maximizing output for a firm with market power. Higher L means more market power; L ranges from 0 (perfect competition) to approaching 1 (near-total market power).`, type: `definition` },
    { front: `Derive the Lerner Index from MR = MC.`, back: `MR = P(1 + 1/ε) = MC. So P + P/ε = MC (ε < 0, so P/ε < 0). Rearranging: P − MC = −P/ε = P/|ε|. Dividing by P: (P − MC)/P = 1/|ε| = L. The markup as a fraction of price equals the inverse of demand elasticity. More elastic demand (higher |ε|) → lower L → smaller markup.`, type: `definition` },
    { front: `How does the Lerner Index relate to price elasticity of demand?`, back: `L = 1/|ε|. Inverse relationship: as demand becomes more elastic (|ε| rises), the Lerner Index falls and the markup shrinks. Intuition: more elastic demand means consumers are more price-sensitive, so raising price above MC costs the firm more in lost sales. Competition (|ε|→∞) drives L→0; a monopolist with inelastic demand has L close to 1.`, type: `condition` },
    { front: `What is the markup formula for a profit-maximizing monopolist?`, back: `P* = MC/(1 − 1/|ε|) = MC·|ε|/(|ε|−1). This is derived from L = 1/|ε|: P − MC = P/|ε| → MC = P(1 − 1/|ε|) → P = MC/(1 − 1/|ε|). Example: if MC = $30 and |ε| = 3, then P* = 30/(1 − 1/3) = 30/(2/3) = $45. The markup is $15, or 50% above MC.`, type: `definition` },
    { front: `Can the Lerner Index exceed 1? What constrains it?`, back: `No. L = (P − MC)/P ∈ [0, 1]. The lower bound L = 0 holds for competitive firms. The upper bound L → 1 requires |ε| → 1. But the monopolist only operates where |ε| ≥ 1 (elastic demand) since MR = P(1 + 1/ε) ≥ 0 requires |ε| ≥ 1. So in practice L < 1 always at the profit-maximizing point.`, type: `condition` },
    { front: `Does a high Lerner Index imply high profit?`, back: `Not necessarily. The Lerner Index measures the percentage markup (price over MC), not total profit. A firm with L = 0.9 could still have negative profit if fixed costs are enormous. Profit = (P − AC)·Q; the Lerner Index captures only P − MC, not P − AC. A startup with high margins but tiny volume may have high L but low profit.`, type: `distinction` },
    { front: `How does the Lerner Index apply in Cournot oligopoly?`, back: `For firm i in Cournot competition: Lᵢ = (P − MCᵢ)/P = sᵢ/|ε|, where sᵢ = qᵢ/Q is firm i's market share and ε is the market demand elasticity. A dominant firm with large market share has a higher Lerner Index. As n → ∞ (many firms), sᵢ → 0 and L → 0, recovering the competitive result.`, type: `condition` },
    { front: `A monopolist faces |ε| = 4 and MC = $20. Find price.`, back: `L = 1/|ε| = 0.25. L = (P − MC)/P → 0.25 = (P − 20)/P → 0.25P = P − 20 → 20 = 0.75P → P = $26.67. Check: markup = $6.67 = P/|ε| = 26.67/4 = $6.67. ✓ This is the direct application of the Lerner markup formula.`, type: `calculation` },
    { front: `Why does a competitive firm have L = 0?`, back: `A competitive firm sets P = MC (from the FOC p = MC when the firm is a price-taker). Therefore (P − MC)/P = 0/P = 0. Alternatively: a competitive firm faces infinitely elastic demand (|ε| → ∞), so L = 1/|ε| → 0. Perfect competition is the limiting case of the Lerner Index — maximum price sensitivity forces price to marginal cost.`, type: `condition` },
    { front: `What is the economic significance of P > MC for society?`, back: `P > MC means the last unit sold is valued by consumers at P but costs only MC < P to produce. Units between Q* (monopoly) and Q_c (competitive) where P > MC are not produced — each represents a net social gain foregone. This is the deadweight loss from monopoly: the market power wedge P − MC causes underproduction and welfare loss relative to the competitive benchmark.`, type: `condition` },
    { front: `Distinguish: Lerner Index vs. HHI (Herfindahl-Hirschman Index).`, back: `Lerner Index: L = (P − MC)/P — measures a single firm's pricing power at its optimum. HHI: sum of squared market shares across all firms — measures market concentration structure. HHI predicts when market power is likely; Lerner Index measures the actual exercise of it. High HHI often predicts high L but not always — a concentrated market with elastic demand may still have low L.`, type: `distinction` }
  ]
},

t119: {
  learn: {
    openingTension: `A monopolist restricts output and raises price. Consumers lose surplus. Does the economy lose the same amount? Less? More? And where exactly does the "lost" value go?`,
    coreIdea: `Monopoly creates a deadweight loss — value that is neither captured by the monopolist nor by consumers, but simply destroyed — because units where social marginal benefit exceeds marginal cost are not produced.`,
    mathSetup: `Competitive equilibrium: P_c = MC, Q_c (maximum surplus). Monopoly: Q_m < Q_c, P_m > MC. DWL = (1/2)(P_m − MC)(Q_c − Q_m) for linear demand and constant MC. CS changes: ΔCS = −(P_m − P_c)·Q_m − (1/2)(P_m − P_c)(Q_c − Q_m). PS changes: ΔPS = +(P_m − P_c)·Q_m − (1/2)(MC)(Q_c − Q_m) [for constant MC]. DWL = −ΔCS − ΔPS > 0.`,
    derivation: `1. Competitive: all units with MB ≥ MC are produced. TS = CS + PS is maximized. 2. Monopolist restricts to Q_m: units from Q_m to Q_c have MB > MC but are not produced. 3. CS loss: consumers lose the triangle + rectangle between P_m and demand curve. Some of this is transferred to the monopolist (rectangle = monopoly rent). 4. PS gain: monopolist gains the rectangle (transfer from consumers) but loses a triangle on the units not produced. 5. Net: the rectangle is a transfer (from consumers to producer), but the two triangles are DWL — value destroyed, not redistributed.`,
    graphicalIntuition: `The welfare diagram shows: competitive equilibrium at (Q_c, P_c). Monopoly restricts to (Q_m, P_m). Three areas: (A) rectangle from Q_m×(P_m − P_c) = transfer from CS to PS. (B) upper triangle = DWL from CS (consumers who would have bought at prices between P_m and P_c, but don't). (C) lower triangle = DWL from PS (units between Q_m and Q_c that were profitable at MC but not produced). DWL = B + C.`,
    workedExample: `Demand: P = 100 − Q; MC = 20. Competitive: P_c = 20, Q_c = 80. Monopoly: MR = 100 − 2Q = MC = 20 → Q_m = 40, P_m = 60.\nDWL = (1/2)(60 − 20)(80 − 40) = (1/2)(40)(40) = $800.\nCS at competition = (1/2)(100−20)(80) = $3,200. CS at monopoly = (1/2)(100−60)(40) = $800. ΔCS = −$2,400.\nPS at competition = 0 (MC constant). PS at monopoly = (60−20)(40) = $1,600. ΔPS = +$1,600.\nDWL = 2,400 − 1,600 = $800. ✓`,
    boundaryConditions: `1. DWL is increasing in market power (higher L) and in the elasticity of demand and supply. 2. If MC is increasing, the DWL triangle is not a right triangle — it is bounded by the MC curve below. 3. Regulation: if a regulator forces P = MC, DWL → 0, but the monopolist may earn negative profit (natural monopoly problem). 4. The DWL from monopoly may be partially offset if monopoly profit funds R&D or innovation (Schumpeter argument) — a dynamic tradeoff.`,
    examTraps: [
      `A student might think all the consumer surplus lost under monopoly is captured by the producer, but the correct answer is that only the rectangle (inframarginal units at higher price) is transferred. The triangles representing DWL are captured by no one — they are destroyed value from unrealized trades.`,
      `A student might think DWL is the profit earned by the monopolist, but the correct answer is that DWL is a separate measure of social cost. Monopoly profit is the rectangle; DWL is the two triangles. They are different quantities measuring different things.`,
      `A student might think restricting monopoly output to zero would eliminate DWL, but the correct answer is that DWL is the cost of the gap between Q_m and Q_c — it equals zero only when Q_m = Q_c (competitive output). The welfare benchmark is competition, not zero output.`
    ],
    frq: {
      prompt: `A monopolist faces demand P = 50 − 0.5Q and has constant MC = AC = $10.`,
      parts: [
        `Find monopoly quantity, price, and profit.`,
        `Find the competitive quantity and price. Calculate DWL.`,
        `Decompose the change in consumer surplus into (a) the rectangle transferred to the producer and (b) the triangle that is DWL.`,
        `A regulator imposes a price ceiling at P = MC = $10. What is the new DWL? What happens to monopoly profit?`
      ]
    }
  },
  flashcards: [
    { front: `What is the deadweight loss from monopoly?`, back: `DWL = the value of trades that would occur under competition (MB > MC) but do not occur under monopoly. It is the area of the triangle between the demand curve (MB) and the MC curve, from Q_m to Q_c. DWL represents destroyed value — neither consumer surplus nor producer surplus — lost because the monopolist restricts output below the efficient level.`, type: `definition` },
    { front: `In the monopoly welfare diagram, distinguish: transfer vs. DWL.`, back: `Transfer (rectangle): the gain in PS from charging higher price on units Q_m that were produced under competition. This is pure redistribution from consumers to the monopolist — welfare-neutral in aggregate. DWL (two triangles): value lost on the units Q_c − Q_m not produced. No one captures this value — it is destroyed. DWL is the true social cost of monopoly.`, type: `distinction` },
    { front: `How does market demand elasticity affect the size of monopoly DWL?`, back: `More elastic demand → smaller DWL. With elastic demand, the gap between Q_m and Q_c is smaller (monopolist can restrict less) and the markup P_m − MC is smaller (L = 1/|ε|). More inelastic demand → larger DWL relative to competitive output. The DWL formula (1/2)(P_m − MC)(Q_c − Q_m) shows DWL depends on both the markup and the quantity restriction.`, type: `condition` }
  ]
},

t120: {
  learn: {
    openingTension: `If one electric utility company serving a city split into ten competing firms, each with its own set of power lines and transformers, would consumers pay lower prices? Almost certainly not — the waste in duplicated infrastructure would raise average costs dramatically. This is the natural monopoly problem.`,
    coreIdea: `A natural monopoly exists when a single firm can produce the total market output at lower average cost than any combination of two or more firms — because average cost is declining over the entire relevant range of output.`,
    mathSetup: `Natural monopoly condition: subadditivity of costs — C(Q) < C(q₁) + C(q₂) for any q₁ + q₂ = Q, q₁ > 0, q₂ > 0. Sufficient (not necessary) condition: AC(Q) is declining over the relevant output range. Regulatory options: (1) Marginal-cost pricing: P = MC. Efficient but yields π < 0 if MC < AC (as with declining AC). (2) Average-cost pricing: P = AC. Breaks even (π = 0) but not allocatively efficient. (3) Ramsey pricing: P − MC proportional to 1/|ε|, minimizing DWL subject to breaking even.`,
    derivation: `1. With declining AC, a larger firm has lower average cost than smaller firms. Two firms each serving half the market have higher per-unit costs than one firm serving the whole market. Competition is wasteful. 2. If market were competitive: two firms with identical declining-AC cost functions — the firm with even slightly lower cost will expand and undercut the other, eventually becoming the sole supplier. Competition is self-eliminating in natural monopoly. 3. Regulatory dilemma: at Q where P = MC, π < 0 (MC < AC when AC is declining). At P = AC, π = 0 but P > MC — DWL remains. No first-best solution exists; P = MC requires a subsidy.`,
    graphicalIntuition: `On an AC/MC/Demand diagram with declining AC: the AC curve lies everywhere above the MC curve (declining AC implies MC < AC). The demand curve intersects AC at a quantity where AC is still declining. The MC pricing point (P = MC) is below AC — the firm loses money there. The AC pricing point (P = AC) is higher — firm breaks even but DWL remains (P > MC).`,
    workedExample: `Utility with TC(Q) = 1000 + 5Q (large fixed costs, low MC). AC = 1000/Q + 5. MC = 5. Demand: P = 50 − Q.\nP = MC: 50 − Q = 5 → Q = 45, P = 5. π = 5(45) − 1000 − 5(45) = −$1,000. (Loss = FC.)\nP = AC: 50 − Q = 1000/Q + 5 → 45Q − Q² = 1000 → Q² − 45Q + 1000 = 0 → Q ≈ 30.9, P ≈ $19.1.\nRegulatory outcome: P = AC ≈ $19 avoids subsidy but leaves DWL. P = MC = $5 is efficient but requires $1,000 subsidy.`,
    boundaryConditions: `1. Natural monopoly is a cost-side concept: it says nothing about demand. A market with high-enough demand might have multiple firms even with declining AC if demand is large relative to minimum efficient scale. 2. Economies of scope (not just scale) can create natural monopoly when bundling multiple products lowers cost. 3. Contestability: if entry and exit are perfectly costless, even a natural monopoly prices at AC due to threat of hit-and-run entry (Baumol's contestable markets theory).`,
    examTraps: [
      `A student might think natural monopoly means the government created the monopoly, but the correct answer is that natural monopoly is a cost structure — it arises when technology exhibits strongly declining AC, not from regulatory grant. The government may regulate a natural monopoly but did not create the cost structure.`,
      `A student might think price = MC always achieves efficiency in a natural monopoly, but the correct answer is that P = MC is allocatively efficient but not financially viable when AC is declining (MC < AC everywhere). The firm loses money equal to fixed costs. A subsidy or alternative pricing rule (AC pricing, Ramsey pricing) is needed.`,
      `A student might think a regulated utility earning zero profit at P = AC is achieving the social optimum, but the correct answer is that P = AC eliminates DWL only if P = MC coincidentally holds too. In a natural monopoly with MC < AC, P = AC > MC — so there is still some DWL, just less than at the unregulated monopoly price.`
    ],
    frq: {
      prompt: `A city has one water utility with TC(Q) = 800 + 4Q and demand P = 20 − 0.1Q.`,
      parts: [
        `Show that this is a natural monopoly by demonstrating that AC is declining over the relevant range.`,
        `Find the unregulated monopoly price, quantity, and profit.`,
        `Find the AC-pricing (break-even) regulated price and quantity.`,
        `If the regulator requires P = MC pricing, what subsidy is needed and why? Discuss the equity and efficiency implications of using a lump-sum subsidy.`
      ]
    }
  },
  flashcards: [
    { front: `Define natural monopoly.`, back: `A natural monopoly exists when a single firm can supply the entire market at lower total cost than two or more firms — formally, when the cost function is subadditive: C(Q) < C(q₁) + C(q₂) for all q₁ + q₂ = Q. A sufficient condition: average cost is declining over the entire relevant output range, so larger scale always means lower per-unit cost.`, type: `definition` },
    { front: `Why does marginal-cost pricing cause losses in a natural monopoly?`, back: `When AC is declining, MC < AC everywhere (if AC is falling, the next unit costs less than the average — pulling the average down). So at P = MC, revenue per unit < average cost per unit, and the firm loses money. The loss equals FC for a linear cost function. A subsidy of at least FC is required to make P = MC pricing sustainable.`, type: `condition` },
    { front: `What is average-cost pricing and why is it a second-best solution?`, back: `Average-cost pricing sets P = AC(Q) — the price where the demand curve intersects the AC curve. The firm earns zero economic profit (breaks even) and needs no subsidy. But since AC > MC (natural monopoly condition), P = AC > MC — there is still DWL from underproduction relative to P = MC. AC pricing is a second-best regulation: financially sustainable but not allocatively efficient.`, type: `definition` }
  ]
},

t121: {
  learn: {
    openingTension: `If a car dealer could somehow charge every buyer exactly what they were willing to pay, the dealer would capture every dollar of consumer surplus. Is this theoretically possible? And how does it compare to quantity discounts or student pricing?`,
    coreIdea: `First-degree (perfect) price discrimination charges each consumer their exact willingness to pay, extracting all consumer surplus, eliminating deadweight loss, and producing the efficient quantity — but requires perfect information about every buyer's reservation price.`,
    mathSetup: `Under 1st-degree PD: each unit i is sold at price P_i = WTP_i (consumer's maximum willingness to pay for unit i). Total revenue = area under demand curve from 0 to Q_c (competitive output). Producer surplus = entire area between demand and MC (all CS is extracted). CS = 0. DWL = 0. The monopolist produces the competitive quantity Q_c but captures all surplus.`,
    derivation: `1. Standard monopolist faces a downward-sloping demand and sells all units at the same price P_m, leaving CS and creating DWL. 2. Under 1st-degree PD: sell unit 1 at WTP₁, unit 2 at WTP₂, etc. Each unit is priced to extract the buyer's surplus. 3. Because each unit is priced at WTP (not below WTP as in uniform pricing), the firm still wants to sell any unit where WTP > MC — there is no reason to restrict output. 4. Output expands to Q_c (where demand = MC). DWL = 0. CS = 0 (all surplus transferred to producer). 5. Profit = entire area under demand curve above MC — more than under standard monopoly.`,
    graphicalIntuition: `Under uniform monopoly: profit = rectangle (P_m − MC)·Q_m. CS = upper triangle. DWL = right triangle. Under 1st-degree PD: profit = entire area between demand and MC (from 0 to Q_c). CS = 0. DWL = 0. The entire surplus that existed under competition is transferred to the monopolist. Quantity is efficient (= Q_c) but distribution is maximally unequal.`,
    workedExample: `Demand: P = 100 − Q, MC = 20. Competitive output Q_c = 80.\nStandard monopoly: Q_m = 40, P_m = 60, π = 1,600, CS = 800, DWL = 800.\n1st-degree PD: each unit sold at its demand price. Total revenue = ∫₀^{80}(100−Q)dQ = [100Q − Q²/2]₀^{80} = 8,000 − 3,200 = 4,800. TC = 20×80 = 1,600. π = 4,800 − 1,600 = $3,200. CS = 0. DWL = 0.\nInterpret: Profit doubles vs. standard monopoly; consumers are no better off than having zero surplus; the market is allocatively efficient but distributionally extreme.`,
    boundaryConditions: `1. Requires complete information: the seller must know every buyer's WTP exactly. In practice, individual WTP is private information. 2. No resale: if consumers can resell, they undermine price discrimination (arbitrage). 3. 1st-degree PD is a theoretical benchmark — real discrimination is never perfect. Closest approximations: individualized negotiation, dynamic pricing algorithms, auctions.`,
    examTraps: [
      `A student might think 1st-degree PD is good for consumers because DWL = 0, but the correct answer is that while DWL = 0 (efficient quantity), CS = 0 — consumers are no better off than if they hadn't purchased at all. Efficiency and consumer welfare are different: 1st-degree PD is efficient but terrible for buyers.`,
      `A student might confuse 1st-degree with 3rd-degree PD (e.g., student pricing), but the correct answer is that 1st-degree PD charges each individual their own WTP; 3rd-degree PD charges different prices to different observable groups (students vs. adults) but a uniform price within each group. Students don't each pay their own WTP — all students pay the same student price.`,
      `A student might think 2nd-degree PD requires more information than 1st-degree, but the correct answer is the opposite: 1st-degree requires knowing each individual's WTP (the most information); 2nd-degree requires only that buyers self-select into quantity tiers (no individual information needed); 3rd-degree requires only observable group membership. Information requirements: 1st > 3rd > 2nd.`
    ],
    frq: {
      prompt: `A monopolist faces demand P = 80 − 0.5Q and MC = $20.`,
      parts: [
        `Find the uniform monopoly price, quantity, profit, CS, and DWL.`,
        `Under perfect (1st-degree) price discrimination, find total output, total profit, CS, and DWL.`,
        `Compare total surplus (CS + PS) under uniform monopoly vs. 1st-degree price discrimination. Which is higher? Why?`,
        `Explain why perfect price discrimination requires information that 3rd-degree price discrimination does not. What specific information is needed for each?`
      ]
    }
  },
  flashcards: [
    { front: `Define first-degree (perfect) price discrimination.`, back: `Charging each consumer exactly their willingness to pay (reservation price) for each unit. Every unit is sold at its demand price. Result: CS = 0 (all extracted as PS), DWL = 0 (efficient quantity Q_c is produced), and profit equals the entire area between demand and MC. Requires knowing each buyer's WTP individually — practically impossible but a useful theoretical benchmark.`, type: `definition` },
    { front: `Contrast 1st, 2nd, and 3rd degree price discrimination by information requirement.`, back: `1st degree: requires knowing each individual consumer's willingness to pay for each unit (maximum information). 3rd degree: requires knowing observable group characteristics (age, student status) — group WTP, not individual. 2nd degree: requires NO individual information — consumers self-select into quantity-price tiers by their own choices. Information ordering: 1st > 3rd > 2nd.`, type: `distinction` },
    { front: `Does 1st-degree price discrimination eliminate deadweight loss?`, back: `Yes. The firm sells every unit where WTP > MC (i.e., from Q = 0 to Q_c where demand = MC). No profitable unit is left unproduced. DWL = 0. However, the efficient quantity now generates zero CS — all surplus goes to the producer. Efficiency and equity are separate: 1st-degree PD is allocatively efficient but maximally unequal in distribution.`, type: `condition` }
  ]
},

t122: {
  learn: {
    openingTension: `Airlines charge different prices for the same seat depending on how far in advance you buy. Utilities charge a lower rate per kilowatt-hour above a certain usage level. Neither scheme knows your WTP ahead of time — but both extract more surplus than a single price. How?`,
    coreIdea: `Second-degree price discrimination uses price schedules that vary with quantity purchased — block pricing, quantity discounts, or two-part tariffs — allowing buyers to self-select into tiers without the seller needing to identify individual types.`,
    mathSetup: `Under 2nd-degree PD: firm offers a price schedule P(Q) where the per-unit price varies with cumulative quantity. Block pricing: first Q₁ units at P₁, additional units at P₂ < P₁. Incentive-compatible: buyers with high WTP buy large quantities and pay less per unit; buyers with low WTP buy small quantities at high per-unit prices. Unlike 1st-degree PD, the seller does not need to observe buyer type — the menu is designed so each type self-selects.`,
    derivation: `1. Consider two consumer types: H (high WTP) and L (low WTP). Uniform price must choose one price for both — sacrifices surplus on one type. 2. Two-block pricing: charge P_H for first Q_H units, P_L for additional units. Type H buys Q_H at price P_H; if they want more, additional units cost P_L. Type L may not buy at P_H but will buy at P_L. 3. Self-selection constraint: type H prefers the high-quantity tier; type L prefers the low-quantity tier or not buying. 4. This is 2nd-degree PD: the seller doesn't know who is type H or L — the price schedule induces sorting. No individual identification is required.`,
    graphicalIntuition: `In a two-block scheme: the first Q₁ units sell at P₁ (high price, extracting surplus from high-WTP buyers). All units from Q₁ to Q₂ sell at P₂ < P₁ (extracting surplus from marginal buyers). Each block extracts more surplus than a single price would from each group. The price schedule looks like a step function declining in unit price as quantity increases.`,
    workedExample: `Electric utility: residential customers in two types. Type H: demand P = 30 − Q/2 (high users). Type L: demand P = 20 − Q/2 (low users). MC = 5. Two-block pricing: first 20 kWh at $15/kWh; additional kWh at $5/kWh (MC). Type H buys 20 units at $15 (pays $300) then buys more at $5. Type L: at $15, Q_L = 10 units; doesn't want to pay $15 for the first block — won't purchase at P₁. If utility adjusts: P₁ for first 10 units, P₂ = MC for rest: type L buys 10 at P₁ and self-selects into that tier.\nNote: The optimal menu design balances surplus extraction against participation constraints.`,
    boundaryConditions: `1. Works without individual information — only the distribution of buyer types is needed to design the menu. 2. Resale arbitrage must be prevented: if high-quantity buyers can resell to low-quantity buyers, the tiers collapse. 3. 2nd-degree PD includes menus of quality-price pairs as well as quantity-price pairs (e.g., business class vs. economy airline seats). 4. In practice, the distinction between 2nd and 3rd degree can blur: senior discounts on railcards are 3rd-degree; railcard schemes requiring upfront purchase of a pass are 2nd-degree.`,
    examTraps: [
      `A student might confuse 2nd-degree with 3rd-degree PD (e.g., student discounts), but the correct answer is that 2nd-degree PD does NOT require identifying consumer type — buyers self-select based on their quantity choices. 3rd-degree PD DOES require observing group membership (student ID, age). The distinguishing feature is self-selection vs. identification.`,
      `A student might think 2nd-degree PD always means lower prices for higher quantities, but the correct answer is that 2nd-degree PD means price varies with quantity — the schedule could be declining (quantity discounts) or increasing (non-linear tariffs where heavy users pay more per unit). The common quantity-discount case is not the only form.`,
      `A student might think 1st-degree PD requires less information than 2nd-degree because the seller charges one price per unit, but the correct answer is that 1st-degree PD requires knowing each individual's WTP (maximum information), while 2nd-degree requires only the distribution of types (or none at all for block pricing) — 2nd-degree is less information-intensive.`
    ],
    frq: {
      prompt: `A gym has two types of members: casual (WTP: $80/month, use 5 days) and dedicated (WTP: $150/month, use 20 days). MC per day = $2. The gym cannot tell which type a member is before they join.`,
      parts: [
        `What is the maximum single price the gym can charge while attracting both types? What profit does it earn?`,
        `Design a 2nd-degree price discrimination scheme using a two-part tariff or tiered membership that extracts more surplus than the single price. Specify the pricing menu and explain how each type self-selects.`,
        `Explain why this is 2nd-degree rather than 3rd-degree price discrimination.`,
        `What practical problem might prevent this scheme from working? How could resale or information leakage undermine it?`
      ]
    }
  },
  flashcards: [
    { front: `Define second-degree price discrimination.`, back: `A pricing scheme where the per-unit price varies with quantity purchased, but the same schedule is offered to all consumers — buyers self-select their tier based on their own quantity choice. Examples: quantity discounts, block pricing, two-part tariffs, loyalty programs. The seller does not need to identify individual consumer types; the menu induces self-selection.`, type: `definition` },
    { front: `Contrast 2nd-degree with 1st-degree and 3rd-degree price discrimination on the information required.`, back: `1st degree: must know each individual buyer's WTP for every unit (most information). 3rd degree: must observe consumer group membership (age, student status) — group-level information. 2nd degree: no individual or group information required — the price schedule is offered to everyone; buyers self-select. 2nd-degree PD works through menu design, not consumer observation. Information requirement: 1st > 3rd > 2nd.`, type: `distinction` },
    { front: `What is a self-selection constraint in 2nd-degree price discrimination?`, back: `A condition ensuring that each consumer type voluntarily chooses the menu option designed for them. Under 2nd-degree PD, the seller designs a menu so that type H buyers prefer the high-quantity high-cost tier, and type L buyers prefer the low-quantity low-cost tier. If the menu violates self-selection constraints, buyers mimic a different type to get a better deal.`, type: `definition` }
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
console.log('Done! Added t115-t122.');
