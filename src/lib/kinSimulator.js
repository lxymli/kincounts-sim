import {
  initRNG,
  poissonSample,
  nbSample,
  zinbSample,
  siblingFromZINB,
} from './distributions.js'

/**
 * Direct port of simulate_relatives_zinb() from the Kincounts R project.
 *
 * For the Poisson model (pi0=0, theta→∞):
 *   siblings and fertility draws both use Poisson(mu).
 *
 * For the ZINB model:
 *   siblings use the analytic NB sibling distribution NB(mu*(θ+1)/θ, θ+1)
 *   per-aunt/uncle fertility uses ZINB(mu, θ, π₀)
 *
 * Returns raw count arrays (not PMFs) so the caller can compute
 * both empirical PMFs and summary statistics.
 */
export function simulateKin({ model, mu, theta, pi0, nSim, seed }) {
  const rng = initRNG(seed)

  const siblings    = new Int32Array(nSim)
  const auntsUncles = new Int32Array(nSim)
  const cousins     = new Int32Array(nSim)
  const totalKin    = new Int32Array(nSim)

  if (model === 'poisson') {
    for (let i = 0; i < nSim; i++) {
      const sibs = poissonSample(mu, rng)
      const auM  = poissonSample(mu, rng)
      const auP  = poissonSample(mu, rng)
      const au   = auM + auP

      let cos = 0
      for (let j = 0; j < au; j++) cos += poissonSample(mu, rng)

      siblings[i]    = sibs
      auntsUncles[i] = au
      cousins[i]     = cos
      totalKin[i]    = sibs + au + cos
    }
  } else {
    // ZINB
    for (let i = 0; i < nSim; i++) {
      const sibs = siblingFromZINB(mu, theta, rng)
      const auM  = siblingFromZINB(mu, theta, rng)
      const auP  = siblingFromZINB(mu, theta, rng)
      const au   = auM + auP

      let cos = 0
      for (let j = 0; j < au; j++) cos += zinbSample(mu, theta, pi0, rng)

      siblings[i]    = sibs
      auntsUncles[i] = au
      cousins[i]     = cos
      totalKin[i]    = sibs + au + cos
    }
  }

  return { siblings, auntsUncles, cousins, totalKin }
}
