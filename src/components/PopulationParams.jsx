function Slider({ label, value, min, max, step, onChange, display }) {
  const formatted = display ? display(value) : value
  return (
    <div className="slider-row">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{formatted}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

export default function PopulationParams({ model, params, onChange }) {
  const set = (key, val) => onChange({ ...params, [key]: val })

  return (
    <div className="control-group">
      <span className="control-label">Parameters</span>

      <Slider
        label="μ — mean fertility"
        value={params.mu}
        min={2} max={6} step={0.1}
        onChange={v => set('mu', v)}
        display={v => v.toFixed(1)}
      />

      {model === 'zinb' && (
        <>
          <Slider
            label="θ — dispersion (size)"
            value={params.theta}
            min={1} max={10} step={0.1}
            onChange={v => set('theta', v)}
            display={v => v.toFixed(1)}
          />
          <Slider
            label="π₀ — zero-inflation prob"
            value={params.pi0}
            min={0} max={0.2} step={0.01}
            onChange={v => set('pi0', v)}
            display={v => v.toFixed(2)}
          />
        </>
      )}

      <Slider
        label="Simulations"
        value={params.nSim}
        min={1000} max={50000} step={1000}
        onChange={v => set('nSim', v)}
        display={v => v.toLocaleString()}
      />
    </div>
  )
}
