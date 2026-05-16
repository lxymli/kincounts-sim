/**
 * Compute summary statistics from a raw count array.
 */
export function computeStats(arr) {
  const n = arr.length
  let sum = 0, zeros = 0
  for (let i = 0; i < n; i++) {
    sum += arr[i]
    if (arr[i] === 0) zeros++
  }
  const mean = sum / n

  let sqDev = 0
  for (let i = 0; i < n; i++) sqDev += (arr[i] - mean) ** 2

  return {
    mean,
    variance: sqDev / n,
    pZero: zeros / n,
  }
}

/**
 * Convert a raw count array to a PMF array for Recharts.
 * Returns [{ count: k, probability: p }, ...]
 */
export function arrayToPMF(arr) {
  if (!arr || arr.length === 0) return []
  const n = arr.length
  let max = 0
  for (let i = 0; i < n; i++) if (arr[i] > max) max = arr[i]

  const counts = new Float64Array(max + 1)
  for (let i = 0; i < n; i++) counts[arr[i]]++

  const pmf = []
  for (let k = 0; k <= max; k++) {
    pmf.push({ count: k, probability: counts[k] / n })
  }
  return pmf
}

/**
 * Merge multiple PMF arrays (keyed by kin type) into a single
 * Recharts data array with a shared count axis.
 *
 * mergePMFs({ siblings: PMF[], auntsUncles: PMF[] })
 *   → [{ count: 0, siblings: p, auntsUncles: q }, ...]
 */
export function mergePMFs(pmfMap) {
  let maxCount = 0
  for (const pmf of Object.values(pmfMap)) {
    for (const { count } of pmf) {
      if (count > maxCount) maxCount = count
    }
  }

  // Cap display at 60 bins; trim trailing near-zero bins below that
  const cap = Math.min(maxCount, 60)
  const merged = []
  for (let k = 0; k <= cap; k++) {
    const entry = { count: k }
    for (const [key, pmf] of Object.entries(pmfMap)) {
      entry[key] = pmf[k] ? pmf[k].probability : 0
    }
    merged.push(entry)
  }

  // Trim trailing bins where all series are < 0.001
  let last = merged.length - 1
  while (last > 0) {
    const row = merged[last]
    const allTiny = Object.entries(row)
      .filter(([k]) => k !== 'count')
      .every(([, v]) => v < 0.001)
    if (allTiny) last--
    else break
  }
  return merged.slice(0, last + 1)
}
