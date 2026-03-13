import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

export async function fetchActuals(start, end) {
  const res = await axios.get(`${BASE}/api/actuals`, {
    params: { start, end }
  })
  return res.data.data
}

export async function fetchForecasts(start, end, horizon_hours) {
  const res = await axios.get(`${BASE}/api/forecasts`, {
    params: { start, end, horizon_hours }
  })
  return res.data.data
}
