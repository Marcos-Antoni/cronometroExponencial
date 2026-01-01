import { describe, it, expect } from 'vitest'
import { secondsToHHMMSS, hhmmssToSeconds, validateTimeRange, MIN_TIME, MAX_TIME, GROWTH_RATE } from '../../src/utils/timeUtils'

describe('Constantes', () => {
  it('MIN_TIME debe ser 3600 (1 hora)', () => {
    expect(MIN_TIME).toBe(3600)
  })

  it('MAX_TIME debe ser 57600 (16 horas)', () => {
    expect(MAX_TIME).toBe(57600)
  })

  it('GROWTH_RATE debe ser 1.01', () => {
    expect(GROWTH_RATE).toBe(1.01)
  })
})

describe('secondsToHHMMSS', () => {
  it('convierte 3600s a "01:00:00"', () => {
    expect(secondsToHHMMSS(3600)).toBe('01:00:00')
  })

  it('convierte 7200s a "02:00:00"', () => {
    expect(secondsToHHMMSS(7200)).toBe('02:00:00')
  })

  it('convierte 57600s a "16:00:00"', () => {
    expect(secondsToHHMMSS(57600)).toBe('16:00:00')
  })

  it('convierte 5430s a "01:30:30"', () => {
    expect(secondsToHHMMSS(5430)).toBe('01:30:30')
  })

  it('maneja 0 segundos como "00:00:00"', () => {
    expect(secondsToHHMMSS(0)).toBe('00:00:00')
  })

  it('maneja números con un solo dígito correctamente', () => {
    expect(secondsToHHMMSS(3661)).toBe('01:01:01')
  })

  it('maneja 3599s (límite antes de 1 hora) como "00:59:59"', () => {
    expect(secondsToHHMMSS(3599)).toBe('00:59:59')
  })
})

describe('hhmmssToSeconds', () => {
  it('convierte "01:00:00" a 3600', () => {
    expect(hhmmssToSeconds('01:00:00')).toBe(3600)
  })

  it('convierte "02:30:45" a 9045', () => {
    expect(hhmmssToSeconds('02:30:45')).toBe(9045)
  })

  it('convierte "16:00:00" a 57600', () => {
    expect(hhmmssToSeconds('16:00:00')).toBe(57600)
  })

  it('retorna null para formato inválido "25:00:00"', () => {
    expect(hhmmssToSeconds('25:00:00')).toBeNull()
  })

  it('retorna null para string vacío', () => {
    expect(hhmmssToSeconds('')).toBeNull()
  })

  it('retorna null para formato sin suficientes partes "01:00"', () => {
    expect(hhmmssToSeconds('01:00')).toBeNull()
  })

  it('retorna null para formato con letras "01:AA:00"', () => {
    expect(hhmmssToSeconds('01:AA:00')).toBeNull()
  })

  it('retorna null para minutos inválidos "01:60:00"', () => {
    expect(hhmmssToSeconds('01:60:00')).toBeNull()
  })

  it('retorna null para segundos inválidos "01:00:60"', () => {
    expect(hhmmssToSeconds('01:00:60')).toBeNull()
  })

  it('acepta formato con ceros a la izquierda "00:30:45"', () => {
    expect(hhmmssToSeconds('00:30:45')).toBe(1845)
  })
})

describe('validateTimeRange', () => {
  it('retorna true para 3600 (mínimo válido)', () => {
    expect(validateTimeRange(3600)).toBe(true)
  })

  it('retorna true para 57600 (máximo válido)', () => {
    expect(validateTimeRange(57600)).toBe(true)
  })

  it('retorna true para 10000 (rango medio)', () => {
    expect(validateTimeRange(10000)).toBe(true)
  })

  it('retorna false para 3599 (bajo mínimo)', () => {
    expect(validateTimeRange(3599)).toBe(false)
  })

  it('retorna false para 57601 (sobre máximo)', () => {
    expect(validateTimeRange(57601)).toBe(false)
  })

  it('retorna false para números negativos', () => {
    expect(validateTimeRange(-100)).toBe(false)
  })

  it('retorna false para 0', () => {
    expect(validateTimeRange(0)).toBe(false)
  })

  it('retorna true para 3601 (justo sobre el mínimo)', () => {
    expect(validateTimeRange(3601)).toBe(true)
  })

  it('retorna true para 57599 (justo bajo el máximo)', () => {
    expect(validateTimeRange(57599)).toBe(true)
  })
})
