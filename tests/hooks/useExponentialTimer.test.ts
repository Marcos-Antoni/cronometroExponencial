import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useExponentialTimer } from '../../src/hooks/useExponentialTimer'
import { MIN_TIME, MAX_TIME } from '../../src/utils/timeUtils'

describe('useExponentialTimer', () => {
  // Limpiar localStorage antes de cada test
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Inicialización', () => {
    it('inicializa con valor de localStorage si existe', () => {
      localStorage.setItem('timer_value', '10000')

      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(10000)
    })

    it('inicializa con 3600 si localStorage vacío', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(3600)
      expect(result.current.currentSeconds).toBe(MIN_TIME)
    })

    it('currentFormatted está en formato HH:MM:SS al inicializar', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentFormatted).toBe('01:00:00')
    })

    it('exponentialSequence se genera correctamente', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.exponentialSequence).toBeDefined()
      expect(result.current.exponentialSequence.length).toBeGreaterThan(0)
      expect(result.current.exponentialSequence[0]).toBe(MIN_TIME)
    })

    it('totalSessions es mayor a 0', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.totalSessions).toBeGreaterThan(0)
    })

    it('currentSessionIndex es 0 al inicio (primera sesión)', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSessionIndex).toBe(0)
    })
  })

  describe('incrementNext()', () => {
    it('aumenta tiempo en 1%', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(3600)

      act(() => {
        result.current.incrementNext()
      })

      expect(result.current.currentSeconds).toBe(3636)
    })

    it('actualiza currentFormatted después de incrementar', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.incrementNext()
      })

      expect(result.current.currentFormatted).toBe('01:00:36')
    })

    it('auto-guarda en localStorage después de incrementNext()', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.incrementNext()
      })

      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('3636')
    })

    it('no incrementa si ya está en el máximo', () => {
      localStorage.setItem('timer_value', String(MAX_TIME))
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(MAX_TIME)

      act(() => {
        result.current.incrementNext()
      })

      expect(result.current.currentSeconds).toBe(MAX_TIME)
    })

    it('isAtMax es true cuando alcanza el máximo', () => {
      localStorage.setItem('timer_value', String(MAX_TIME))
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.isAtMax).toBe(true)
    })
  })

  describe('incrementPrevious()', () => {
    it('disminuye tiempo en 1%', () => {
      localStorage.setItem('timer_value', '3636')
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(3636)

      act(() => {
        result.current.incrementPrevious()
      })

      expect(result.current.currentSeconds).toBe(3600)
    })

    it('auto-guarda en localStorage después de incrementPrevious()', () => {
      localStorage.setItem('timer_value', '10000')
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.incrementPrevious()
      })

      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('9901') // 10000 / 1.01 ≈ 9900.99 → 9901
    })

    it('no decrementa si ya está en el mínimo', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(MIN_TIME)

      act(() => {
        result.current.incrementPrevious()
      })

      expect(result.current.currentSeconds).toBe(MIN_TIME)
    })

    it('isAtMin es true cuando está en el mínimo', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.isAtMin).toBe(true)
    })
  })

  describe('resetTimer()', () => {
    it('vuelve a 3600', () => {
      localStorage.setItem('timer_value', '10000')
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSeconds).toBe(10000)

      act(() => {
        result.current.resetTimer()
      })

      expect(result.current.currentSeconds).toBe(3600)
    })

    it('guarda 3600 en localStorage', () => {
      localStorage.setItem('timer_value', '10000')
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.resetTimer()
      })

      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('3600')
    })

    it('currentFormatted es "01:00:00" después de reset', () => {
      localStorage.setItem('timer_value', '10000')
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.resetTimer()
      })

      expect(result.current.currentFormatted).toBe('01:00:00')
    })
  })

  describe('setCustomTime()', () => {
    it('acepta valor válido', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.setCustomTime(5000)
      })

      expect(result.current.currentSeconds).toBe(5000)
    })

    it('guarda valor válido en localStorage', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.setCustomTime(7000)
      })

      const stored = localStorage.getItem('timer_value')
      expect(stored).toBe('7000')
    })

    it('rechaza valor inválido (menor al mínimo)', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.setCustomTime(2000)
      })

      // Debe mantener el valor anterior (3600)
      expect(result.current.currentSeconds).toBe(3600)
    })

    it('rechaza valor inválido (mayor al máximo)', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.setCustomTime(100000)
      })

      // Debe mantener el valor anterior (3600)
      expect(result.current.currentSeconds).toBe(3600)
    })
  })

  describe('currentSessionIndex', () => {
    it('calcula posición en secuencia correctamente', () => {
      localStorage.setItem('timer_value', '3636')
      const { result } = renderHook(() => useExponentialTimer())

      // 3636 debería ser el índice 1 (segundo elemento)
      expect(result.current.currentSessionIndex).toBe(1)
    })

    it('índice es 0 para el valor inicial', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.currentSessionIndex).toBe(0)
    })

    it('índice cambia al incrementar', () => {
      const { result } = renderHook(() => useExponentialTimer())

      const initialIndex = result.current.currentSessionIndex

      act(() => {
        result.current.incrementNext()
      })

      expect(result.current.currentSessionIndex).toBe(initialIndex + 1)
    })
  })

  describe('Flags de límites', () => {
    it('isAtMin es false cuando no está en el mínimo', () => {
      localStorage.setItem('timer_value', '10000')
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.isAtMin).toBe(false)
    })

    it('isAtMax es false cuando no está en el máximo', () => {
      const { result } = renderHook(() => useExponentialTimer())

      expect(result.current.isAtMax).toBe(false)
    })

    it('isAtMin y isAtMax son mutuamente excluyentes', () => {
      const { result } = renderHook(() => useExponentialTimer())

      if (result.current.isAtMin) {
        expect(result.current.isAtMax).toBe(false)
      }

      if (result.current.isAtMax) {
        expect(result.current.isAtMin).toBe(false)
      }
    })
  })

  describe('Persistencia automática', () => {
    it('múltiples incrementos se guardan correctamente', () => {
      const { result } = renderHook(() => useExponentialTimer())

      act(() => {
        result.current.incrementNext()
        result.current.incrementNext()
        result.current.incrementNext()
      })

      const stored = localStorage.getItem('timer_value')
      const expected = result.current.currentSeconds
      expect(stored).toBe(String(expected))
    })

    it('cambios persisten al recrear el hook', () => {
      const { result: result1 } = renderHook(() => useExponentialTimer())

      act(() => {
        result1.current.incrementNext()
        result1.current.incrementNext()
      })

      const valueAfterIncrements = result1.current.currentSeconds

      // Recrear el hook (simula recargar la página)
      const { result: result2 } = renderHook(() => useExponentialTimer())

      expect(result2.current.currentSeconds).toBe(valueAfterIncrements)
    })
  })
})
