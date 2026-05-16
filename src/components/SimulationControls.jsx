export default function SimulationControls({ onRun, isRunning, seed, onSeedChange }) {
  return (
    <div className="control-group">
      <span className="control-label">Controls</span>
      <div className="seed-row">
        <label htmlFor="seed-input">Seed</label>
        <input
          id="seed-input"
          type="number"
          value={seed}
          min={0}
          onChange={e => onSeedChange(Number(e.target.value))}
        />
      </div>
      <button className="run-button" onClick={onRun} disabled={isRunning}>
        {isRunning ? 'Running…' : 'Run Simulation'}
      </button>
    </div>
  )
}
