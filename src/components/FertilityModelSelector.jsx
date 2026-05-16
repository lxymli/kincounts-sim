export default function FertilityModelSelector({ model, onChange }) {
  return (
    <div className="control-group">
      <span className="control-label">Fertility Model</span>
      <div className="radio-group">
        {[
          { value: 'poisson', label: 'Poisson' },
          { value: 'zinb',    label: 'ZINB' },
        ].map(({ value, label }) => (
          <label key={value} className="radio-label">
            <input
              type="radio"
              name="model"
              value={value}
              checked={model === value}
              onChange={() => onChange(value)}
            />
            {label}
          </label>
        ))}
      </div>
      {model === 'zinb' && (
        <p className="model-hint">
          Zero-inflated negative binomial — θ controls overdispersion, π₀ excess zeros.
        </p>
      )}
      {model === 'poisson' && (
        <p className="model-hint">
          Pure Poisson fertility. Only μ is needed.
        </p>
      )}
    </div>
  )
}
