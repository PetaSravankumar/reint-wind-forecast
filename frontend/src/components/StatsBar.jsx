import React from 'react'
import './StatsBar.css'

export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar fade-up">
      <StatCard label="Mean Abs Error" value={`${Number(stats.mean).toLocaleString()} MW`} accent="blue" />
      <StatCard label="Median Abs Error" value={`${Number(stats.median).toLocaleString()} MW`} accent="blue" />
      <StatCard label="P99 Error" value={`${Number(stats.p99).toLocaleString()} MW`} accent="orange" />
      <StatCard label="MAPE" value={`${stats.mape}%`} accent="green" />
      <StatCard label="Data Points" value={stats.count.toLocaleString()} accent="muted" />
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card stat-${accent}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}
