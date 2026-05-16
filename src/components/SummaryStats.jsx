import { computeStats } from '../lib/statsUtils.js'

const KIN_LABELS = {
  siblings:    'Siblings',
  auntsUncles: 'Aunts & Uncles',
  cousins:     'Cousins',
  totalKin:    'Total Kin',
}

export default function SummaryStats({ results, selectedKin }) {
  if (!results) return null

  const active = Object.entries(selectedKin)
    .filter(([, v]) => v)
    .map(([k]) => k)

  if (active.length === 0) return null

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Kin Type</th>
          <th>Mean</th>
          <th>Variance</th>
          <th>P(0 kin)</th>
        </tr>
      </thead>
      <tbody>
        {active.map(key => {
          const { mean, variance, pZero } = computeStats(results[key])
          return (
            <tr key={key}>
              <td>{KIN_LABELS[key]}</td>
              <td>{mean.toFixed(3)}</td>
              <td>{variance.toFixed(3)}</td>
              <td>{(pZero * 100).toFixed(1)}%</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
