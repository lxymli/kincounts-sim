# Kin Counts Simulator

An interactive browser tool for simulating the distribution of biological relatives (siblings, aunts/uncles, cousins) under configurable fertility models.

Companion to the [Kincounts](https://github.com/mxyl2161/Kincounts) R/workflowr project.

## Features

- **Two fertility models** — Poisson and Zero-Inflated Negative Binomial (ZINB)
- **Three kin types** — Siblings, Aunts & Uncles, Cousins, plus Total Kin
- **Probability Mass Function chart** — grouped bar chart showing simulated PMFs
- **Summary statistics** — mean, variance, and P(0 kin) per kin type
- **Reproducible results** — seeded RNG via `seedrandom`
- **Fast** — 10,000 draws in ~80 ms in-browser

## Parameters

| Parameter | Meaning | Range | Default |
|-----------|---------|-------|---------|
| μ | Mean fertility | 2 – 6 | 3 |
| θ | Dispersion (ZINB only) | 1 – 10 | 4 |
| π₀ | Zero-inflation probability (ZINB only) | 0 – 0.2 | 0.05 |
| n | Simulation draws | 1,000 – 50,000 | 10,000 |

## Simulation Model

Directly ports `simulate_relatives_zinb()` from the Kincounts R project:

- **Siblings** ~ NB(μ·(θ+1)/θ, θ+1) — analytic sibling distribution under ZINB fertility
- **Aunts & Uncles** — sum of two independent sibling draws (maternal + paternal)
- **Cousins** — sum over aunts/uncles of per-aunt/uncle ZINB(μ, θ, π₀) draws

Under Poisson, all draws use Poisson(μ).

## Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Recharts](https://recharts.org/) for the PMF bar chart
- [seedrandom](https://github.com/davidbau/seedrandom) for reproducible RNG

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.
