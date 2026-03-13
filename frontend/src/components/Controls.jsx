import React from 'react'
import './Controls.css'

export default function Controls({ start, setStart, end, setEnd, horizon, setHorizon, onFetch, loading }) {
  return (
    <div className="controls fade-up fade-up-1">
      <div className="controls-grid">
        <div className="control-group">
          <label className="control-label">Start Time</label>
          <input
            type="datetime-local"
            className="control-input"
            value={start}
            onChange={e => setStart(e.target.value)}
            min="2024-01-01T00:00"
            max="2024-01-31T23:30"
          />
        </div>

        <div className="control-group">
          <label className="control-label">End Time</label>
          <input
            type="datetime-local"
            className="control-input"
            value={end}
            onChange={e => setEnd(e.target.value)}
            min="2024-01-01T00:00"
            max="2024-01-31T23:30"
          />
        </div>

        <div className="control-group horizon-group">
          <label className="control-label">
            Forecast Horizon
            <span className="horizon-value">{horizon}h</span>
          </label>
          <div className="slider-wrap">
            <input
              type="range"
              className="slider"
              min="0"
              max="48"
              step="1"
              value={horizon}
              onChange={e => setHorizon(Number(e.target.value))}
            />
            <div className="slider-track-labels">
              <span>0h</span>
              <span>24h</span>
              <span>48h</span>
            </div>
          </div>
        </div>

        <div className="control-group btn-group">
          <button
            className="fetch-btn"
            onClick={onFetch}
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> Loading...</>
            ) : (
              <><span className="btn-icon">↓</span> Load Data</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
