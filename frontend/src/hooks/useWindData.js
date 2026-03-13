import { useState, useCallback } from 'react'
import { fetchActuals, fetchForecasts } from '../utils/api.js'

export function useWindData() {
  const [actuals, setActuals] = useState([])
  const [forecasts, setForecasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  const load = useCallback(async (start, end, horizonHours) => {
    setLoading(true)
    setError(null)
    try {
      const [act, fct] = await Promise.all([
        fetchActuals(start, end),
        fetchForecasts(start, end, horizonHours)
      ])
      setActuals(act)
      setForecasts(fct)

      // Compute quick stats
      if (act.length > 0 && fct.length > 0) {
        const fctMap = Object.fromEntries(fct.map(f => [f.startTime.slice(0, 16), f.generation]))
        const errors = []
        for (const a of act) {
          const key = a.startTime.slice(0, 16)
          if (fctMap[key] !== undefined) {
            errors.push(Math.abs(a.generation - fctMap[key]))
          }
        }
        if (errors.length > 0) {
          const sorted = [...errors].sort((a, b) => a - b)
          const mean = errors.reduce((s, e) => s + e, 0) / errors.length
          const median = sorted[Math.floor(sorted.length / 2)]
          const p99 = sorted[Math.floor(sorted.length * 0.99)]
          const maxActual = Math.max(...act.map(a => a.generation))
          setStats({ mean: mean.toFixed(0), median: median.toFixed(0), p99: p99.toFixed(0), mape: ((mean / (maxActual || 1)) * 100).toFixed(1), count: errors.length })
        }
      }
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [])

  return { actuals, forecasts, loading, error, stats, load }
}
