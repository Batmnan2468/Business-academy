#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'content', 'courses', 'econ-301', 'course.json');
const course = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const learnData = {

// ─── UNIT 6: COMPETITIVE MARKETS ────────────────────────────────────────────

t102: {
  learn: {
    openingTension: `How can a wheat farmer selling grain identical to thousands of competitors have any power over price? And if she has no power, why does she bother to optimize at all?`,
    coreIdea: `A price-taking firm is too small to influence market price, so it treats price as an exogenous parameter and chooses only how much to produce — equating price to marginal cost.`,
    mathSetup: `Profit: π(q) = p·q − C(q), where p is a market-determined constant from the firm's perspective. First-order condition: dπ/dq = p − MC(q) = 0, giving p = MC(q). Second-order condition: −C″(q) < 0, satisfied when MC is upward-sloping. Since p is fixed, marginal revenue equals price: MR = p.`,
    derivation: `1. Why MR = p: if the firm raises price above the market price p, all customers switch to identical rivals — revenue collapses to zero. Cutting below p is unnecessary since the firm sells everything at p. So the firm's demand curve is horizontal at p, and MR = ΔTR/Δq = p for every unit. 2. Profit maximization: choose q where p = MC(q). If p > MC, the next unit adds more revenue than cost — increase q. If p < MC, the last unit costs more than it earns — decrease q. The optimum is the unique q where p = MC. 3. This is an assumption: if the firm's decisions visibly moved market price, it would face a downward-sloping demand and MR < p. The price-taking assumption is valid only when the firm is a negligible share of total supply.`,
    graphicalIntuition: `The firm faces a horizontal demand curve at p*, distinct from the downward-sloping market demand curve. Students routinely confuse these: the market demand is not horizontal; it shows how total market quantity demanded responds to price. The individual firm's demand is horizontal because changing one farm's output leaves total market quantity essentially unchanged, so market price does not move. The firm is small relative to the market — that is the entire content of the price-taking assumption.`,
    workedExample: `Given: Wheat price p = $5/bushel. Farm cost function C(q) = 0.5q² + 10. Find profit-maximizing output and profit.\nSolution: Set p = MC: 5 = q → q* = 5 bushels. TR = 25. TC = 0.5(25) + 10 = 22.50. π = 2.50.\nInterpret: The farm takes p = $5 as given and chooses only how much to produce. She earns positive profit — price-taking does not imply zero profit. Zero profit is a long-run equilibrium result, not a definition of competitive firms.`,
    boundaryConditions: `1. Market-share threshold: the assumption breaks down when one firm controls a non-trivial share of total output. Even 5-10% market share creates measurable price effects and requires oligopoly or dominant-firm models. 2. Homogeneous products required: any product differentiation (brand, location, quality) gives the firm some price-setting power, making its demand curve downward-sloping rather than horizontal. 3. Free entry required for long-run price-taking: if barriers to entry protect incumbent firms, they can sustain prices above marginal cost even with many competitors.`,
    examTraps: [
      `A student might think price-taking firms earn zero profit, but the correct answer is that price-taking only constrains how the firm sets price (it can't), not whether it earns profit. A farm can earn positive profit if p > ATC. Zero profit emerges only in long-run competitive equilibrium after entry drives down price.`,
      `A student might think MR < p for a price-taking firm as it does for a monopolist, but the correct answer is MR = p for a price-taker because its demand curve is horizontal — each additional unit sells at exactly the same market price with no markdown on previous units.`,
      `A student might think a price-taking firm has no optimization problem to solve, but the correct answer is that the firm freely optimizes quantity — only price is fixed. The quantity decision p = MC is a real optimization with real consequences for profit.`
    ],
    frq: {
      prompt: `A competitive corn farm faces a market price of $4/bushel. Its cost function is C(q) = q² + 2q + 8, where q is in hundreds of bushels.`,
      parts: [
        `Derive the marginal cost function. Explain why this firm treats price as a parameter rather than a choice variable.`,
        `Find the profit-maximizing output. Show the first-order condition and verify it is a maximum.`,
        `Calculate profit at the optimum. If p = $4 is the short-run equilibrium price, what will happen to market price in the long run and why?`,
        `If the market price fell to $2, should this firm operate or shut down in the short run? Compute average variable cost and compare it to price.`
      ]
    }
  },
  flashcards: [
    { front: `What is a price-taking firm?`, back: `A firm whose output is too small to influence market price, so it treats price as an exogenous parameter and solves only for optimal quantity. The firm faces a horizontal (perfectly elastic) demand curve at the market price.`, type: `definition` },
    { front: `Why is MR = P for a competitive firm but MR < P for a monopolist?`, back: `A competitive firm faces a horizontal demand — each additional unit sells at the same market price, so MR = P. A monopolist faces a downward-sloping demand — selling more units requires lowering price on all units, so MR < P. The key difference is whether the firm's output affects the market price.`, type: `distinction` },
    { front: `What is the profit-maximizing rule for a price-taking firm?`, back: `Produce the quantity q* where P = MC(q*). At any lower quantity, P > MC and expanding production raises profit. At any higher quantity, P < MC and the last unit costs more than it earns. P = MC is the first-order condition for profit maximization when price is fixed.`, type: `condition` },
    { front: `Can a price-taking firm earn positive profit?`, back: `Yes. Price-taking constrains how the firm sets price (it can't), not whether it earns profit. If market price P exceeds average total cost ATC at the optimum, the firm earns positive economic profit. Zero profit only characterizes long-run competitive equilibrium after entry drives price down to the minimum of ATC.`, type: `condition` },
    { front: `What two market conditions justify the price-taking assumption?`, back: `(1) Many small sellers: each firm's output is a negligible share of total supply, so one firm's production decision does not move market price. (2) Homogeneous products: goods are perfect substitutes, so any price above the market price drives all customers to competitors. Both conditions together make the firm's demand curve horizontal.`, type: `definition` }
  ]
},

t103: {
  learn: {
    openingTension: `If a firm maximizes profit at p = MC, and marginal cost depends on quantity, then the firm's optimal quantity depends on price. This is just the firm's supply curve — but how do we know it slopes upward, and when does it break down?`,
    coreIdea: `The firm's supply curve is derived directly from the marginal cost curve: it shows the profit-maximizing output at each price, which is the upward-sloping portion of MC above the minimum of average variable cost.`,
    mathSetup: `From p = MC(q), invert to get q*(p) — this is the supply function. For the supply function to be well-defined and upward-sloping, MC must be strictly increasing at the optimum: MC′(q*) > 0 (equivalently, C″(q*) > 0). Supply curve: S(p) = q*(p) for p ≥ min(AVC); S(p) = 0 for p < min(AVC).`,
    derivation: `1. Profit maximization gives p = MC(q) as the first-order condition. 2. Inverting this equation yields q as a function of p: q*(p) = MC⁻¹(p). This is the supply function. 3. The supply curve slopes upward because MC is increasing: a higher price makes previously unprofitable marginal units profitable, so the firm produces more. 4. Below min(AVC), the firm produces zero — it shuts down. The supply curve is therefore kinked: zero for p < AVC_min, then the MC curve for p ≥ AVC_min.`,
    graphicalIntuition: `The supply curve is literally the MC curve above the shutdown point. When price rises, the firm moves up its MC curve, producing more. When price falls, it moves down its MC curve until it hits the shutdown point. Students sometimes think the supply curve and MC curve are different objects — they are not. For a competitive firm, MC is the supply curve (above AVC_min).`,
    workedExample: `Given: C(q) = q³ − 4q² + 8q. Find the firm's supply function.\nSolution: MC = 3q² − 8q + 8. Set p = MC: p = 3q² − 8q + 8. AVC = q² − 4q + 8. Minimum AVC: d(AVC)/dq = 2q − 4 = 0 → q = 2, AVC_min = 4 − 8 + 8 = 4. So the supply curve is: q*(p) solves 3q² − 8q + (8−p) = 0 for p ≥ 4; q* = 0 for p < 4.\nInterpret: At p = 4 the firm just covers variable costs and is indifferent between producing and shutting down. For any p above $4, the firm operates and produces along its MC curve.`,
    boundaryConditions: `1. Non-convex costs: if MC is U-shaped with a decreasing then increasing region, the first-order condition p = MC may have multiple solutions. The profit-maximizing choice is the one on the upward-sloping portion (where SOC holds). 2. If the firm has fixed costs that can be avoided by shutting down (quasi-fixed costs), the shutdown threshold changes: shut down when p·q < VC(q), not when p < AVC. 3. In the long run, all costs become variable, so the shutdown point is where p < min(LAC), not min(AVC).`,
    examTraps: [
      `A student might think the supply curve is the entire MC curve, but the correct answer is that the supply curve is only the portion of MC above min(AVC) — below that the firm shuts down and supplies zero.`,
      `A student might think rising MC is an accident of technology, but the correct answer is that upward-sloping MC (diminishing marginal product) is required for the supply curve to be well-defined — without it, the firm would produce zero or infinite output at any given price.`,
      `A student might confuse individual firm supply with market supply, but the correct answer is that firm supply is one firm's MC curve, while market supply is the horizontal summation of all active firms' MC curves.`
    ],
    frq: {
      prompt: `A firm in a competitive market has cost function C(q) = (1/3)q³ − 2q² + 6q + 5.`,
      parts: [
        `Derive MC and AVC. Find the output at which AVC is minimized and the value of min(AVC).`,
        `Derive the firm's short-run supply function, specifying the shutdown condition explicitly.`,
        `At p = $4, what quantity does the firm supply? Calculate its profit. Should it operate?`,
        `Explain why the supply curve slopes upward. What economic law underlies this result?`
      ]
    }
  },
  flashcards: [
    { front: `What is the relationship between the MC curve and the supply curve for a competitive firm?`, back: `The supply curve is the MC curve above the minimum of AVC. Setting p = MC gives optimal quantity as a function of price — this is the supply function. Below min(AVC), the firm shuts down and supplies zero. The supply curve is not a separate object; it is literally the MC curve restricted to the operating region.`, type: `definition` },
    { front: `Why does a firm's supply curve slope upward?`, back: `Because MC is increasing: as the firm produces more, the cost of each additional unit rises (due to diminishing marginal product). A higher price is needed to cover the higher marginal cost, so higher price induces more production. Without increasing MC, the supply curve would be vertical or horizontal — not upward-sloping.`, type: `condition` },
    { front: `What is the shutdown point on the supply curve?`, back: `The output where price equals minimum average variable cost (AVC_min). Below this price, the firm cannot cover its variable costs on any unit, so it minimizes losses by producing zero. Above it, producing is better than shutting down because at least some contribution to fixed costs is made. The shutdown point is the bottom of the supply curve.`, type: `definition` },
    { front: `How do you derive the supply function algebraically?`, back: `(1) Write the FOC: p = MC(q). (2) Solve for q as a function of p: q*(p) = MC⁻¹(p) — this requires MC to be invertible (strictly increasing at the solution). (3) Find min(AVC) and add: q*(p) = 0 for p < AVC_min. The resulting piecewise function is the supply function.`, type: `definition` }
  ]
},

t104: {
  learn: {
    openingTension: `A factory with expensive equipment it cannot sell faces a fire next week. Should it keep producing if it is losing money? The answer depends entirely on which costs are irreversible — and this distinction defines short-run supply.`,
    coreIdea: `In the short run, some inputs are fixed and their costs are sunk, so only variable costs determine the production decision; the short-run supply curve is the short-run MC curve above short-run AVC.`,
    mathSetup: `Short-run total cost: STC(q, K̄) = FC + VC(q, K̄), where K̄ is fixed capital. Short-run MC: SMC = ∂STC/∂q = ∂VC/∂q. Short-run AVC: SAVC = VC(q)/q. Short-run supply: q*(p) from p = SMC(q) for p ≥ min(SAVC); zero otherwise. Fixed costs do not enter the supply decision.`,
    derivation: `1. Fixed costs are sunk: they are paid regardless of whether the firm produces, so they cannot be avoided by shutting down. Sunk costs do not affect the marginal decision about whether to produce more or less. 2. Variable costs are avoidable: if the firm shuts down, it saves all variable costs. Produce if TR ≥ VC, i.e., p·q ≥ VC(q), i.e., p ≥ AVC. 3. Therefore the short-run supply rule: operate where p = SMC provided p ≥ SAVC; shut down when p < SAVC. Fixed costs affect whether the firm is profitable, but not whether it operates. 4. This is why a firm can rationally operate at a loss in the short run: if p < ATC but p > AVC, operating covers variable costs and contributes some revenue toward unavoidable fixed costs.`,
    graphicalIntuition: `The firm's short-run supply curve begins at the minimum of the SAVC curve (the shutdown point) and follows the SMC curve upward. It lies below the long-run supply curve at low quantities (because fixed capital cannot be adjusted) and may lie above the long-run supply curve at high quantities (capital is overutilized). The distance between SAVC and SATC at any quantity equals AFC = FC/q, which shrinks as q rises.`,
    workedExample: `Given: VC(q) = 2q² + 10q; FC = 50; market price p = $18.\nSolution: SMC = 4q + 10. SAVC = 2q + 10. Min(SAVC) at q = 0: SAVC_min = $10.\nSince p = $18 > $10 = SAVC_min, the firm operates. Set p = SMC: 18 = 4q + 10 → q* = 2. TR = 36. VC = 8 + 20 = 28. FC = 50. TC = 78. Profit = 36 − 78 = −$42.\nInterpret: The firm loses $42, but if it shuts down it loses $50 (fixed costs only). Operating reduces the loss by $8. Operating is correct even at a loss.`,
    boundaryConditions: `1. If fixed costs can be avoided (quasi-fixed costs, e.g., a lease that can be broken), they should be treated as variable for the shutdown decision. 2. In the long run all costs become variable, so the shutdown condition becomes p < min(LAC), not p < min(SAVC). The firm may shut down even while covering SAVC if it cannot cover long-run costs. 3. If the firm has multiple plants, the short-run supply is the horizontal sum of each plant's SMC curve above its own SAVC.`,
    examTraps: [
      `A student might think a firm should shut down whenever it is losing money (π < 0), but the correct answer is that the shutdown condition is p < SAVC, not p < ATC. If p > AVC, operating reduces losses by contributing toward fixed costs that are sunk regardless.`,
      `A student might think fixed costs affect the profit-maximizing quantity, but the correct answer is that fixed costs enter profit but not the FOC p = MC, because dFC/dq = 0. Fixed costs shift profit up or down but do not change the optimal quantity.`,
      `A student might think short-run and long-run supply are the same, but the correct answer is that short-run supply uses SMC and SAVC while long-run supply uses LMC and LAC, because in the long run all inputs are variable and fixed costs become avoidable.`
    ],
    frq: {
      prompt: `A manufacturing firm has variable costs VC(q) = q² + 4q and fixed costs FC = 100. The market price is p = $14.`,
      parts: [
        `Find SMC and SAVC. Determine the shutdown price (min SAVC).`,
        `Is p = $14 above or below the shutdown price? Find profit-maximizing output.`,
        `Calculate profit. Is it positive or negative? Explain why the firm should still operate.`,
        `If FC increases to $200 while VC and p remain the same, what happens to the profit-maximizing quantity? What happens to profit? Explain the logic.`
      ]
    }
  },
  flashcards: [
    { front: `What is the shutdown condition in the short run?`, back: `Shut down when p < min(SAVC) — price is below average variable cost at every output level. When p < SAVC, the firm cannot cover even variable costs, so producing generates losses larger than the fixed cost alone. By shutting down, the firm limits its loss to fixed costs. Operating worsens losses when p < AVC.`, type: `condition` },
    { front: `Why might a firm operate even when it is earning negative profit?`, back: `Fixed costs are sunk — paid whether or not the firm produces. If p > AVC, operating covers variable costs and contributes to fixed costs, reducing the loss below what it would be if the firm shut down (where the loss equals all fixed costs). Operating at a loss is rational as long as TR > VC, i.e., p > AVC.`, type: `condition` },
    { front: `Do fixed costs affect the profit-maximizing quantity in the short run?`, back: `No. The FOC p = MC involves only marginal cost, and dFC/dq = 0 — fixed costs do not change with output. Fixed costs affect total profit (shifting it down) but not the optimal output choice. This is why sunk costs are irrelevant to forward-looking decisions.`, type: `condition` },
    { front: `What is the difference between the short-run and long-run shutdown condition?`, back: `Short run: shut down if p < min(SAVC) — because fixed costs are sunk and cannot be avoided regardless. Long run: exit if p < min(LAC) — because in the long run all costs are variable and can be avoided by exiting. A firm that covers SAVC but not LAC will operate short-run but exit long-run.`, type: `distinction` }
  ]
},

t105: {
  learn: {
    openingTension: `A gas station owner pays $10,000/month rent on a 5-year lease, but is only making $7,000/month in revenue and $4,000/month in labor and fuel costs. Should she close? Most people say yes. Economics says: it depends.`,
    coreIdea: `A firm shuts down in the short run only when price falls below average variable cost — not when it falls below average total cost — because fixed costs are unavoidable regardless of the production decision.`,
    mathSetup: `Shutdown condition (short run): Produce if TR ≥ TVC, i.e., p·q ≥ VC(q) for some q > 0. Equivalently: p ≥ min(AVC). Shut down (q = 0) if p < min(AVC). The shutdown price = min(AVC). Profit from operating: π_op = p·q − VC(q) − FC. Profit from shutting down: π_sd = −FC. Operate if π_op ≥ π_sd, i.e., if p·q ≥ VC(q).`,
    derivation: `1. Shut down means q = 0. Profit from shutdown: π = −FC (only fixed costs remain). 2. Operating at the optimal q*: π = TR − VC(q*) − FC. 3. Firm prefers to operate when TR − VC(q*) − FC ≥ −FC, i.e., TR ≥ VC(q*), i.e., TR/q ≥ VC/q, i.e., p ≥ AVC. 4. Therefore: shut down if p < AVC(q*) at the optimum, or equivalently if p < min(AVC). 5. Economic intuition: fixed costs are paid regardless. The relevant comparison is whether revenue covers the costs that can actually be avoided by shutting down — variable costs only.`,
    graphicalIntuition: `On the cost diagram, the shutdown point is where the AVC curve reaches its minimum. The supply curve begins at this point, not at the minimum of ATC. Between min(AVC) and min(ATC), the firm operates at a loss but still produces. Only below min(AVC) does the firm shut down. The gap between ATC and AVC at any quantity is AFC = FC/q, which falls as q rises — this is why ATC and AVC converge as output grows.`,
    workedExample: `Gas station: Revenue p = $7,000/month (treat as price × quantity). Variable costs (labor + fuel) = $4,000/month. Fixed costs (rent on 5-year lease) = $10,000/month. Profit = 7,000 − 4,000 − 10,000 = −$7,000.\nShutdown profit: −FC = −$10,000. Operate: −$7,000 > −$10,000. Operate.\nInterpret: Closing reduces profit from −$7,000 to −$10,000. The owner should remain open because she covers variable costs and contributes $3,000 toward the unavoidable rent. She should exit when the lease expires (long run).`,
    boundaryConditions: `1. Long-run exit condition is different: exit if p < min(LAC) in the long run, when all costs become variable and avoidable. A firm that passes the short-run shutdown test may still choose to exit the industry when it can renegotiate all contracts. 2. Quasi-fixed costs: some fixed costs can be avoided with enough lead time (e.g., breaking a lease with a penalty). Treat the avoidable portion as variable for the shutdown decision. 3. If the firm faces irreversible investment (no exit option), the shutdown condition may differ when uncertainty is present.`,
    examTraps: [
      `A student might think a firm shuts down when p < ATC, but the correct answer is that the shutdown condition is p < AVC, not p < ATC. Between AVC and ATC, the firm covers variable costs and contributes something toward unavoidable fixed costs — operating is still better than shutting down.`,
      `A student might think fixed costs should influence the shutdown decision because they are large, but the correct answer is that only avoidable costs matter for the shutdown decision. Fixed costs are sunk in the short run — they are paid regardless and cannot be escaped by stopping production.`,
      `A student might think the firm should always shut down when losing money, but the correct answer depends on what the alternative is. Shutting down means π = −FC; operating means π = TR − VC − FC. If TR > VC, operating is less bad even if still negative.`
    ],
    frq: {
      prompt: `A firm has fixed costs of $200 and variable costs VC(q) = 3q² − 12q + 20 for q > 0. The market price is p = $9.`,
      parts: [
        `Find AVC(q) and determine the minimum AVC. At what quantity is AVC minimized?`,
        `Should the firm operate at p = $9? Justify using the shutdown condition.`,
        `If the firm operates, find the profit-maximizing quantity using the FOC. Calculate total profit.`,
        `Suppose fixed costs rise to $500. Does this change the firm's short-run operating decision? Does it change long-run exit decisions? Explain.`
      ]
    }
  },
  flashcards: [
    { front: `State the short-run shutdown condition precisely.`, back: `Shut down (produce q = 0) if p < min(AVC). Equivalently, shut down if total revenue falls short of total variable costs at every possible output: TR < VC for all q > 0. Above the shutdown price, produce where p = MC.`, type: `condition` },
    { front: `Why is the shutdown condition p < AVC rather than p < ATC?`, back: `Fixed costs are sunk — paid regardless of whether the firm produces. So the relevant comparison is between revenue and avoidable costs (variable costs). If TR ≥ VC, operating reduces loss compared to shutting down even if TR < TC. The profit from operating minus profit from shutting down equals TR − VC, which is non-negative when p ≥ AVC.`, type: `distinction` },
    { front: `What is the firm's loss if it shuts down vs. operates when p is between AVC and ATC?`, back: `Shuts down: loss = FC. Operates: loss = FC − (TR − VC) = FC − (p − AVC)q < FC. Operating reduces the loss by the amount TR − VC, which is positive when p > AVC. So operating is less costly even though the firm is still losing money. This is why firms in competitive industries can operate at a loss temporarily.`, type: `condition` },
    { front: `Distinguish: short-run shutdown vs. long-run exit.`, back: `Short-run shutdown: stop producing in the current period but remain in the industry (still own capital). Occurs when p < min(SAVC). Long-run exit: leave the industry entirely, sell all assets. Occurs when p < min(LAC). A firm can shut down in the short run without exiting long-run, or operate short-run while planning to exit long-run once contracts expire.`, type: `distinction` }
  ]
},

t106: {
  learn: {
    openingTension: `When gasoline prices rise, consumers are clearly worse off. Are producers better off by exactly as much? Or does the distribution of gains and losses depend on how steep the supply curve is?`,
    coreIdea: `Producer surplus is the amount a producer receives above and beyond the minimum they would have accepted — graphically the area above the supply curve and below the market price — and equals revenue minus variable cost (not profit, which also subtracts fixed costs).`,
    mathSetup: `PS = TR − TVC = p*·q* − ∫₀^{q*} MC(q) dq = ∫₀^{q*} [p* − MC(q)] dq. This is the area of the region bounded above by the horizontal price line at p* and below by the supply (MC) curve, from q = 0 to q = q*. Relationship to profit: π = PS − FC. So PS = π + FC.`,
    derivation: `1. The supply curve shows the minimum price at which each unit will be supplied (the marginal cost of that unit). 2. The producer receives p* for every unit. So the producer gets p* − MC(q) of surplus on each unit where p* > MC(q). 3. Summing over all units: PS = ∫₀^{q*} [p* − MC(q)] dq = p*q* − ∫₀^{q*} MC(q) dq = TR − TVC. 4. Economic interpretation: PS measures the net benefit to producers from participating in the market at price p*. 5. PS ≠ profit because profit subtracts fixed costs: π = TR − TVC − FC = PS − FC.`,
    graphicalIntuition: `On the supply-demand diagram, producer surplus is the triangle (or trapezoid) between the horizontal price line and the upward-sloping supply curve. When price rises, PS increases: the triangle grows both taller (higher price on existing units) and wider (additional units are now profitable to produce). When supply is steeper (more inelastic), PS is larger relative to quantity, because producers must be paid little extra to increase supply.`,
    workedExample: `Given: Market supply S(p) = 2p − 4 (implying p = q/2 + 2 on the inverse supply). Market price p* = $6.\nSolution: Optimal quantity: q* = 2(6) − 4 = 8. TR = 48. TVC = area under MC curve = ∫₀^8 (q/2 + 2) dq = [q²/4 + 2q]₀^8 = 16 + 16 = 32. PS = 48 − 32 = $16. Graphically: PS = (1/2)(6 − 2)(8) = $16. ✓\nInterpret: Producers receive $16 more than needed to induce them to supply 8 units at $6 each. If fixed costs = $5, then profit = 16 − 5 = $11.`,
    boundaryConditions: `1. When supply is perfectly elastic (horizontal), PS = 0 — producers receive exactly what they need to supply each unit, with no surplus. 2. When supply is perfectly inelastic (vertical), PS = TR — all revenue is surplus because producers supply Q regardless of price. 3. PS changes with tax: a per-unit tax rotates the supply curve up, reducing PS by more than the tax revenue collected when supply is not perfectly inelastic.`,
    examTraps: [
      `A student might think producer surplus equals profit, but the correct answer is that PS = profit + fixed costs = TR − TVC, whereas profit = TR − TC = TR − TVC − FC. PS is always ≥ profit; they are equal only when FC = 0.`,
      `A student might think PS is the area above the price line and below the supply curve, but the correct answer is that PS is the area BELOW the price line and ABOVE the supply curve. Consumer surplus is above demand and below price; producer surplus is below price and above supply — a common reversal error.`,
      `A student might think PS always increases when price rises, but the correct answer is that PS increases for existing producers but new entrants may earn zero PS at the margin. In a competitive long-run equilibrium with free entry, the marginal firm earns zero PS, though inframarginal firms may still earn positive PS.`
    ],
    frq: {
      prompt: `The market supply curve is p = 2 + 0.5q. The equilibrium price is p* = $7.`,
      parts: [
        `Find equilibrium quantity supplied. Calculate producer surplus using the triangle formula.`,
        `Verify PS = TR − TVC by computing each component separately.`,
        `If the market price rises to $9, calculate the new PS and the change in PS. Decompose the change into: (a) gain on existing units and (b) gain from new units produced.`,
        `A firm in this market has fixed costs of $10. What is its profit at p* = $7? Explain why PS and profit differ.`
      ]
    }
  },
  flashcards: [
    { front: `Define producer surplus.`, back: `The amount producers receive above the minimum they would have accepted: PS = TR − TVC = ∫₀^{q*}[p* − MC(q)]dq. Graphically, it is the area below the market price and above the supply curve. PS measures the net benefit to sellers from trading at the equilibrium price.`, type: `definition` },
    { front: `Distinguish: producer surplus vs. profit.`, back: `PS = TR − TVC (revenue minus variable cost). Profit = TR − TVC − FC = PS − FC. Producer surplus ignores fixed costs; profit accounts for all costs. PS ≥ profit always; they are equal only when fixed costs are zero. Welfare analysis uses PS (including entry/exit), not firm-level profit.`, type: `distinction` },
    { front: `How does producer surplus change when market price rises?`, back: `PS increases for two reasons: (1) higher price on existing output — each unit already being produced earns more surplus; (2) additional output — the firm produces more units, each earning p* − MC surplus. The total increase in PS equals the area of the new trapezoid added to the left side of the supply diagram.`, type: `condition` },
    { front: `What is producer surplus when supply is perfectly elastic?`, back: `Zero. A horizontal supply curve means producers receive exactly their minimum willingness-to-accept for every unit — no surplus above the minimum. This occurs in constant-cost competitive industries in the long run, where entry ensures price equals min(LAC) and every firm earns zero PS (zero economic profit).`, type: `condition` }
  ]
},

t107: {
  learn: {
    openingTension: `One farm's supply curve slopes upward. Ten thousand farms' supply curves slope upward. Does the market supply curve also slope upward? Yes — but the reason is not just aggregation. It also depends on how quickly new firms can enter.`,
    coreIdea: `Market supply is the horizontal summation of individual firm supply curves in the short run; in the long run, the number of firms adjusts through entry and exit, making market supply more elastic than any individual firm's supply.`,
    mathSetup: `Short-run market supply: Q^S(p) = Σᵢ qᵢ*(p) — sum over all n active firms. If firms are identical: Q^S(p) = n·q*(p). Long-run market supply: p* = min(LAC) if industry is constant cost; adjusts upward or downward if input prices change with industry size. Long-run supply is a horizontal line at p* = min(LAC) for a constant-cost industry.`,
    derivation: `1. Short run — fixed number of firms: Each firm supplies qᵢ*(p) from p = MC_i(q). Sum horizontally: at each price p, add up the quantities all firms wish to supply. Result: Q^S(p) = Σqᵢ*(p). 2. Long run — free entry: If p > min(LAC), positive profit attracts entry, increasing supply and reducing p until p = min(LAC). If p < min(LAC), losses drive exit, reducing supply and raising p until p = min(LAC). So long-run supply is pinned at p* = min(LAC) for a constant-cost industry — it is perfectly elastic. 3. Horizontal summation rule: at each price, add quantities (not prices). This is why more firms make market supply flatter (more elastic).`,
    graphicalIntuition: `To sum supply curves horizontally: at any fixed price p, draw a vertical line and read off each firm's quantity — then add them. The resulting market supply curve is always to the right of any individual firm's supply and (with many firms) much flatter. In the long run, entry makes market supply horizontal at p* = min(LAC). The industry's long-run supply curve is flatter than any individual firm's supply curve.`,
    workedExample: `Given: 100 identical firms, each with supply qᵢ*(p) = 2p − 4 for p ≥ 2; qᵢ* = 0 for p < 2.\nMarket supply: Q^S(p) = 100(2p − 4) = 200p − 400 for p ≥ 2.\nIf market demand is Q^D(p) = 1600 − 200p, find equilibrium.\nSolution: 200p − 400 = 1600 − 200p → 400p = 2000 → p* = $5. Q* = 200(5) − 400 = 600. Each firm supplies q* = 2(5) − 4 = 6 units.\nInterpret: 100 firms, each producing 6 units, sum to 600 total — the market clears.`,
    boundaryConditions: `1. Constant-cost industry: input prices don't change as the industry expands → LR supply is horizontal at min(LAC). 2. Increasing-cost industry: expansion bids up input prices → LR supply slopes upward; each new equilibrium has higher min(LAC). 3. Decreasing-cost industry: expansion lowers input prices (economies of scale in upstream sectors) → LR supply slopes downward. 4. Short-run vs. long-run elasticity: SR supply is always less elastic than LR supply for the same industry, because LR supply allows firm entry.`,
    examTraps: [
      `A student might think market supply is found by adding prices, but the correct answer is that supply curves are summed horizontally by adding quantities at each price. To sum supply curves, hold price fixed and add the quantities each firm wishes to supply at that price.`,
      `A student might think long-run market supply always slopes upward like short-run supply, but the correct answer is that in a constant-cost industry with free entry, long-run market supply is horizontal — new firms enter until price equals min(LAC), regardless of quantity demanded.`,
      `A student might think more firms always make market supply more inelastic, but the correct answer is the opposite: more firms make market supply more elastic (flatter), because any given price change induces quantity adjustments from more firms.`
    ],
    frq: {
      prompt: `A competitive industry has 50 identical firms, each with supply qᵢ = 3p − 6 for p ≥ 2. Market demand is Q^D = 1,400 − 50p.`,
      parts: [
        `Derive the short-run market supply function Q^S(p).`,
        `Find short-run equilibrium price and quantity. How much does each firm produce?`,
        `At the short-run equilibrium, each firm earns $20 in economic profit. Describe what happens in the long run and identify the long-run equilibrium condition.`,
        `Explain why the long-run market supply curve is more elastic than any individual firm's supply curve.`
      ]
    }
  },
  flashcards: [
    { front: `How is market supply derived from individual firm supply?`, back: `Horizontal summation: at each price p, sum the quantities all active firms wish to supply — Q^S(p) = Σqᵢ*(p). With n identical firms each supplying q*(p), market supply = n·q*(p). The key: add quantities at fixed prices, not prices at fixed quantities. Market supply is flatter (more elastic) than any individual firm's supply.`, type: `definition` },
    { front: `Why is long-run market supply more elastic than short-run market supply?`, back: `In the long run, the number of firms can adjust. If price rises above min(LAC), new firms enter, expanding supply until price returns to min(LAC). This makes long-run supply perfectly elastic (horizontal) in a constant-cost industry. Short-run supply uses only the existing n firms' MC curves and is upward-sloping.`, type: `distinction` },
    { front: `What determines the long-run equilibrium price in a competitive industry?`, back: `The minimum of long-run average cost (min LAC). Free entry ensures any price above min(LAC) attracts entrants, driving price down. Any price below min(LAC) causes exit, pushing price up. Long-run equilibrium: p* = min(LAC), with zero economic profit and a horizontal long-run supply curve (in constant-cost industries).`, type: `condition` }
  ]
},

t108: {
  learn: {
    openingTension: `Uber drivers flood the streets when surge pricing hits $4/mile. When pricing returns to $1/mile, many log off. The number of active suppliers adjusts instantly. How does economics formalize this entry-and-exit logic, and what does it imply for long-run prices?`,
    coreIdea: `Firms enter a competitive industry when economic profit is positive and exit when it is negative, and this process continues until long-run equilibrium: zero economic profit at the minimum of long-run average cost.`,
    mathSetup: `Entry condition: π = (p − LAC(q))·q > 0, i.e., p > min(LAC). Exit condition: π < 0, i.e., p < min(LAC). Long-run equilibrium: π = 0 and p = MC = min(LAC). Entry shifts the market supply curve rightward (increases supply, reduces price). Exit shifts it leftward (reduces supply, increases price). Adjustment continues until p* = min(LAC).`,
    derivation: `1. Suppose p > min(LAC): firms earn positive profit. New firms enter, attracted by above-normal returns. Entry increases market supply → shifts supply right → market price falls. 2. Entry continues until π → 0: the process stops when p falls back to min(LAC). 3. Suppose p < min(LAC): firms earn negative profit (losses). Firms exit. Exit reduces market supply → shifts supply left → market price rises. 4. Exit continues until π → 0: price rises back to min(LAC). 5. Long-run equilibrium: p* = min(LAC), q* chosen so p* = LMC(q*) = LAC(q*) (i.e., at the minimum of LAC). Every active firm earns zero economic profit.`,
    graphicalIntuition: `On a two-panel diagram (firm on left, market on right): when market price is above min(LAC), individual firms earn profit (rectangle between p and ATC is positive). New firms enter, the market supply curve shifts right, and the market price falls. Equilibrium is restored when price returns to min(LAC) and the profit rectangle collapses to zero. The adjustment is the entire story of long-run competition.`,
    workedExample: `Market: Q^D = 1000 − 10p. Each firm: LAC minimized at q* = 5 units, min(LAC) = $20. Current price p = $30. Entry: π = (30 − 20)·5 = $50 per firm. Entry continues. New equilibrium: p* = $20, Q* = 1000 − 10(20) = 800 units, number of firms n* = 800/5 = 160 firms. If initially 100 firms, then 60 new firms entered.\nInterpret: Entry exactly restored zero profit. The market absorbed demand growth by adding firms, not by raising price.`,
    boundaryConditions: `1. Barriers to entry prevent this adjustment: patents, licenses, sunk costs, or economies of scale can keep incumbent firms earning positive economic profit indefinitely. 2. Adjustment takes time: the entry process is not instantaneous — construction, licensing, and financing create lags. Short-run and long-run supply differ because of these lags. 3. In decreasing-cost industries, entry actually lowers min(LAC) (through input market externalities), so the long-run equilibrium price falls as demand increases — downward-sloping LR supply.`,
    examTraps: [
      `A student might think entry stops when profit turns from positive to zero for the entrant, but the correct answer is that entry stops when the market price falls so that all firms — incumbents and new entrants alike — earn zero economic profit at min(LAC).`,
      `A student might think exit means firms shut down permanently, but the correct answer is that exit means leaving the industry (selling off capital), while shutdown is a short-run decision to produce zero while remaining in the industry. Exit is a long-run decision; shutdown is short-run.`,
      `A student might think the number of firms in long-run equilibrium is the same as in the short run, but the correct answer is that it adjusts: n* = Q*(p*)/q*(p*), where Q* is market quantity at p* = min(LAC) and q* is the efficient scale.`
    ],
    frq: {
      prompt: `A competitive industry is in long-run equilibrium with 80 firms, each producing 10 units at min(LAC) = $15. Market demand increases to Q^D = 900 + 20p.`,
      parts: [
        `Identify the short-run impact of the demand increase on market price and output, assuming the number of firms stays at 80.`,
        `Explain the long-run adjustment process. What will happen to the number of firms and the market price?`,
        `Find the long-run equilibrium number of firms and market output if each firm still produces 10 units at p* = $15 in the long run.`,
        `Draw a supply-demand diagram showing the short-run and long-run responses to the demand shift (describe the shift, not a literal drawing).`
      ]
    }
  },
  flashcards: [
    { front: `What triggers entry and exit in a competitive industry?`, back: `Entry is triggered when economic profit π > 0, i.e., p > min(LAC). Exit is triggered when economic profit π < 0, i.e., p < min(LAC). Both processes continue until π = 0 — long-run equilibrium where p = min(LAC). The speed of adjustment depends on barriers to entry, construction lags, and asset liquidity.`, type: `condition` },
    { front: `What is the long-run competitive equilibrium condition?`, back: `Three conditions must hold simultaneously: (1) p* = MC (firm optimizes), (2) p* = min(LAC) (zero economic profit — no entry or exit incentive), (3) Q^S(p*) = Q^D(p*) (market clears). These jointly imply production at the minimum efficient scale.`, type: `condition` },
    { front: `Distinguish: shutdown vs. exit.`, back: `Shutdown: a short-run decision to produce q = 0 while remaining in the industry (fixed costs still being paid). Occurs when p < min(AVC). Exit: a long-run decision to leave the industry entirely, liquidating all assets. Occurs when p < min(LAC). A firm can shut down without exiting (temporarily idle); it exits only when the long-run condition fails.`, type: `distinction` },
    { front: `How does free entry affect the long-run market supply curve?`, back: `Free entry makes long-run market supply perfectly elastic (horizontal) at p* = min(LAC) in a constant-cost industry. The industry can supply any quantity at p* because the number of firms adjusts: demand increases bring in more firms, not higher prices. Long-run supply is horizontal even though each firm's supply is upward-sloping.`, type: `condition` }
  ]
},

t109: {
  learn: {
    openingTension: `A law firm earns $500,000 in revenue, pays $300,000 in expenses, and the lead partner takes home $150,000 profit. But an economist says the firm earns zero economic profit. Who is right, and why does it matter?`,
    coreIdea: `Zero economic profit means a firm is earning exactly the normal return on its resources — covering all opportunity costs including the owner's time and capital — not that it is earning literally nothing or failing.`,
    mathSetup: `Economic profit: π_econ = TR − explicit costs − implicit costs (opportunity costs). Accounting profit: π_acct = TR − explicit costs only. Relationship: π_econ = π_acct − implicit costs. In long-run competitive equilibrium: π_econ = 0, which implies π_acct = implicit costs (normal return). Implicit costs include: forgone salary from best alternative employment, forgone return on capital invested elsewhere.`,
    derivation: `1. Opportunity cost of capital: the owner invests $1M in the firm. The forgone return (e.g., 8% in financial markets) = $80,000/year — this is an economic cost even though no check is written. 2. Opportunity cost of labor: the owner could earn $120,000/year working for a competitor — this forgone salary is an economic cost even though the owner "pays" themselves from profit. 3. Economic profit = revenue − all costs including these opportunity costs. 4. If economic profit = 0: TR = TC_economic = explicit costs + implicit costs. The firm is covering everything — it is doing as well as any alternative use of its resources. 5. Entry/exit logic: if π_econ > 0, new firms can earn above-normal returns by entering. If π_econ < 0, resources would be better deployed elsewhere. Only at π_econ = 0 is there no incentive to change.`,
    graphicalIntuition: `In the long-run equilibrium diagram, the firm produces at the minimum of its LAC curve, where p* = LAC(q*). The rectangle between price and ATC has zero height — economic profit is zero. But this is the ATC that includes opportunity costs, so the firm is still earning the normal rate of return on capital and covering the owner's implicit salary. "Breaking even" in economics is not the same as failing.`,
    workedExample: `Law firm: Revenue $500,000. Explicit costs: $300,000. Accounting profit: $200,000. Implicit costs: forgone salary $120,000 + forgone return on $1M invested at 8% = $80,000 → implicit costs = $200,000. Economic profit = $500,000 − $300,000 − $200,000 = $0.\nInterpret: The law firm earns zero economic profit. The owner earns exactly as much as the best alternative (working elsewhere + investing in the market). There is no incentive to enter or exit. This is exactly the long-run competitive equilibrium outcome.`,
    boundaryConditions: `1. Inframarginal firms: even in long-run equilibrium, firms with lower costs (better location, superior management) can earn positive economic profit — called economic rent. Zero profit applies at the margin; the marginal entrant breaks even. 2. Short-run exceptions: in the short run, positive profit can persist until entry occurs. 3. Monopoly: a monopolist earns positive economic profit in the long run if barriers prevent entry. The zero-profit result requires free entry.`,
    examTraps: [
      `A student might think zero economic profit means the firm earns no money and should close, but the correct answer is that zero economic profit means the firm is earning exactly the normal return — covering all opportunity costs. The firm is doing as well as any alternative use of its resources. It should stay open.`,
      `A student might think accounting profit and economic profit are the same, but the correct answer is that accounting profit ignores opportunity costs (forgone salary, forgone return on capital). Economic profit = accounting profit − implicit costs. A firm with positive accounting profit can have zero or even negative economic profit.`,
      `A student might think positive accounting profit always attracts entry, but the correct answer is that entry is attracted by positive ECONOMIC profit. If accounting profit equals normal return on capital and owner's salary, economic profit is zero — no entry occurs.`
    ],
    frq: {
      prompt: `Maria operates a bakery. Revenue: $180,000/year. Explicit costs (ingredients, rent, staff): $110,000/year. Maria could earn $60,000/year working at another bakery. She invested $100,000 in equipment; the best alternative investment would yield 10%/year.`,
      parts: [
        `Calculate Maria's accounting profit.`,
        `Identify all implicit costs and calculate Maria's economic profit.`,
        `Is the bakery in economic equilibrium? Should Maria continue to operate? Explain using opportunity cost logic.`,
        `An economist says "competitive markets drive economic profit to zero in the long run." Does this mean Maria will eventually earn no income? Explain carefully.`
      ]
    }
  },
  flashcards: [
    { front: `What does "zero economic profit" mean? Does it mean the firm earns nothing?`, back: `No. Zero economic profit means the firm earns exactly the normal return on all its resources — covering explicit costs AND opportunity costs (implicit costs like forgone salary and forgone investment return). The firm is doing as well as it would in any alternative use of its resources, giving no incentive to enter or exit. It is not failing; it is earning the normal rate of return.`, type: `definition` },
    { front: `Distinguish: economic profit vs. accounting profit.`, back: `Accounting profit = TR − explicit costs (cash expenditures only). Economic profit = TR − explicit costs − implicit costs (opportunity costs). Implicit costs include forgone salary the owner could earn elsewhere and forgone return on invested capital. Economic profit ≤ accounting profit; the gap equals implicit costs. Long-run competition drives economic profit to zero, not accounting profit to zero.`, type: `distinction` },
    { front: `Why does free entry drive economic profit to zero rather than accounting profit to zero?`, back: `A firm enters if it can earn more than its next best alternative — that is, if economic profit is positive. Once economic profit = 0, there is no gain from entry: the firm earns exactly what it could earn elsewhere. At this point, accounting profit equals implicit costs (normal return). Entry stops when no further gain is available, which is when economic profit = 0, not when accounting profit = 0.`, type: `condition` },
    { front: `What is the "normal rate of return"?`, back: `The return on capital that just compensates the owner for the opportunity cost of investing in this business rather than the next best alternative (e.g., the stock market or a bond). It is an economic cost, not economic profit. A firm earning exactly the normal rate of return has zero economic profit and will neither enter nor exit.`, type: `definition` },
    { front: `Can a firm earn zero economic profit yet have the owner receive a salary?`, back: `Yes. If the owner's market wage (opportunity cost of their time) is included as an implicit cost, then zero economic profit already accounts for a "salary" equal to the market wage. The owner earns their opportunity cost — exactly what they would earn by working elsewhere. Zero economic profit does not mean the owner works for free.`, type: `condition` }
  ]
},

t110: {
  learn: {
    openingTension: `A market is in short-run equilibrium with firms earning profit. If you fast-forward ten years, what does the market look like? And why does it always end up at the same price — the minimum of the long-run average cost curve — regardless of where demand started?`,
    coreIdea: `Long-run competitive equilibrium requires three simultaneous conditions: price equals marginal cost (firm optimization), price equals minimum long-run average cost (zero economic profit), and market supply equals market demand (market clearing) — jointly pinning price at the efficient scale of production.`,
    mathSetup: `Three conditions must hold simultaneously: (1) p* = LMC(q*) — each firm profit-maximizes. (2) p* = min(LAC) — zero economic profit, no entry or exit incentive. (3) Q^D(p*) = n*·q* — market clears, where n* is the equilibrium number of firms. These three equations determine p*, q* (firm output), and n* (number of firms). Note: conditions (1) and (2) together imply LMC = LAC at q*, which occurs only at the minimum of LAC.`,
    derivation: `1. Profit maximization (Condition 1): every active firm sets p = LMC. 2. Free entry/exit (Condition 2): positive economic profit attracts entry (supply increases, price falls); negative profit causes exit (supply decreases, price rises). Equilibrium requires π = 0, i.e., p = LAC(q). Combined with Condition 1: p = LMC = LAC. This holds only at the minimum of the LAC curve. 3. Market clearing (Condition 3): with p* = min(LAC) and n* firms each producing q*, total supply n*·q* must equal quantity demanded at p*. This pins n* = Q^D(p*)/q*. 4. Why this is efficient: each unit produced costs society exactly what consumers value it at (p = MC), and production occurs at minimum average cost — the lowest possible unit cost.`,
    graphicalIntuition: `Two-panel diagram. Left panel (firm): U-shaped LAC curve; price line tangent to LAC at its minimum; firm produces q* where p* = LMC = min(LAC). Zero-profit rectangle: price exactly equals ATC at q*, so no profit rectangle exists. Right panel (market): demand curve intersecting horizontal long-run supply at p* = min(LAC); market quantity Q* = n*·q*. The number of firms adjusts so the market panel clears exactly at p*.`,
    workedExample: `Market demand: Q^D = 1000 − 20p. Each firm: LAC minimized at q* = 10 units, min(LAC) = $20. Find LR equilibrium.\nSolution: p* = min(LAC) = $20. Q* = Q^D(20) = 1000 − 20(20) = 600 units. n* = Q*/q* = 600/10 = 60 firms.\nSuppose currently 80 firms are active (short-run): supply = 80·10 = 800 (too much at p = 20). Short-run: price falls below $20; firms lose money; 20 firms exit. Long-run: 60 firms remain, each producing 10 at p* = $20.\nInterpret: Entry/exit restored zero-profit equilibrium. Market quantity shrank not because of lost demand, but because high-cost capacity exited.`,
    boundaryConditions: `1. Non-constant returns to scale: if LAC is everywhere decreasing, there is no finite minimum — the natural monopoly case. Competitive equilibrium may not exist. 2. Barriers to entry: patents, regulation, and sunk costs prevent entry, so positive economic profit can persist. The zero-profit condition requires truly free entry. 3. Heterogeneous firms: low-cost firms may earn positive economic rent even in long-run equilibrium — the zero-profit condition holds for the marginal firm, not necessarily for all firms. 4. Increasing-cost industry: as n* rises, input prices rise, pushing up min(LAC) — the LR supply curve slopes upward rather than being flat.`,
    examTraps: [
      `A student might think zero economic profit means the firm is barely surviving and will soon exit, but the correct answer is that zero economic profit is the stable long-run equilibrium condition — the firm is earning exactly the normal rate of return on all resources and has no incentive to exit.`,
      `A student might think accounting profit is also zero in long-run equilibrium, but the correct answer is that economic profit is zero, not accounting profit. Accounting profit equals implicit costs (normal return on capital plus owner's opportunity wage), which can be substantial.`,
      `A student might think entry continues until firms are earning negative profit, but the correct answer is that entry stops precisely when economic profit falls to zero — rational entrants stop entering the moment the marginal entrant breaks even. Overshoot (negative profit) triggers exit that restores equilibrium.`,
      `A student might think the long-run equilibrium number of firms is determined by supply alone, but the correct answer is that n* = Q^D(p*)/q*, determined jointly by demand (which sets Q*) and firm technology (which sets q* = efficient scale). A demand increase raises n*, not p*.`
    ],
    frq: {
      prompt: `A competitive industry has each firm's long-run average cost minimized at q* = 20 units at a cost of $30/unit. Market demand is Q^D = 2,400 − 40p.`,
      parts: [
        `Identify the long-run equilibrium price and verify that each firm earns zero economic profit at this price.`,
        `Find the long-run equilibrium quantity and number of firms.`,
        `Demand shifts to Q^D = 3,200 − 40p. Describe the short-run impact (assume 60 firms). Then describe the long-run adjustment and find the new long-run equilibrium number of firms.`,
        `Does a positive demand shock permanently raise the market price in a constant-cost industry? Explain using the entry/exit mechanism.`
      ]
    }
  },
  flashcards: [
    { front: `State the three conditions that must hold simultaneously in long-run competitive equilibrium.`, back: `(1) p* = LMC(q*) — each firm profit-maximizes. (2) p* = min(LAC) — zero economic profit, no entry or exit incentive. (3) Q^D(p*) = n*·q* — market clears. Together they determine p* (the min LAC price), q* (efficient firm scale), and n* (number of firms). All three must hold simultaneously.`, type: `condition` },
    { front: `Why does long-run equilibrium occur at the minimum of the LAC curve?`, back: `Conditions (1) and (2) together require p = LMC AND p = LAC. These two equalities hold simultaneously only at the minimum of the LAC curve, where LMC = LAC. At any other point, either LMC < LAC (decreasing returns haven't been exhausted) or LMC > LAC (beyond minimum scale). The efficient scale q* is exactly where these curves cross.`, type: `condition` },
    { front: `Zero economic profit in LR equilibrium — does the firm earn money?`, back: `Yes. Zero economic profit means the firm covers all costs including opportunity costs: it earns the normal return on capital and the owner earns their market wage. Accounting profit equals implicit costs (normal return). The firm earns what it would earn in its next best alternative — no more, no less. It has no incentive to exit.`, type: `definition` },
    { front: `How is n*, the number of firms, determined in LR equilibrium?`, back: `n* = Q^D(p*)/q*, where p* = min(LAC) and q* is the efficient scale. Market demand at the equilibrium price determines total market output Q*, and each firm produces q* units, so the industry needs n* = Q*/q* firms to clear the market. A demand increase raises n* (more firms enter), not p* (which stays at min LAC in a constant-cost industry).`, type: `condition` },
    { front: `If a demand shock causes short-run positive profit, what happens to price in the long run (constant-cost industry)?`, back: `Price returns to p* = min(LAC). Positive profit attracts entry → supply increases → price falls back to min(LAC). The long-run effect of a demand shock in a constant-cost industry is a larger quantity at the same price — the supply curve is horizontal at p* = min(LAC). Market output rises entirely from more firms, not from higher prices.`, type: `condition` },
    { front: `Distinguish short-run vs. long-run response to a demand increase.`, back: `Short run: price rises above min(LAC), existing firms produce more (move up SMC curve), industry earns positive economic profit. Long run: entry occurs, supply shifts right, price falls back to min(LAC). Output rises beyond short-run level because new firms add capacity. The short-run response involves price and quantity changes; the long-run response restores the original price with a higher number of firms.`, type: `distinction` },
    { front: `What happens to the number of firms if demand decreases in LR?`, back: `n* falls. Lower demand at p* = min(LAC) means lower Q*, so n* = Q*/q* decreases. The adjustment: demand falls → short-run price drops below min(LAC) → negative economic profit → firms exit → supply decreases → price returns to min(LAC) → new, smaller n*. Market shrinks by losing firms, not by cutting firm-level output permanently.`, type: `condition` },
    { front: `What is the long-run supply curve in a constant-cost competitive industry?`, back: `A horizontal line at p* = min(LAC). The industry can supply any quantity at this price by adjusting the number of firms (n* = Q/q*). The long-run supply curve is perfectly elastic — a price above min(LAC) attracts unlimited entry, and below min(LAC) causes unlimited exit, so the market price gravitates back to min(LAC).`, type: `definition` },
    { front: `In LR equilibrium, does the firm produce at minimum ATC?`, back: `Yes. In long-run equilibrium, p* = min(LAC), and the firm chooses q* where LMC = p*. Since p* = LAC at the same q*, we must have LMC = LAC = p*, which occurs at the minimum of LAC. So the firm produces at minimum efficient scale — the output level that minimizes average cost.`, type: `condition` },
    { front: `Why can't positive economic profit persist indefinitely in a competitive industry with free entry?`, back: `Positive economic profit signals that resources earn above-normal returns in this industry. Entrepreneurs, observing this, shift resources here: they hire inputs, build capacity, and enter. This increases market supply, driving down price until economic profit returns to zero. As long as entry is free (no barriers), this process is unstoppable in equilibrium.`, type: `condition` },
    { front: `What economic concept underlies the claim that LR competitive equilibrium is "efficient"?`, back: `In LR competitive equilibrium, p = MC (allocative efficiency — each unit where MB ≥ MC is produced) and p = min(LAC) (productive efficiency — output is produced at the lowest possible average cost). Together these imply no waste: units are produced only if valued above cost, and they are produced as cheaply as technically possible. The First Welfare Theorem formalizes this.`, type: `definition` }
  ]
},

t111: {
  learn: {
    openingTension: `If every firm in an industry doubles in size and prices its good at cost, would the market price stay the same, rise, or fall? It depends entirely on what happens to input prices as the industry expands — a fact that completely changes the shape of the long-run supply curve.`,
    coreIdea: `Industries are classified by how input prices respond to industry expansion: constant-cost (inputs unaffected, LR supply horizontal), increasing-cost (inputs bid up, LR supply upward-sloping), and decreasing-cost (inputs fall with scale, LR supply downward-sloping).`,
    mathSetup: `Let min(LAC) be a function of industry output Q: min(LAC) = f(Q). Constant cost: f′(Q) = 0 → LR supply horizontal at p* = f(Q). Increasing cost: f′(Q) > 0 → LR supply upward-sloping. Decreasing cost: f′(Q) < 0 → LR supply downward-sloping. The slope of the LR supply curve equals how fast min(LAC) changes as the industry expands.`,
    derivation: `1. Constant-cost industry: expanding industry buys a small fraction of each input market. Input prices are unchanged. min(LAC) is constant across industry sizes. LR supply is horizontal at p* = min(LAC). Any demand shock leaves p* unchanged; only n* (number of firms) adjusts. 2. Increasing-cost industry: expanding industry bids up prices of specialized inputs (land, skilled labor, raw materials). Higher input prices raise min(LAC) for every firm. LR supply slopes upward: a permanently higher demand leads to permanently higher price. 3. Decreasing-cost industry: expanding industry allows upstream suppliers to achieve scale economies or generates positive externalities (infrastructure, knowledge spillovers). Input prices fall. min(LAC) falls. LR supply slopes downward. A demand shock can lower equilibrium price.`,
    graphicalIntuition: `Trace the adjustment to a demand increase in each case. In all three, the short-run price spike is the same. But the new long-run equilibrium differs: (1) constant cost — price returns to the original level, supply is flat; (2) increasing cost — price settles at a higher level, supply slopes up; (3) decreasing cost — price settles at a lower level, supply slopes down. The slope of the LR supply curve connects old and new equilibria after entry completes.`,
    workedExample: `Lumber industry (increasing-cost): demand increases → short-run lumber price rises → entry of loggers → loggers compete for timberland → land prices rise → min(LAC) of each logger increases → new LR equilibrium has higher price than original. LR supply curve slopes upward. Economic rent goes to landowners.\nSemiconductor industry (decreasing-cost): demand increases → entry of chip makers → fixed R&D costs spread over more units, suppliers learn → min(LAC) falls → new LR equilibrium has lower price. LR supply curve slopes downward.\nWheat farming (constant-cost): demand increases → entry of farms → farms are small buyers of seeds and fertilizer from national markets → input prices unchanged → new equilibrium at same price, more farms.`,
    boundaryConditions: `1. Constant-cost is an approximation: truly no industry is perfectly constant-cost; the classification reflects whether input-price changes are negligible relative to other effects. 2. Decreasing-cost industries may require coordination or external investment (infrastructure) — private markets may under-provide, creating a rationale for subsidies or public provision. 3. Increasing returns at the firm level can coexist with increasing costs at the industry level if the industry's input demand is large relative to input supply.`,
    examTraps: [
      `A student might think increasing-cost industries produce more efficiently with more firms, but the correct answer is that increasing cost refers to input prices rising with industry size, not to inefficiency within firms. Each firm is still at its min(LAC) — it is just that min(LAC) shifts up as the industry grows.`,
      `A student might think decreasing-cost industries always exhibit economies of scale within each firm, but the correct answer is that decreasing cost at the industry level can arise from external economies (upstream scale, knowledge spillovers) that lower input prices, even if each individual firm has a U-shaped LAC.`,
      `A student might think the LR supply curve for any competitive industry is horizontal, but the correct answer is that only constant-cost industries have a horizontal LR supply. Increasing-cost and decreasing-cost industries have upward- and downward-sloping LR supply curves respectively.`
    ],
    frq: {
      prompt: `Consider three industries: (A) wheat farming, (B) construction, and (C) microchip manufacturing.`,
      parts: [
        `Classify each industry as constant-cost, increasing-cost, or decreasing-cost. Justify each classification by identifying the key input market mechanism.`,
        `For the increasing-cost industry, describe how a permanent demand increase affects the long-run equilibrium price compared to a constant-cost industry.`,
        `Sketch the long-run supply curve for each type of industry. Explain what determines the slope in each case.`,
        `In a decreasing-cost industry, could long-run equilibrium price fall below the initial equilibrium price after a demand increase? Explain the mechanism.`
      ]
    }
  },
  flashcards: [
    { front: `What determines whether an industry is constant-, increasing-, or decreasing-cost?`, back: `How input prices respond to industry expansion. Constant-cost: input prices unchanged as industry grows (LR supply horizontal). Increasing-cost: input prices bid up as industry grows (LR supply upward-sloping). Decreasing-cost: input prices fall as industry grows due to upstream scale economies or spillovers (LR supply downward-sloping).`, type: `definition` },
    { front: `What does the long-run supply curve look like in a constant-cost competitive industry?`, back: `Horizontal at p* = min(LAC). The industry can supply any quantity at this price because input prices are unaffected by industry size. A demand increase raises the number of firms and market output but not the price. LR supply is perfectly elastic in a constant-cost industry.`, type: `definition` },
    { front: `How does LR supply slope differ across the three industry types?`, back: `Constant-cost: horizontal (perfectly elastic). Increasing-cost: upward-sloping — entry bids up inputs, raising min(LAC) for all firms, so price must be higher to justify entry. Decreasing-cost: downward-sloping — entry lowers input costs through external economies, reducing min(LAC), so price falls further as quantity rises.`, type: `distinction` },
    { front: `In an increasing-cost industry, does a demand shock permanently raise the price?`, back: `Yes. Entry bids up specialized input prices, raising min(LAC). The new long-run equilibrium price is higher than the original. The LR supply curve connects the original and new equilibria with an upward slope. This contrasts with a constant-cost industry where price returns to its original level.`, type: `condition` }
  ]
},

t112: {
  learn: {
    openingTension: `A competitive market produces 1,000 units. A central planner who can freely allocate production also produces 1,000 units and can't do better. Is this a coincidence, or does competition reliably exhaust all gains from trade?`,
    coreIdea: `In a competitive equilibrium, total surplus — the sum of consumer surplus and producer surplus — is maximized: every unit where marginal benefit exceeds marginal cost is produced, and no unit where marginal cost exceeds marginal benefit is produced.`,
    mathSetup: `Total surplus: TS = CS + PS = ∫₀^{Q*}[D(q) − S(q)] dq = ∫₀^{Q*}[MB(q) − MC(q)] dq. Maximized when MB(Q) = MC(Q), i.e., at competitive equilibrium Q*. Deadweight loss (DWL): the reduction in TS from any output level other than Q*. DWL = (1/2)|Q* − Q|·|p_D − p_S| for linear demand and supply. At competitive equilibrium: DWL = 0.`,
    derivation: `1. Total surplus is the area between demand (MB) and supply (MC) curves from q = 0 to Q. 2. For any Q < Q*: the last unit NOT produced has MB > MC — society forgoes surplus by underproducing. 3. For any Q > Q*: the last unit produced has MC > MB — society wastes resources by overproducing. 4. Only at Q = Q* does MB = MC for the last unit: no unit with positive net surplus is left unproduced, and no unit with negative net surplus is produced. Total surplus is maximized. 5. This is allocative efficiency: resources go where they are most valued.`,
    graphicalIntuition: `On a supply-demand diagram, total surplus is the entire area between the demand curve (above) and the supply curve (below), from Q = 0 to Q*. CS is the upper triangle (between demand and price); PS is the lower triangle (between price and supply). Any restriction of output below Q* creates a DWL triangle to the right of the new quantity and below the demand curve. Any expansion above Q* creates a DWL triangle where MC > MB.`,
    workedExample: `Linear supply and demand: Q^D = 100 − 2p; Q^S = 2p − 20. Equilibrium: 100 − 2p = 2p − 20 → p* = $30, Q* = 40. CS = (1/2)(50 − 30)(40) = $400. PS = (1/2)(30 − 10)(40) = $400. TS = $800. Now suppose a price ceiling at p = $20: Q = 2(20) − 20 = 20 units. DWL = (1/2)(30 − 20)(40 − 20) = $100. TS falls to $700.\nInterpret: Competitive equilibrium maximizes TS = $800. Any deviation (price ceiling, tax, restriction) reduces TS and creates deadweight loss.`,
    boundaryConditions: `1. Externalities break the welfare result: if MC does not capture all social costs (pollution), the competitive Q* is too high, generating DWL from overproduction. 2. Market power: a monopolist restricts Q below Q*, creating DWL — the First Welfare Theorem fails when a single firm has market power. 3. Public goods: competitive provision is zero (no one pays) while social optimum is positive. 4. Asymmetric information: competitive markets may produce too much or too little depending on which party holds private information.`,
    examTraps: [
      `A student might think consumer surplus is the area above the demand curve and below the price, but the correct answer is that CS is below the demand curve and above the price line — it is the surplus buyers receive, not what they pay. The common reversal: CS is below demand and above price; PS is above supply and below price.`,
      `A student might think raising the price always increases total surplus by increasing PS, but the correct answer is that raising the price above equilibrium reduces CS by more than it increases PS — the gap (DWL) represents value destroyed, not transferred. Price changes redistribute surplus but also reduce it.`,
      `A student might think the distribution of surplus between buyers and sellers affects total welfare, but the correct answer is that total surplus is the sum regardless of distribution. Welfare analysis asks whether TS is maximized, not how it is split between CS and PS.`
    ],
    frq: {
      prompt: `Market demand: Q^D = 120 − 3p. Market supply: Q^S = 3p − 12. A price ceiling is set at p = $14.`,
      parts: [
        `Find the competitive equilibrium price, quantity, CS, PS, and total surplus.`,
        `Under the price ceiling, find quantity traded, new CS, new PS, and deadweight loss.`,
        `Decompose the change in CS and PS: how much is transferred between buyers and sellers, and how much is destroyed (DWL)?`,
        `Explain why the competitive equilibrium maximizes total surplus. Use a marginal argument (what happens if we produce one unit more or less than Q*)?`
      ]
    }
  },
  flashcards: [
    { front: `What does competitive welfare analysis show about total surplus?`, back: `Competitive equilibrium maximizes total surplus (CS + PS). Every unit where MB > MC is produced (captured as positive surplus), and no unit where MB < MC is produced (which would destroy surplus). Deadweight loss = 0 at competitive equilibrium. Any restriction on quantity (price ceiling, tax, monopoly) reduces total surplus.`, type: `definition` },
    { front: `What is deadweight loss and when does it arise?`, back: `DWL is the reduction in total surplus from a market distortion. It arises whenever quantity differs from the competitive equilibrium Q*: at Q < Q*, units with MB > MC go unproduced (DWL from underproduction); at Q > Q*, units with MC > MB are produced (DWL from overproduction). DWL represents value destroyed, not redistributed.`, type: `definition` },
    { front: `How does a price ceiling affect CS, PS, and total surplus?`, back: `A price ceiling below equilibrium: reduces price → increases CS for buyers of existing quantity, but reduces quantity sold → destroys some CS (buyers who can no longer buy) and PS (units no longer sold). Net: some CS transferred from sellers to buyers (lower price on existing units), but both CS and PS fall due to reduced quantity. DWL = triangle between price and supply in the gap between ceiling quantity and equilibrium quantity.`, type: `condition` },
    { front: `Distinguish: a transfer of surplus vs. a destruction of surplus.`, back: `Transfer: surplus moved from one party to another — e.g., a below-equilibrium price ceiling moves PS to CS (buyers gain what sellers lose on existing units). Destruction (DWL): surplus that no one captures — e.g., the triangle of value from units not traded because price is below equilibrium. Policy analysis must distinguish: redistribution is a transfer; restriction of trade is destruction.`, type: `distinction` }
  ]
},

t113: {
  learn: {
    openingTension: `Two outcomes: (A) everyone gets $50,000 a year; (B) half get $40,000 and half get $120,000. Economists call outcome B "possibly more efficient" than A. How can unequal distributions be called efficient?`,
    coreIdea: `Pareto efficiency is about whether gains from trade are fully exhausted — whether any reallocation could make someone better off without making anyone worse off — not about whether the distribution is fair or equal.`,
    mathSetup: `Conceptual topic — formal definition: An allocation (x₁, x₂, ..., xₙ) is Pareto efficient if there is no alternative allocation (x₁′, x₂′, ..., xₙ′) such that all individuals weakly prefer the alternative and at least one individual strictly prefers it. Equivalently: no Pareto improvement exists — any change that helps one person hurts at least one other. Note: Pareto efficiency says nothing about the distribution of welfare levels.`,
    graphicalIntuition: `Common Misreading: Students confuse Pareto efficiency with optimality, fairness, or equality. Pareto efficiency is a minimal condition — it only rules out waste, not inequality. The Edgeworth box illustrates this: any point on the contract curve (where indifference curves are tangent) is Pareto efficient, but some points on the contract curve give nearly everything to one person and nearly nothing to the other. A highly unequal allocation can be Pareto efficient; a perfectly equal allocation may be Pareto inefficient if there are unexploited gains from trade. Pareto efficiency is a necessary condition for a good allocation, not sufficient.`,
    derivation: `1. Start at any allocation where marginal rates of substitution differ across agents: MRS_A ≠ MRS_B. Then trade is mutually beneficial — both parties can gain — so the allocation is Pareto inefficient. 2. Once MRS_A = MRS_B for all pairs: no further mutually beneficial trade exists. The allocation is Pareto efficient. 3. There are infinitely many Pareto-efficient allocations (the entire contract curve). They differ in how welfare is distributed. 4. Moving from one Pareto-efficient allocation to another is a Pareto improvement — impossible. To change the distribution, a redistribution policy must either create DWL (taxing one person to give to another) or rely on lump-sum transfers (which are Pareto improvements if voluntary).`,
    workedExample: `Two farmers exchange corn and wheat: Farmer A values corn at 3 wheat per corn (MRS_A = 3). Farmer B values corn at 1 wheat per corn (MRS_B = 1). Since MRS_A ≠ MRS_B, there are gains from trade. Farmer B sells corn to Farmer A at any price between 1 and 3 wheat per corn, making both better off. This continues until MRS_A = MRS_B. The final allocation is Pareto efficient — any further change would hurt one of them.\nNow note: the final allocation may give Farmer A three times as much total grain as Farmer B. It is Pareto efficient but unequal.`,
    boundaryConditions: `1. Pareto efficiency does not rank distributions: two Pareto-efficient allocations are not comparable unless one Pareto-dominates the other (which would make one of them inefficient). 2. Pareto improvements requiring compensation are called potential Pareto improvements (Kaldor-Hicks criterion) — these do not require the compensation to actually be paid, so they can leave some worse off. 3. Pareto efficiency is possible even with market failures: an allocation with a negative externality can be Pareto efficient if one agent has property rights over the externality and all parties have already bargained to the efficient outcome (Coase theorem).`,
    examTraps: [
      `A student might think a Pareto-efficient allocation is the best possible allocation, but the correct answer is that Pareto efficiency only rules out Pareto improvements (changes that help some without hurting others). Highly unequal allocations can be Pareto efficient; equal allocations can be Pareto inefficient if there are unexploited gains from trade.`,
      `A student might think competitive equilibrium is Pareto efficient because prices are fair, but the correct answer is that competitive equilibrium is Pareto efficient because MRS = price ratio for all consumers and MRT = price ratio for all producers — the technical condition, not a fairness argument. The First Welfare Theorem formalizes this.`,
      `A student might think all Pareto-efficient allocations are equally desirable, but the correct answer is that Pareto efficiency is not a complete ranking — it only eliminates dominated allocations. Among Pareto-efficient allocations, society must use additional criteria (social welfare functions, equity considerations) to choose among them.`
    ],
    frq: {
      prompt: `Two consumers, A and B, each have an endowment of 10 apples and 10 bananas. Consumer A has MRS = 2 bananas/apple. Consumer B has MRS = 1 banana/apple.`,
      parts: [
        `Is the initial endowment allocation Pareto efficient? Explain using MRS conditions.`,
        `Describe a trade between A and B that constitutes a Pareto improvement.`,
        `After trade, suppose A has 14 apples and 6 bananas; B has 6 apples and 14 bananas, and MRS_A = MRS_B = 1.5. Is this allocation Pareto efficient? Does this mean it is the "best" allocation? Explain.`,
        `Give an example of a Pareto-efficient allocation that is highly unequal. What does this reveal about the relationship between Pareto efficiency and equity?`
      ]
    }
  },
  flashcards: [
    { front: `What is Pareto efficiency?`, back: `An allocation is Pareto efficient if there is no reallocation that makes at least one person better off without making anyone worse off. Equivalently, all Pareto improvements (mutually beneficial changes) have been exhausted. Pareto efficiency rules out waste but says nothing about equity or equality — highly unequal allocations can be Pareto efficient.`, type: `definition` },
    { front: `Distinguish: Pareto efficient vs. Pareto improvement.`, back: `A Pareto improvement is a change that makes at least one person better off and no one worse off — it proves the current allocation is NOT Pareto efficient. A Pareto efficient allocation is one from which no Pareto improvement is possible — all gains from trade have been captured. If a Pareto improvement exists, the current allocation is inefficient.`, type: `distinction` },
    { front: `Can an unequal allocation be Pareto efficient?`, back: `Yes. Any allocation on the contract curve in an Edgeworth box is Pareto efficient, including points that give nearly everything to one person. Pareto efficiency is about whether gains from trade are exhausted, not about how welfare is distributed. Equality and efficiency are different criteria — a policy analyst must consider both.`, type: `condition` },
    { front: `What is the condition for Pareto efficiency in an exchange economy?`, back: `MRS_A = MRS_B for every pair of goods and consumers. When marginal rates of substitution differ, a mutually beneficial trade exists (one consumer values the traded good more than the other), making the allocation Pareto inefficient. At the Pareto-efficient allocation, no further gains from trade exist because all MRS are equalized.`, type: `condition` }
  ]
},

t114: {
  learn: {
    openingTension: `Markets often look chaotic and self-interested. Yet Adam Smith claimed that the pursuit of individual self-interest leads to social benefit through an "invisible hand." The First Welfare Theorem is the formal proof of this claim — but it requires a list of assumptions long enough to fill a textbook.`,
    coreIdea: `The First Welfare Theorem states that a competitive equilibrium is Pareto efficient — under specific assumptions: complete markets, no externalities, perfect information, and price-taking behavior — making it a conditional endorsement of markets, not an unconditional one.`,
    mathSetup: `Conceptual topic — formal statement: If (1) all markets are competitive (price-taking agents), (2) markets are complete (a market exists for every good including contingent claims), (3) there are no externalities (private and social costs/benefits coincide), and (4) information is symmetric (no hidden types or actions), then any competitive equilibrium allocation is Pareto efficient. The theorem is a conditional: all assumptions must hold simultaneously. If even one fails, the equilibrium may not be Pareto efficient.`,
    graphicalIntuition: `Common Misreading: Students read the First Welfare Theorem as "markets always produce efficient outcomes." The correct reading is: "markets produce efficient outcomes IF the listed assumptions all hold simultaneously." Each assumption corresponds to a category of market failure: (1) market power violates price-taking, (2) externalities mean private and social costs diverge, (3) public goods mean markets are incomplete, (4) asymmetric information violates the symmetry condition. Real markets fail many of these assumptions. The theorem's value is not to certify markets as always efficient — it is to identify precisely which conditions are needed, so we can predict when and why markets fail.`,
    derivation: `The proof uses two steps: (1) Individual optimization: each consumer maximizes utility subject to budget (MRS = price ratio) and each producer maximizes profit (p = MC, i.e., MRT = price ratio). (2) Markets clear: supply = demand. At equilibrium, all consumers have the same MRS = p₁/p₂ = MRT. Since MRS = MRT for all agents, no reallocation can make anyone better off without making someone worse off — this is the definition of Pareto efficiency.`,
    workedExample: `Real-world scenario: Healthcare market in the United States.\n- Is it competitive (price-taking)? Partially — insurers and hospital systems have significant market power. Assumption (1) VIOLATED.\n- Are markets complete? No — moral hazard and adverse selection cause missing markets for full risk insurance. Assumption (2) VIOLATED.\n- Are there externalities? Yes — vaccination has positive externalities (herd immunity). Assumption (3) VIOLATED.\n- Is information symmetric? No — patients don't know quality; providers don't know patient types. Assumption (4) VIOLATED.\nConclusion: The First Welfare Theorem does not apply. We should expect healthcare markets to fail to achieve Pareto efficiency. Government intervention may improve welfare — the theorem doesn't say it will, but it says the baseline presumption of efficiency is unjustified here.`,
    boundaryConditions: `1. Second Welfare Theorem (companion result): any Pareto-efficient allocation can be achieved as a competitive equilibrium, given appropriate lump-sum redistribution. This separates efficiency from distribution. 2. Constrained efficiency: when the listed assumptions are partially violated, markets may achieve "constrained" efficiency — the best possible given informational or other constraints. 3. Arrow-Debreu generalization: the theorem extends to uncertainty if markets for contingent claims exist for every state of the world — a very strong requirement.`,
    examTraps: [
      `A student might think the First Welfare Theorem proves markets are always efficient, but the correct answer is that the theorem is conditional — it proves efficiency ONLY when all four assumptions hold simultaneously. The theorem's purpose is to identify the conditions needed, not to certify real markets as efficient.`,
      `A student might think government intervention always reduces welfare because markets are efficient, but the correct answer is that markets are efficient only under the theorem's assumptions. When an assumption is violated (externality, market power, public good, asymmetric information), intervention can potentially improve welfare by correcting the specific market failure.`,
      `A student might think Pareto efficiency means a fair distribution, but the correct answer is that Pareto efficiency is about eliminating waste (unexploited gains from trade), not about distributional fairness. A Pareto-efficient competitive equilibrium may involve extreme inequality. The Second Welfare Theorem addresses redistribution separately.`
    ],
    frq: {
      prompt: `For each of the following real-world scenarios, identify which assumption of the First Welfare Theorem is violated and explain why the competitive equilibrium may fail to be Pareto efficient.\n(A) A chemical plant discharges wastewater into a river used by downstream fisheries.\n(B) A single firm controls 80% of the market for internet search.\n(C) Used car dealers know far more about vehicle quality than buyers do.\n(D) A neighborhood park is freely accessible to all residents.`,
      parts: [
        `For scenario (A), identify the violated assumption. Define the specific market failure. Explain what inefficiency results and in which direction output deviates from the social optimum.`,
        `For scenario (B), identify the violated assumption. Explain what condition fails in the proof of the First Welfare Theorem when this assumption is absent.`,
        `For scenario (C), identify the violated assumption. Name the specific type of information problem and explain how it prevents the market from reaching the Pareto-efficient allocation.`,
        `For scenario (D), identify the violated assumption. Explain why private markets cannot provide this good efficiently and what the First Welfare Theorem predicts about provision.`
      ]
    }
  },
  flashcards: [
    { front: `State the First Welfare Theorem.`, back: `Under competitive markets (price-taking), complete markets, no externalities, and symmetric information, every competitive equilibrium allocation is Pareto efficient. The theorem is conditional — all four assumptions must hold. Violating any one of them can cause the equilibrium to fail Pareto efficiency.`, type: `definition` },
    { front: `What are the four assumptions of the First Welfare Theorem?`, back: `(1) Price-taking behavior (no market power). (2) Complete markets (a market for every good and contingent claim). (3) No externalities (private and social costs/benefits coincide). (4) Symmetric information (no hidden types or actions). Violating any assumption corresponds to a category of market failure: market power, public goods/missing markets, externalities, or information asymmetry.`, type: `definition` },
    { front: `What is the correct interpretation of the First Welfare Theorem?`, back: `Not "markets are always efficient." Rather: "markets are efficient IF the four conditions hold." The theorem identifies the exact conditions needed for efficiency, predicting where markets will fail when conditions are absent. Real markets violate multiple conditions, so the theorem is a diagnostic tool, not a blanket endorsement of laissez-faire.`, type: `definition` },
    { front: `When a negative externality is present, which assumption of the First Welfare Theorem is violated?`, back: `The no-externalities assumption: private and social costs diverge. The firm's MC does not capture the full social marginal cost (it omits the external cost imposed on third parties). At competitive equilibrium, p = private MC < social MC — too much output is produced relative to the Pareto-efficient level. DWL arises from overproduction.`, type: `condition` },
    { front: `Distinguish: First Welfare Theorem vs. Second Welfare Theorem.`, back: `First Welfare Theorem: any competitive equilibrium is Pareto efficient (efficiency follows from markets). Second Welfare Theorem: any Pareto-efficient allocation can be achieved as a competitive equilibrium with appropriate lump-sum redistribution (distribution can be separated from efficiency). Together: markets achieve efficiency, and redistribution can achieve equity without sacrificing efficiency (if lump-sum transfers are available).`, type: `distinction` }
  ]
},

};

// ─── WRITE PART 1 ONLY — rest of topics added by follow-up script ─────────────

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
console.log('Done! Added learn content for t102-t114 (Unit 6).');
