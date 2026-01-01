import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Timer from '../../src/pages/Timer'

describe('Timer Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renderiza tiempo formateado HH:MM:SS', () => {
    render(<Timer />)

    // Debe mostrar el tiempo inicial (01:00:00)
    expect(screen.getByText('01:00:00')).toBeInTheDocument()
  })

  it('botón Siguiente incrementa tiempo', async () => {
    const user = userEvent.setup()
    render(<Timer />)

    // Tiempo inicial
    expect(screen.getByText('01:00:00')).toBeInTheDocument()

    // Click en Siguiente
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    await user.click(nextButton)

    // Debe mostrar 01:00:36 (3636s)
    expect(screen.getByText('01:00:36')).toBeInTheDocument()
  })

  it('botón Anterior decrementa tiempo', async () => {
    const user = userEvent.setup()
    localStorage.setItem('timer_value', '3636')
    render(<Timer />)

    // Tiempo inicial (cargado desde localStorage)
    expect(screen.getByText('01:00:36')).toBeInTheDocument()

    // Click en Anterior
    const prevButton = screen.getByRole('button', { name: /anterior/i })
    await user.click(prevButton)

    // Debe volver a 01:00:00
    expect(screen.getByText('01:00:00')).toBeInTheDocument()
  })

  it('botón Anterior deshabilitado en mínimo (3600s)', () => {
    render(<Timer />)

    const prevButton = screen.getByRole('button', { name: /anterior/i })
    expect(prevButton).toBeDisabled()
  })

  it('botón Siguiente deshabilitado en máximo (57600s)', () => {
    localStorage.setItem('timer_value', '57600')
    render(<Timer />)

    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeDisabled()
  })

  it('botón Reset vuelve a 01:00:00', async () => {
    const user = userEvent.setup()
    localStorage.setItem('timer_value', '10000')
    render(<Timer />)

    // Verificar que NO es 01:00:00
    expect(screen.queryByText('01:00:00')).not.toBeInTheDocument()

    // Click en Reset
    const resetButton = screen.getByRole('button', { name: /reset/i })
    await user.click(resetButton)

    // Debe mostrar 01:00:00
    expect(screen.getByText('01:00:00')).toBeInTheDocument()
  })

  it('muestra indicador de sesión actual', () => {
    render(<Timer />)

    // Debe mostrar algo como "Sesión 1/279" o similar
    expect(screen.getByText(/sesión/i)).toBeInTheDocument()
  })

  it('indicador de sesión se actualiza al incrementar', async () => {
    const user = userEvent.setup()
    render(<Timer />)

    // Sesión inicial
    const initialSessionText = screen.getByText(/sesión/i).textContent

    // Click en Siguiente
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    await user.click(nextButton)

    // Sesión debe haber cambiado
    const newSessionText = screen.getByText(/sesión/i).textContent
    expect(newSessionText).not.toBe(initialSessionText)
  })

  it('botones tienen los nombres correctos', () => {
    render(<Timer />)

    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('múltiples clics en Siguiente incrementan correctamente', async () => {
    const user = userEvent.setup()
    render(<Timer />)

    const nextButton = screen.getByRole('button', { name: /siguiente/i })

    // 3 clics
    await user.click(nextButton)
    await user.click(nextButton)
    await user.click(nextButton)

    // 3600 * 1.01^3 ≈ 3709
    expect(screen.getByText('01:01:49')).toBeInTheDocument()
  })
})
