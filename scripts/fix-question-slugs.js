const fs = require('fs');
const path = require('path');

const dir = 'content/questions/econ-301';

const renames = {
    'average-and-marginal-cost': 'average-marginal-cost',
    'bads-neutrals-and-satiation': 'bads-neutrals-satiation',
    'budget-sets-and-budget-lines': 'budget-sets-and-lines',
    'compensated-vs-uncompensated-demand': 'compensated-uncompensated-demand',
    'constant-increasing-and-decreasing-cost-industries': 'constant-increasing-decreasing-cost',
    'demand-and-supply-schedules': 'demand-supply-schedules',
    'deriving-cost-functions-from-production-functions': 'deriving-cost-from-production',
    'discrete-and-continuous-demand': 'discrete-continuous-demand',
    'economic-models-and-simplification': 'economic-models',
    'endogenous-vs-exogenous-variables': 'endogenous-exogenous-variables',
    'fixed-and-variable-cost': 'fixed-variable-cost',
    'labor-supply-as-an-endowment-problem': 'labor-supply-endowment',
    'long-run-cost-curves': 'long-run-cost',
    'marginal-revenue-under-monopoly': 'marginal-revenue-monopoly',
    'market-equilibrium': 'market-equilibrium-welfare',
    'net-and-gross-demand': 'net-gross-demand',
    'normal-and-inferior-goods': 'normal-inferior-goods',
    'perfect-substitutes-and-perfect-complements': 'perfect-substitutes-complements',
    'private-cost-vs-social-cost': 'private-vs-social-cost',
    'sequential-games-and-backward-induction': 'sequential-games',
    'short-run-cost-curves': 'short-run-cost',
    'taxes-subsidies-rationing-and-nonlinear-pricing': 'taxes-subsidies-rationing',
    'weak-axiom-of-revealed-preference-warp': 'warp',
};

for (const [from, to] of Object.entries(renames)) {
    const fromPath = path.join(dir, `${from}.json`);
    const toPath = path.join(dir, `${to}.json`);
    if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
        console.log(`Renamed: ${from} -> ${to}`);
    } else {
        console.warn(`Not found: ${from}.json`);
    }
}

console.log('Done.');