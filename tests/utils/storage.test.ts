import { describe, it, expect, beforeEach } from 'vitest'
import { loadTimerValue, saveTimerValue, clearTimerValue } from '../../src/utils/storage'
import { MIN_TIME } from '../../src/utils/timeUtils'

describe('storage', () => {
  // Limpiar localStorage antes de cada test
  beforeEach(() => {
    localStorage.clear()
  })

  describe('loadTimerValue', () => {
    it('retorna 3600 si localStorage está vacío', () => {
      const value = loadTimerValue()
      expect(value).toBe(3600)
      expect(value).toBe(MIN_TIME)
    })

    it('retorna valor guardado si es válido (10000)', () => {
      localStorage.setItem('timer_value', '10000')
      const value = loadTimerValue()
      expect(value).toBe(10000)
    })

    it('retorna valor guardado si es válido (3600 - mínimo)', () => {
      localStorage.setItem('timer_value', '3600')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('retorna valor guardado si es válido (57600 - máximo)', () => {
      localStorage.setItem('timer_value', '57600')
      const value = loadTimerValue()
      expect(value).toBe(57600)
    })

    it('sanitiza valor corrupto menor a 3600 → 3600', () => {
      localStorage.setItem('timer_value', '2000')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('sanitiza valor corrupto mayor a 57600 → 3600', () => {
      localStorage.setItem('timer_value', '100000')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('maneja JSON inválido → 3600', () => {
      localStorage.setItem('timer_value', 'invalid-json-{]')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('convierte string "5000" a número 5000', () => {
      localStorage.setItem('timer_value', '5000')
      const value = loadTimerValue()
      expect(value).toBe(5000)
      expect(typeof value).toBe('number')
    })

    it('maneja string vacío → 3600', () => {
      localStorage.setItem('timer_value', '')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('maneja null explícito → 3600', () => {
      localStorage.setItem('timer_value', 'null')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('maneja undefined → 3600', () => {
      localStorage.setItem('timer_value', 'undefined')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('maneja valores negativos → 3600', () => {
      localStorage.setItem('timer_value', '-5000')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('maneja valor 0 → 3600', () => {
      localStorage.setItem('timer_value', '0')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('maneja NaN → 3600', () => {
      localStorage.setItem('timer_value', 'NaN')
      const value = loadTimerValue()
      expect(value).toBe(3600)
    })
  })

  describe('saveTimerValue', () => {
    it('guarda valor válido en localStorage', () => {
      saveTimerValue(10000)
      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('10000')
    })

    it('el valor guardado es recuperable', () => {
      saveTimerValue(15000)
      const loaded = loadTimerValue()
      expect(loaded).toBe(15000)
    })

    it('rechaza valores fuera de rango (no guarda) - menor al mínimo', () => {
      saveTimerValue(10000) // Guardar un valor válido primero
      saveTimerValue(2000) // Intentar guardar valor inválido

      // El valor debe seguir siendo el anterior (10000)
      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('10000')
    })

    it('rechaza valores fuera de rango (no guarda) - mayor al máximo', () => {
      saveTimerValue(10000) // Guardar un valor válido primero
      saveTimerValue(100000) // Intentar guardar valor inválido

      // El valor debe seguir siendo el anterior (10000)
      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('10000')
    })

    it('actualiza valor existente', () => {
      saveTimerValue(5000)
      expect(localStorage.getItem('timer_value')).toBe('5000')

      saveTimerValue(7000)
      expect(localStorage.getItem('timer_value')).toBe('7000')
    })

    it('guarda mínimo válido (3600)', () => {
      saveTimerValue(3600)
      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('3600')
    })

    it('guarda máximo válido (57600)', () => {
      saveTimerValue(57600)
      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('57600')
    })

    it('no guarda valores negativos', () => {
      saveTimerValue(10000)
      saveTimerValue(-5000)
      expect(localStorage.getItem('timer_value')).toBe('10000')
    })

    it('no guarda valor 0', () => {
      saveTimerValue(10000)
      saveTimerValue(0)
      expect(localStorage.getItem('timer_value')).toBe('10000')
    })
  })

  describe('clearTimerValue', () => {
    it('elimina clave timer_value de localStorage', () => {
      localStorage.setItem('timer_value', '10000')
      expect(localStorage.getItem('timer_value')).toBe('10000')

      clearTimerValue()
      expect(localStorage.getItem('timer_value')).toBeNull()
    })

    it('después de clear, loadTimerValue retorna default', () => {
      localStorage.setItem('timer_value', '10000')
      clearTimerValue()

      const value = loadTimerValue()
      expect(value).toBe(3600)
    })

    it('no arroja error si la clave no existe', () => {
      expect(() => clearTimerValue()).not.toThrow()
    })

    it('solo elimina timer_value, no otras claves', () => {
      localStorage.setItem('timer_value', '10000')
      localStorage.setItem('other_key', 'other_value')

      clearTimerValue()

      expect(localStorage.getItem('timer_value')).toBeNull()
      expect(localStorage.getItem('other_key')).toBe('other_value')
    })
  })
})
