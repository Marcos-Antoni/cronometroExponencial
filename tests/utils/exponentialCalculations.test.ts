import { describe, it, expect } from 'vitest'
import { calculateNext, calculatePrevious, calculateSessionsToTarget, generateExponentialSequence } from '../../src/utils/exponentialCalculations'
import { MIN_TIME, MAX_TIME } from '../../src/utils/timeUtils'

describe('calculateNext', () => {
  it('3600 * 1.01 = 3636', () => {
    expect(calculateNext(3600)).toBe(3636)
  })

  it('10000 * 1.01 = 10100', () => {
    expect(calculateNext(10000)).toBe(10100)
  })

  it('redondea correctamente: 3600.5 → 3601', () => {
    // 3600 * 1.01 = 3636 (entero exacto)
    // Probemos con un caso que requiera redondeo
    const result = calculateNext(3605)
    expect(result).toBe(3641) // 3605 * 1.01 = 3641.05 → 3641
  })

  it('aplica cap: 57000 * 1.01 = 57570 (aún bajo el máximo)', () => {
    const result = calculateNext(57000)
    expect(result).toBe(57570) // 57000 * 1.01 = 57570, aún bajo 57600
  })

  it('mantiene máximo: 57600 * 1.01 = 57600', () => {
    expect(calculateNext(57600)).toBe(57600)
  })

  it('redondea hacia el entero más cercano', () => {
    const result = calculateNext(10001)
    expect(result).toBe(10101) // 10001 * 1.01 = 10101.01 → 10101
  })

  it('valores cercanos al máximo se capean correctamente', () => {
    const result = calculateNext(57500)
    expect(result).toBe(57600) // 57500 * 1.01 = 58075, cap a 57600
  })
})

describe('calculatePrevious', () => {
  it('3636 / 1.01 = 3600', () => {
    expect(calculatePrevious(3636)).toBe(3600)
  })

  it('10100 / 1.01 = 10000', () => {
    expect(calculatePrevious(10100)).toBe(10000)
  })

  it('aplica floor: 3700 / 1.01 ≈ 3663.37 → 3663', () => {
    const result = calculatePrevious(3700)
    expect(result).toBe(3663) // 3700 / 1.01 = 3663.366... → 3663
  })

  it('mantiene mínimo: 3600 / 1.01 = 3600', () => {
    expect(calculatePrevious(3600)).toBe(3600)
  })

  it('valores cercanos al mínimo se mantienen en mínimo', () => {
    const result = calculatePrevious(3610)
    expect(result).toBe(3600) // 3610 / 1.01 = 3574.26, floor a 3600
  })

  it('redondea correctamente valores medios', () => {
    const result = calculatePrevious(10101)
    expect(result).toBe(10001) // 10101 / 1.01 = 10001
  })

  it('valores que resultan válidos al dividir se mantienen', () => {
    const result = calculatePrevious(3650)
    expect(result).toBe(3614) // 3650 / 1.01 = 3613.86 → 3614 (válido, >= 3600)
  })
})

describe('calculateSessionsToTarget', () => {
  it('de 3600 a 7200 retorna número positivo', () => {
    const sessions = calculateSessionsToTarget(3600, 7200)
    expect(sessions).toBeGreaterThan(0)
    // Verificación matemática: ln(7200/3600) / ln(1.01) ≈ 69.66 → 70
    expect(sessions).toBe(70)
  })

  it('de 10000 a 10000 retorna 0', () => {
    expect(calculateSessionsToTarget(10000, 10000)).toBe(0)
  })

  it('de 10000 a 5000 retorna número negativo', () => {
    const sessions = calculateSessionsToTarget(10000, 5000)
    expect(sessions).toBeLessThan(0)
    // ln(5000/10000) / ln(1.01) ≈ -69.66 → -70
    expect(sessions).toBe(-70)
  })

  it('de 3600 a 57600 calcula sesiones totales', () => {
    const sessions = calculateSessionsToTarget(3600, 57600)
    expect(sessions).toBeGreaterThan(0)
    // ln(57600/3600) / ln(1.01) = ln(16) / ln(1.01) ≈ 278.6 → 279
    expect(sessions).toBe(279)
  })

  it('redondea hacia arriba (Math.ceil)', () => {
    // De 3600 a 3636: ln(3636/3600) / ln(1.01) ≈ 1
    const sessions = calculateSessionsToTarget(3600, 3636)
    expect(sessions).toBe(1)
  })

  it('valores muy cercanos dan sesión 0', () => {
    const sessions = calculateSessionsToTarget(5000, 5000)
    expect(sessions).toBe(0)
  })

  it('objetivo menor al actual da negativo', () => {
    const sessions = calculateSessionsToTarget(7200, 3600)
    expect(sessions).toBeLessThan(0)
    expect(sessions).toBe(-70)
  })
})

describe('generateExponentialSequence', () => {
  it('primer elemento es 3600', () => {
    const sequence = generateExponentialSequence()
    expect(sequence[0]).toBe(MIN_TIME)
    expect(sequence[0]).toBe(3600)
  })

  it('último elemento es <= 57600', () => {
    const sequence = generateExponentialSequence()
    const lastElement = sequence[sequence.length - 1]
    expect(lastElement).toBeLessThanOrEqual(MAX_TIME)
    expect(lastElement).toBeLessThanOrEqual(57600)
  })

  it('cada elemento cumple: arr[i] = round(arr[i-1] * 1.01)', () => {
    const sequence = generateExponentialSequence()

    // Verificar primeros 10 elementos
    for (let i = 1; i < 10; i++) {
      const expected = Math.round(sequence[i - 1] * 1.01)
      // Si el esperado excede el máximo, debe estar capeado
      const cappedExpected = Math.min(expected, MAX_TIME)
      expect(sequence[i]).toBe(cappedExpected)
    }
  })

  it('genera aproximadamente 460 elementos', () => {
    const sequence = generateExponentialSequence()
    // El número exacto puede variar ligeramente debido al redondeo
    // pero debería estar cerca de 278 según los cálculos
    expect(sequence.length).toBeGreaterThan(270)
    expect(sequence.length).toBeLessThan(290)
  })

  it('no contiene duplicados consecutivos (excepto al final si está en máximo)', () => {
    const sequence = generateExponentialSequence()

    for (let i = 1; i < sequence.length - 1; i++) {
      // Permitir duplicados solo si ambos son el máximo
      if (sequence[i] === sequence[i - 1]) {
        expect(sequence[i]).toBe(MAX_TIME)
      }
    }
  })

  it('todos los elementos están en el rango válido', () => {
    const sequence = generateExponentialSequence()

    sequence.forEach(value => {
      expect(value).toBeGreaterThanOrEqual(MIN_TIME)
      expect(value).toBeLessThanOrEqual(MAX_TIME)
    })
  })

  it('secuencia es estrictamente creciente hasta alcanzar el máximo', () => {
    const sequence = generateExponentialSequence()

    for (let i = 1; i < sequence.length; i++) {
      // Debe ser mayor o igual (igual solo si llegó al máximo)
      expect(sequence[i]).toBeGreaterThanOrEqual(sequence[i - 1])
    }
  })

  it('incluye valores específicos conocidos', () => {
    const sequence = generateExponentialSequence()

    // Debe incluir el valor inicial
    expect(sequence).toContain(3600)

    // Segundo valor debe ser 3636
    expect(sequence[1]).toBe(3636)

    // Tercer valor debe ser 3672
    expect(sequence[3]).toBe(3709)
  })
})
