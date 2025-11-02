/// <reference types="vitest" />
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'          // <- importante: desde src/test hacia src/App.tsx
import axios from 'axios'

vi.mock('axios')                // mockea axios automáticamente

describe('App server integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls server to convert number to roman and shows result', async () => {
    // mockeamos la respuesta del post
    ;(axios.post as unknown as vi.Mock).mockResolvedValueOnce({ data: { roman: 'M' } })

    render(<App />)

    // ajusta estos selectores según tu marcado real
    const input = screen.getByPlaceholderText(/Ingrese número/i)
    const button = screen.getByText(/Convertir via servidor/i)

    fireEvent.change(input, { target: { value: '1' } })
    fireEvent.click(button)

    expect(await screen.findByText(/Resultado: M/)).toBeInTheDocument()
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/to-roman'),
      { value: 1 }
    )
  })

  it('shows server error message when API returns 400', async () => {
    ;(axios.post as unknown as vi.Mock).mockRejectedValueOnce({
      response: { data: { error: 'Error del servidor' } },
    })

    render(<App />)

    const input = screen.getByPlaceholderText(/Ingrese número/i)
    const button = screen.getByText(/Convertir via servidor/i)

    fireEvent.change(input, { target: { value: '9999' } })
    fireEvent.click(button)

    expect(await screen.findByText(/Error del servidor/)).toBeInTheDocument()
  })
})
