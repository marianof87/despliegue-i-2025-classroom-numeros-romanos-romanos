import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { intToRoman, romanToInt } from './converters'

export default function App() {
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const apiBase = import.meta?.env?.VITE_API_BASE || 'http://localhost:4000'

  async function handleConvert(useServer: boolean) {
  setError(null)
  setResult(null)
  try {
    if (mode === 'toRoman') {
      const num = Number(input)
      if (Number.isNaN(num)) throw new Error('Por favor ingrese un número válido')
      if (useServer) {
        const response = await axios.post(`${apiBase}/api/to-roman`, { value: num })
        setResult(response.data.roman)
      } else {
        setResult(intToRoman(num))
      }
    } else {
      if (useServer) {
        const response = await axios.post(`${apiBase}/api/from-roman`, { roman: input })
        setResult(response.data.number)
      } else {
        setResult(romanToInt(input))
      }
    }
  } catch (err: any) {
    // Asegúrate de que el mensaje de error se establezca correctamente
    setError(err?.response?.data?.error || err.message || String(err))
  }
}

  return (
    <div className="container">
      <div className="converter-box">
        <h1 className="title">Convertidor Romano ↔ Número</h1>

        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              checked={mode === 'toRoman'}
              onChange={() => setMode('toRoman')}
            />
            A Romano
          </label>

          <label className="radio-label">
            <input
              type="radio"
              checked={mode === 'fromRoman'}
              onChange={() => setMode('fromRoman')}
            />
            A Número
          </label>
        </div>

        <input
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === 'toRoman' ? 'Ingrese número (ej. 1999)' : 'Ingrese romano (ej. MCMXCIX)'}
        />

        <div className="button-group">
          <button className="button button-local" onClick={() => handleConvert(false)}>
            Convertir local
          </button>
          <button className="button button-server" onClick={() => handleConvert(true)}>
            Convertir via servidor
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {result !== null && <div className="result">Resultado: {String(result)}</div>}
      </div>

      <div className="api-base">API base: {apiBase}</div>
    </div>
  )
}