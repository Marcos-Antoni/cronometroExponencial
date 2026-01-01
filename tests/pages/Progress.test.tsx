import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Progress from '../../src/pages/Progress'

describe('Progress Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza canvas de Chart.js', () => {
    render(<Progress />)

    // Chart.js renderiza un canvas
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('muestra texto de progreso', () => {
    render(<Progress />)

    // Debe mostrar algo como "1 de 279 sesiones"
    expect(screen.getByText(/sesiones/i)).toBeInTheDocument()
  })

  it('muestra porcentaje de progreso', () => {
    render(<Progress />)

    // Debe mostrar un porcentaje (ej: "0.36%")
    expect(screen.getByText(/%/)).toBeInTheDocument()
  })

  it('progreso inicial es correcto (sesión 1)', () => {
    render(<Progress />)

    // Al inicio debe estar en la primera sesión
    // El diseño muestra "1" y "/ 279 Sesiones" en elementos separados
    expect(screen.getByText(/sesiones/i)).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('muestra progreso actualizado cuando cambia localStorage', () => {
    // Usar 3636 (segunda sesión de la secuencia exponencial)
    localStorage.setItem('timer_value', '3636')
    render(<Progress />)

    // Debe mostrar sesión 2 (índice 1 + 1)
    // El diseño muestra "2" y "/ 279 Sesiones" en elementos separados
    expect(screen.getByText(/sesiones/i)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('porcentaje es 0 al inicio', () => {
    render(<Progress />)

    // Debe mostrar algo como "0.36%" (primera sesión)
    const percentText = screen.getByText(/%/).textContent
    expect(percentText).toMatch(/0\.\d+%/)
  })

  it('renderiza título de la página', () => {
    render(<Progress />)

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('canvas tiene dimensiones apropiadas', () => {
    render(<Progress />)

    const canvas = document.querySelector('canvas')
    expect(canvas).toHaveAttribute('width')
    expect(canvas).toHaveAttribute('height')
  })
})
