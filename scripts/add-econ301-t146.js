#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'content', 'courses', 'econ-301', 'course.json');
const course = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const learnData = {

t146: {
  learn: {
    synthesisNarrative: `Microeconomics is a single, coherent answer to one question: how do decentralized decisions by self-interested agents produce — or fail to produce — outcomes that are good for everyone? Each unit in this course is one chapter in that answer, building on the last.

Unit 1 established the method: economics reasons through models — simplified, falsifiable representations of decision-making. Two tools define the discipline. Optimization describes what any individual agent does: consumers maximize utility subject to budgets, producers minimize cost subject to output targets, firms maximize profit subject to technology and market conditions. Equilibrium describes what happens when all agents' optimizations are simultaneously consistent: markets clear, prices adjust, no one is left with an unmet desire they can afford to satisfy. Every subsequent unit applies these two tools in a more complex setting.

Unit 2 applied optimization to the consumer. Utility maximization subject to a budget constraint generates demand functions — how much a consumer buys at each price. The key results: the optimal bundle satisfies MRS = price ratio (tangency condition); demand is downward-sloping because of substitution and income effects; and the Slutsky decomposition separates these effects precisely. The consumer's problem is the foundation for all demand-side analysis in the course.

Unit 3 applied optimization to the producer. Cost minimization given an output target generates the cost function — the producer analog of the consumer's expenditure function. Profit maximization using those cost functions generates firm supply. The key symmetry: the producer's problem (min cost for given output) is the dual of the consumer's problem (max utility for given expenditure). Both are constrained optimization problems; only the objective and constraint are switched.

Unit 4 combined consumer and producer theory into market equilibrium. When demand (from utility maximization) meets supply (from profit maximization), a price equilibrates the market. The welfare analysis followed: consumer surplus is the gain to buyers, producer surplus the gain to sellers, and together they measure total surplus — the social gains from trade. The competitive equilibrium maximizes total surplus when all markets operate freely. This is where optimization and equilibrium meet welfare.

Unit 5 extended the consumer model to uncertainty and time. Expected utility theory models choices under risk; the demand for insurance and the equity premium follow directly. Intertemporal choice applies the same consumer model to trade-offs between present and future consumption. These extensions show that the core model — optimization given constraints — is far more flexible than its simplest form suggests.

Unit 6 put the competitive model through its paces. Price-taking firms set p = MC; the firm's supply curve is its MC curve. In long-run equilibrium, free entry drives economic profit to zero and price to min(LAC). This is the benchmark: competitive markets with free entry achieve allocative efficiency (p = MC), productive efficiency (min LAC), and zero economic profit. The First Welfare Theorem formalized this benchmark — but crucially, it stated the conditions under which competition achieves efficiency: no externalities, no market power, complete markets, symmetric information. These conditions are the setup for Units 7 and 8, which systematically break each assumption.

Unit 7 broke the market-power assumption. A monopolist faces downward-sloping demand, so MR < P, so it restricts output below the competitive level, creating deadweight loss. The Lerner Index (P − MC)/P = 1/|ε| measures the extent of market power. Price discrimination allows monopolists to capture consumer surplus more efficiently — perfect discrimination eliminates DWL but extracts all CS. Oligopoly — multiple firms with market power — is modeled with game theory: Nash equilibrium in quantities (Cournot) gives an outcome between monopoly and competition; Nash equilibrium in prices (Bertrand) gives competitive pricing even with two firms. Game theory is the tool that fills the gap between the single agent (optimization) and the full competitive market (equilibrium): it handles strategic interdependence, where what one agent should do depends on what others do.

Unit 8 broke the remaining assumptions. Externalities break the no-externality assumption: pollution creates a wedge between private and social costs, generating overproduction and DWL. The Pigouvian tax corrects this wedge by equalizing private and social costs. Coasian bargaining shows that private negotiation can also correct externalities when property rights are clear and transaction costs are low — but fails at scale. Public goods break the complete-markets assumption: non-rivalry and non-excludability prevent private provision, and the Samuelson condition (ΣMB = MC) replaces the private-good efficiency condition (MB = MC). Information asymmetry breaks the symmetric-information assumption in two ways: adverse selection (hidden type before contract) causes lemons markets and insurance death spirals; moral hazard (hidden action after contract) causes underprovision of effort and requires second-best incentive contracts. The solutions — signaling, screening, Pigouvian taxes, Coasian bargaining, public provision — are all attempts to restore the conditions of the First Welfare Theorem when one of its assumptions fails.

The course as a whole is therefore the story of one theorem: under the right conditions, decentralized markets exhaust all gains from trade. The rest of the course is about what happens when those conditions don't hold, why they don't hold, and what can be done about it.`,

    connectionMap: [
      {
        from: `Utility Maximization (Unit 2)`,
        to: `Cost Minimization (Unit 3)`,
        connection: `Both are constrained optimization problems using the same Lagrangian framework. Utility maximization: max u(x) s.t. p·x = m generates demand x*(p,m). Cost minimization: min w·L + r·K s.t. f(L,K) = q generates cost c(w,r,q). The duality theorem shows these are mirror images: the indirect utility function and expenditure function are duals; the cost function and production function are duals.`
      },
      {
        from: `Cost Minimization (Unit 3)`,
        to: `Firm Supply (Unit 6)`,
        connection: `The cost function C(q) derived from cost minimization is the input to profit maximization. Setting p = MC(q) gives the firm's supply function. The supply curve is literally the MC curve above AVC — derived entirely from the cost function, which is derived entirely from cost minimization. No cost minimization → no supply curve.`
      },
      {
        from: `Consumer Demand (Unit 2)`,
        to: `Market Equilibrium (Unit 4)`,
        connection: `Market demand is the horizontal aggregation of individual demand functions derived from utility maximization. Market supply is the horizontal aggregation of firm supply functions derived from profit maximization. Equilibrium occurs where these aggregated functions intersect. The welfare analysis (CS, PS, total surplus) is built on the consumer's demand function and the firm's supply function.`
      },
      {
        from: `Competitive Equilibrium (Unit 6)`,
        to: `Pareto Efficiency and First Welfare Theorem (Unit 6)`,
        connection: `Competitive equilibrium achieves Pareto efficiency under the four assumptions: price-taking, complete markets, no externalities, symmetric information. At equilibrium, p = MC (allocative efficiency) and p = min LAC (productive efficiency). The First Welfare Theorem is the formal proof that these conditions jointly guarantee Pareto efficiency — making the competitive benchmark the reference point for all market failure analysis.`
      },
      {
        from: `p = MC (Competitive, Unit 6)`,
        to: `MR = MC (Monopoly, Unit 7)`,
        connection: `Both are applications of the same profit-maximizing rule: produce until the marginal revenue from the last unit equals its marginal cost. For a price-taker, MR = P (horizontal demand), so the rule gives P = MC. For a monopolist, MR < P (downward-sloping demand), so the rule gives MR = MC, which implies P > MC. The monopoly outcome is not a different rule — it is the same rule applied to a different demand environment.`
      },
      {
        from: `Nash Equilibrium (Unit 7)`,
        to: `Cournot and Bertrand Outcomes (Unit 7)`,
        connection: `Cournot and Bertrand are both applications of Nash equilibrium to oligopoly. Cournot: firms choose quantities; Nash equilibrium is the intersection of reaction functions (each firm best-responds to the other's quantity). Bertrand: firms choose prices; Nash equilibrium drives P = MC (undercutting logic). Nash equilibrium unifies both: the solution is always the strategy profile where no unilateral deviation is profitable.`
      },
      {
        from: `First Welfare Theorem (Unit 6)`,
        to: `Externalities (Unit 8)`,
        connection: `Externalities violate the no-externality assumption of the First Welfare Theorem. When PMC ≠ SMC, the competitive equilibrium (P = PMC) fails to achieve the social optimum (P = SMC). The DWL from overproduction (negative externality) is exactly the welfare loss from this violated assumption. Pigouvian taxes restore efficiency by correcting PMC to equal SMC at the optimum.`
      },
      {
        from: `Externalities (Unit 8)`,
        to: `Public Goods (Unit 8)`,
        connection: `Public goods generate extreme positive consumption externalities: each unit consumed by one person is also available to all others (non-rivalry). This means the social value of a public good unit is the SUM of all MBs (Samuelson condition), not the individual MB. Public goods can be seen as extreme positive externality goods — their external benefit is so large (and non-excludable) that the market doesn't provide them at all.`
      },
      {
        from: `Adverse Selection (Unit 8)`,
        to: `Signaling and Screening (Unit 8)`,
        connection: `Adverse selection is the problem; signaling and screening are the solutions. Adverse selection arises because one party has hidden type information. Signaling: the informed party (H-type) takes a costly action to reveal type. Screening: the uninformed party designs a self-selection menu so types reveal themselves. Both restore information symmetry — allowing the market to approximate the full-information (no-adverse-selection) outcome.`
      },
      {
        from: `Moral Hazard (Unit 8)`,
        to: `Principal-Agent Problem (Unit 8)`,
        connection: `The principal-agent problem is the formal model of employment-contract moral hazard. The principal (employer/insurer) cannot observe the agent's (worker's/insured's) action (effort/care). The optimal contract balances risk-sharing against incentives: more performance pay preserves effort (good) but imposes risk on a risk-averse agent (costly). The Lerner Index (in price theory) and incentive intensity b* (in principal-agent theory) are both measures of the strategic wedge created by information asymmetry.`
      }
    ],

    examTraps: [
      `A student might think that because competitive markets are efficient (First Welfare Theorem), any intervention in markets reduces welfare. The correct cross-unit answer is that the First Welfare Theorem's efficiency claim is conditional on four assumptions. When any assumption fails — market power, externalities, public goods, asymmetric information — competitive equilibrium is not Pareto efficient, and corrective intervention can improve welfare. The theorem is a diagnostic, not a blanket endorsement of laissez-faire.`,
      `A student might think monopoly pricing (MR = MC) is a fundamentally different rule from competitive pricing (P = MC). The correct cross-unit answer is that both follow from the same universal profit-maximizing condition: produce until MR = MC. For a price-taker, MR = P; for a monopolist, MR < P. The difference in outcome (P = MC vs. P > MC) comes entirely from the shape of demand facing the firm, not from a different decision rule.`,
      `A student might confuse adverse selection (pre-contract hidden type) with moral hazard (post-contract hidden action), treating them as equivalent problems requiring the same solution. The correct cross-unit answer is that they are distinct in timing, cause, and remedy. Adverse selection (who signs the contract) is solved by signaling or screening before contracting. Moral hazard (what the agent does after signing) is solved by incentive contracts or monitoring. Confusing them leads to wrong policy prescriptions — a deductible (which solves moral hazard) does not solve adverse selection.`,
      `A student might treat DWL from monopoly, DWL from externality, and DWL from public good under-provision as three unrelated concepts. The correct cross-unit answer is that all three are the same underlying welfare measure — the area between the social MB curve (demand) and the social MC curve for the units that are either overproduced (negative externality, monopoly) or underproduced (public good, positive externality). DWL is always the triangular area of unrealized gains from trade, regardless of the market failure causing it.`,
      `A student might think signaling (education) and screening (insurance deductibles) are different names for the same mechanism. The correct cross-unit answer is that they solve the same adverse selection problem but from opposite sides: the INFORMED party moves first in signaling (H-type worker acquires costly credentials); the UNINFORMED party moves first in screening (insurer designs the deductible menu). The two mechanisms are strategic complements in real markets — employers screen AND workers signal simultaneously.`
    ]
  }
  // NO flashcards for t146 per instructions
}

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
console.log('Done! Added t146 (Full-Course Synthesis).');
