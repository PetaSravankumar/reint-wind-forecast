import React, { useState, useCallback } from 'react'
import Dashboard from './components/Dashboard.jsx'

export default function App() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Dashboard />
    </div>
  )
}
