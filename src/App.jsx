import { useState } from 'react'
import FertilityModelSelector from './components/FertilityModelSelector.jsx'
import PopulationParams       from './components/PopulationParams.jsx'
import KinTypeSelector        from './components/KinTypeSelector.jsx'
import SimulationControls     from './components/SimulationControls.jsx'
import ResultsChart           from './components/ResultsChart.jsx'
import SummaryStats           from './components/SummaryStats.jsx'
import { simulateKin }        from './lib/kinSimulator.js'

const DEFAULT_PARAMS = { mu: 3, theta: 4, pi0: 0.05, nSim: 10000 }
const DEFAULT_KIN    = { siblings: true, auntsUncles: true, cousins: true, totalKin: false }

export default function App() {
  const [model,       setModel]       = useState('zinb')
  const [params,      setParams]      = useState(DEFAULT_PARAMS)
  const [selectedKin, setSelectedKin] = useState(DEFAULT_KIN)
  const [seed,        setSeed]        = useState(42)
  const [results,     setResults]     = useState(null)
  const [isRunning,   setIsRunning]   = useState(false)
  const [runInfo,     setRunInfo]     = useState(null)

  function handleRun() {
    setIsRunning(true)
    // Yield to React so the "Running…" state renders before the blocking loop
    setTimeout(() => {
      const t0  = performance.now()
      const res = simulateKin({ model, ...params, seed })
      const ms  = (performance.now() - t0).toFixed(0)
      setResults(res)
      setRunInfo({ ms, nSim: params.nSim, model })
      setIsRunning(false)
    }, 10)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Kin Counts Simulator Tool</h1>
        <p>Simulate biological relative distributions under Poisson and ZINB fertility models</p>
      </header>

      <div className="app-body">
        {/* ── Controls ── */}
        <aside className="controls-panel">
          <FertilityModelSelector model={model} onChange={m => { setModel(m); setResults(null) }} />
          <PopulationParams model={model} params={params} onChange={setParams} />
          <KinTypeSelector selectedKin={selectedKin} onChange={setSelectedKin} />
          <SimulationControls
            onRun={handleRun}
            isRunning={isRunning}
            seed={seed}
            onSeedChange={setSeed}
          />
        </aside>

        {/* ── Results ── */}
        <main className="results-panel">
          {runInfo && !isRunning && (
            <p className="run-meta">
              {runInfo.nSim.toLocaleString()} draws ·{' '}
              {runInfo.model.toUpperCase()} model · {runInfo.ms} ms
            </p>
          )}

          <h2>Probability Mass Function</h2>
          <ResultsChart results={results} selectedKin={selectedKin} />

          <h2>Summary Statistics</h2>
          <SummaryStats results={results} selectedKin={selectedKin} />

          {!results && (
            <p className="results-hint">
              Adjust parameters in the left panel, then click <strong>Run Simulation</strong>.
            </p>
          )}
        </main>
      </div>
    </div>
  )
}
