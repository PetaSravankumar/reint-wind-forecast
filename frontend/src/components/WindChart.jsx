import React, { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts'
import './WindChart.css'

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('en-GB', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'UTC'
  })
}

function formatShort(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const h = d.getUTCHours().toString().padStart(2, '0')
  const m = d.getUTCMinutes().toString().padStart(2, '0')
  const day = d.getUTCDate()
  const mon = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })
  if (h === '00' && m === '00') return `${day} ${mon}`
  return `${h}:${m}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="tooltip-time">{formatTime(label)}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
          <span className="tooltip-name">{p.dataKey === 'actual' ? 'Actual' : 'Forecast'}</span>
          <span className="tooltip-val">{p.value != null ? `${Number(p.value).toLocaleString()} MW` : '—'}</span>
        </div>
      ))}
      {payload.length === 2 && payload[0].value != null && payload[1].value != null && (
        <div className="tooltip-error">
          Δ {Math.abs(payload[0].value - payload[1].value).toLocaleString()} MW
        </div>
      )}
    </div>
  )
}

export default function WindChart({ data }) {
  // Determine tick frequency based on data size
  const tickInterval = data.length > 96 ? Math.floor(data.length / 24) : data.length > 48 ? 5 : 2

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <defs>
            <filter id="glow-blue">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="1 4"
            stroke="rgba(0, 180, 255, 0.08)"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tickFormatter={formatShort}
            interval={tickInterval}
            tick={{ fill: '#3d6080', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={{ stroke: 'rgba(0,180,255,0.1)' }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: '#3d6080', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            label={{ value: 'Power (MW)', angle: -90, position: 'insideLeft', fill: '#3d6080', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', dy: 50 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#00b4ff"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00b4ff', stroke: '#00b4ff', strokeWidth: 0 }}
            connectNulls={false}
            filter="url(#glow-blue)"
          />

          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#00e5a0"
            strokeWidth={2}
            strokeDasharray="0"
            dot={false}
            activeDot={{ r: 4, fill: '#00e5a0', stroke: '#00e5a0', strokeWidth: 0 }}
            connectNulls={false}
            filter="url(#glow-green)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
