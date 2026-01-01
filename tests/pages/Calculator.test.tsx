import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Calculator from '../../src/pages/Calculator'

describe('Calculator Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const fillTime = async (user: ReturnType<typeof userEvent.setup>, h: string, m: string, s: string) => {
    const hInput = screen.getByLabelText(/horas/i)
    const mInput = screen.getByLabelText(/minutos/i)
    const sInput = screen.getByLabelText(/segundos/i)

    if (h) await user.type(hInput, h)
    if (m) await user.type(mInput, m)
    if (s) await user.type(sInput, s)
  }

  it('acepta entrada en los 3 campos de tiempo', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const hInput = screen.getByLabelText(/horas/i)
    const mInput = screen.getByLabelText(/minutos/i)
    const sInput = screen.getByLabelText(/segundos/i)

    await user.type(hInput, '02')
    await user.type(mInput, '30')
    await user.type(sInput, '45')

    expect(hInput).toHaveValue('02')
    expect(mInput).toHaveValue('30')
    expect(sInput).toHaveValue('45')
  })

  it('no permite valores fuera de rango en cada input', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const hInput = screen.getByLabelText(/horas/i)
    const mInput = screen.getByLabelText(/minutos/i)
    const sInput = screen.getByLabelText(/segundos/i)

    // Horas > 23 (debería ignorar o truncar según lógica, en mi impl bloquea si > 23 inicialmente)
    // Mi código: if (val <= 23) setHh(cleanValue.slice(0, 2))
    await user.type(hInput, '25')
    // Al escribir '2', cumple. Al escribir '5', 25 > 23, no actualiza.
    expect(hInput).toHaveValue('2')

    await user.type(mInput, '65')
    expect(mInput).toHaveValue('6') // El 5 se ignora porque 65 > 59

    await user.type(sInput, '99')
    expect(sInput).toHaveValue('9')
  })

  it('calcula sesiones faltantes para objetivo futuro', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    // Objetivo: 02:00:00 (h=02, m=00, s=00)
    await fillTime(user, '02', '00', '00')
    await user.click(button)

    expect(screen.getByText(/necesitas completar/i)).toBeInTheDocument()
    expect(screen.getByText(/sesiones adicionales/i)).toBeInTheDocument()
  })

  it('calcula sesiones pasadas para objetivo pasado', async () => {
    const user = userEvent.setup()
    localStorage.setItem('timer_value', '10000') // ~02:46:40
    render(<Calculator />)

    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    // Objetivo: 01:00:00
    await fillTime(user, '01', '00', '00')
    await user.click(button)

    expect(screen.getByText(/superaste este objetivo hace/i)).toBeInTheDocument()
  })

  it('muestra mensaje si objetivo = actual', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    // Objetivo = Actual (01:00:00)
    await fillTime(user, '01', '00', '00')
    await user.click(button)

    expect(screen.getByText(/ya te encuentras en este nivel de tiempo/i)).toBeInTheDocument()
  })

  it('muestra error si tiempo total es menor a 1 hora', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    // 00:30:00
    await fillTime(user, '00', '30', '00')
    await user.click(button)

    expect(screen.getByText(/debe estar entre 01:00:00 y 16:00:00/i)).toBeInTheDocument()
  })

  it('muestra error si tiempo total es mayor a 16 horas', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    // 17:00:00
    await fillTime(user, '17', '00', '00')
    await user.click(button)

    expect(screen.getByText(/debe estar entre 01:00:00 y 16:00:00/i)).toBeInTheDocument()
  })

  it('botón proyectar deshabilitado si inputs vacíos', () => {
    render(<Calculator />)

    const button = screen.getByRole('button', { name: /proyectar sesiones/i })
    expect(button).toBeDisabled()
  })

  it('botón proyectar habilitado si al menos un input tiene contenido', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const hInput = screen.getByLabelText(/horas/i)
    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    expect(button).toBeDisabled()

    await user.type(hInput, '01')
    expect(button).not.toBeDisabled()
  })

  it('limpia error al editar nuevamente', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    const hInput = screen.getByLabelText(/horas/i)
    const button = screen.getByRole('button', { name: /proyectar sesiones/i })

    // Generar error (00:00:01 es inváilido < 1h)
    await fillTime(user, '00', '00', '01')
    await user.click(button)
    expect(screen.getByText(/debe estar entre/i)).toBeInTheDocument()

    // Editar
    await user.type(hInput, '02')

    // El error debe desaparecer
    expect(screen.queryByText(/debe estar entre/i)).not.toBeInTheDocument()
  })

  it('muestra el tiempo actual del usuario formateado', () => {
    render(<Calculator />)
    expect(screen.getByText(/01:00:00/)).toBeInTheDocument()
  })
})
