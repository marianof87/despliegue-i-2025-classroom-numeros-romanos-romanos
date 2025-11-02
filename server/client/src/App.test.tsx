import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App component', () => {
  it('renders title', () => {
    render(<App />)
    expect(screen.getByText(/Convertidor Romano/i)).toBeInTheDocument()
  })

  it('converts 1999 to MCMXCIX locally', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/Ingrese número/i)
    const button = screen.getByText(/Convertir local/i)

    fireEvent.change(input, { target: { value: '1999' } })
    fireEvent.click(button)

    expect(await screen.findByText(/Resultado: MCMXCIX/i)).toBeInTheDocument()
  })

  it('shows error for invalid number', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/Ingrese número/i)
    const button = screen.getByText(/Convertir local/i)

    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.click(button)

    expect(await screen.findByText(/Por favor ingrese un número válido/i)).toBeInTheDocument()
  })

  it('shows error for numbers out of range', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/Ingrese número/i)
    const button = screen.getByText(/Convertir local/i)

    fireEvent.change(input, { target: { value: '4000' } })
    fireEvent.click(button)

    expect(await screen.findByText(/Número fuera de rango/i)).toBeInTheDocument()
  })

  it('handles empty input (treated as out of range)', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/Ingrese número/i)
    const button = screen.getByText(/Convertir local/i)

    // empty string -> Number('') === 0, component treats as out of range
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(button)

    expect(await screen.findByText(/Número fuera de rango/i)).toBeInTheDocument()
  })
})