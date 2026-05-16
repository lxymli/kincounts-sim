import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { arrayToPMF, mergePMFs } from '../lib/statsUtils.js'

const KIN_LABELS = {
  siblings:    'Siblings',
  auntsUncles: 'Aunts & Uncles',
  cousins:     'Cousins',
  totalKin:    'Total Kin',
}

const COLORS = {
  siblings:    '#4f86c6',
  auntsUncles: '#e8704a',
  cousins:     '#5bbf7a',
  totalKin:    '#9b59b6',
}

function pctFormatter(v) {
  return (v * 100).toFixed(1) + '%'
}

export default function ResultsChart({ results, selectedKin }) {
  if (!results) {
    return (
      <div className="empty-chart">
        <p>Set parameters and click <strong>Run Simulation</strong> to see results.</p>
      </div>
    )
  }

  const active = Object.entries(selectedKin)
    .filter(([, v]) => v)
    .map(([k]) => k)

  if (active.length === 0) {
    return <div className="empty-chart">Select at least one kin type above.</div>
  }

  const pmfMap = {}
  for (const key of active) pmfMap[key] = arrayToPMF(results[key])

  const data = mergePMFs(pmfMap)

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart
        data={data}
        barSize={8}
        barCategoryGap="15%"
        barGap={1}
        margin={{ top: 30, right: 20, left: 10, bottom: 55 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="count"
          label={{ value: 'Number of Relatives', position: 'insideBottom', offset: -38, fontSize: 12 }}
          tick={{ fontSize: 11, angle: -45, textAnchor: 'end', dy: 4 }}
          interval={0}
        />
        <YAxis
          tickFormatter={pctFormatter}
          tick={{ fontSize: 11 }}
          width={50}
          label={{ value: 'Probability', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
        />
        <Tooltip formatter={(v, name) => [pctFormatter(v), KIN_LABELS[name] ?? name]} />
        <Legend
          verticalAlign="top"
          align="center"
          formatter={key => KIN_LABELS[key] ?? key}
          wrapperStyle={{ fontSize: 12, paddingBottom: 12 }}
        />
        {active.map(key => (
          <Bar key={key} dataKey={key} fill={COLORS[key]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
