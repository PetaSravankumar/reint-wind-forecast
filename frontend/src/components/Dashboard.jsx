import React, { useState } from 'react'
import { useWindData } from '../hooks/useWindData.js'
import WindChart from './WindChart.jsx'
import Controls from './Controls.jsx'
import StatsBar from './StatsBar.jsx'
import './Dashboard.css'

const DEFAULT_START = '2024-01-10T00:00'
const DEFAULT_END = '2024-01-11T00:00'

export default function Dashboard() {
  const [start, setStart] = useState(DEFAULT_START)
  const [end, setEnd] = useState(DEFAULT_END)
  const [horizon, setHorizon] = useState(4)
  const { actuals, forecasts, loading, error, stats, load } = useWindData()

  const handleFetch = () => {
    if (!start || !end) return
    load(start + ':00Z', end + ':00Z', horizon)
  }

  // Merge actuals and forecasts into chart data
  const chartData = React.useMemo(() => {
    const map = {}
    for (const a of actuals) {
      const key = a.startTime.slice(0, 16)
      map[key] = { time: key, actual: a.generation }
    }
    for (const f of forecasts) {
      const key = f.startTime.slice(0, 16)
      if (!map[key]) map[key] = { time: key }
      map[key].forecast = f.generation
    }
    return Object.values(map).sort((a, b) => a.time.localeCompare(b.time))
  }, [actuals, forecasts])

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header fade-up">
        <div className="header-left">
          <div className="logo-mark">
            <WindIcon />
          </div>
          <div>
            <h1 className="title">WindWatch</h1>
            <p className="subtitle">UK National Wind Power · Forecast Monitor</p>
          </div>
        </div>
        <div className="header-badge">
          <span className="badge-dot" />
          <span>Jan 2024 Dataset</span>
        </div>
      </header>

      {/* Controls */}
      <Controls
        start={start} setStart={setStart}
        end={end} setEnd={setEnd}
        horizon={horizon} setHorizon={setHorizon}
        onFetch={handleFetch}
        loading={loading}
      />

      {/* Stats */}
      {stats && <StatsBar stats={stats} />}

      {/* Error */}
      {error && (
        <div className="error-banner fade-up">
          <span>⚠</span> {error}
        </div>
      )}

      {/* Chart */}
      <div className="chart-container fade-up fade-up-2">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Fetching wind data...</p>
          </div>
        ) : chartData.length > 0 ? (
          <WindChart data={chartData} />
        ) : (
          <div className="empty-state">
            <WindIllustration />
            <p>Select a date range and click <strong>Load Data</strong> to begin</p>
          </div>
        )}
      </div>

      {/* Legend */}
      {chartData.length > 0 && !loading && (
        <div className="legend fade-up fade-up-3">
          <div className="legend-item">
            <span className="legend-line actual" />
            <span>Actual Generation (MW)</span>
          </div>
          <div className="legend-item">
            <span className="legend-line forecast" />
            <span>Forecasted Generation (MW)</span>
          </div>
        </div>
      )}
    </div>
  )
}

function WindIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="#00b4ff" strokeWidth="1.5" opacity="0.4" />
      <path d="M14 8 L14 14 L19 17" stroke="#00b4ff" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 14 L9 17" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2" fill="#00b4ff" />
    </svg>
  )
}

function WindIllustration() {
  return (
    <svg width="80" height="60" viewBox="0 0 80 60" fill="none" opacity="0.3">
      <path d="M10 30 Q25 15 40 30 Q55 45 70 30" stroke="#00b4ff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M10 38 Q25 23 40 38 Q55 53 70 38" stroke="#00e5a0" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
