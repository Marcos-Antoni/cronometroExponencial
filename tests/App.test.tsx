import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { userEvent } from '@testing-library/user-event'
import AppRoutes from '../src/AppRoutes'

describe('App Routing', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('ruta "/" renderiza Timer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Timer muestra el tiempo formateado (01:00:00 por defecto)
    // y botones Anterior, Siguiente, Reset
    expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('ruta "/progress" renderiza Progress', () => {
    render(
      <MemoryRouter initialEntries={['/progress']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Progress tiene título PROGRESO y canvas de Chart.js
    expect(screen.getByRole('heading', { level: 1, name: /progreso/i })).toBeInTheDocument()
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('ruta "/calculator" renderiza Calculator', () => {
    render(
      <MemoryRouter initialEntries={['/calculator']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Calculator tiene título CALCULADORA y inputs para HH:MM:SS
    expect(screen.getByRole('heading', { level: 1, name: /calculadora/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/horas/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/minutos/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/segundos/i)).toBeInTheDocument()
  })

  it('navegación entre rutas funciona', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Estamos en Timer
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()

    // Navegar a Progress (usar getAllByRole porque tenemos nav desktop y mobile)
    const progressLinks = screen.getAllByRole('link', { name: /progress/i })
    await user.click(progressLinks[0])

    // Ahora debemos estar en Progress
    expect(screen.getByRole('heading', { level: 1, name: /progreso/i })).toBeInTheDocument()

    // Navegar a Calculator
    const calculatorLinks = screen.getAllByRole('link', { name: /calculator/i })
    await user.click(calculatorLinks[0])

    // Ahora debemos estar en Calculator
    expect(screen.getByLabelText(/horas/i)).toBeInTheDocument()

    // Volver a Timer
    const timerLinks = screen.getAllByRole('link', { name: /timer/i })
    await user.click(timerLinks[0])

    // De vuelta en Timer
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('ruta inválida redirige a "/"', () => {
    render(
      <MemoryRouter initialEntries={['/ruta-inexistente']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Debe mostrar Timer (ruta por defecto)
    expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument()
  })

  it('componente Navigation está presente en todas las rutas', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Links de navegación deben estar presentes (múltiples por nav desktop/mobile)
    expect(screen.getAllByRole('link', { name: /timer/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /progress/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /calculator/i }).length).toBeGreaterThan(0)

    // Cambiar a otra ruta
    rerender(
      <MemoryRouter initialEntries={['/progress']}>
        <AppRoutes />
      </MemoryRouter>
    )

    // Los links siguen presentes
    expect(screen.getAllByRole('link', { name: /timer/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /progress/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /calculator/i }).length).toBeGreaterThan(0)
  })

  it('NavLink muestra estado activo visualmente', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    const timerLinks = screen.getAllByRole('link', { name: /timer/i })
    const progressLinks = screen.getAllByRole('link', { name: /progress/i })

    // Timer links deben tener clases de "activo" (bg-accent)
    expect(timerLinks[0].className).toMatch(/bg-accent/)

    // Progress links NO deben tener bg-accent
    expect(progressLinks[0].className).not.toMatch(/bg-accent/)
  })
})
