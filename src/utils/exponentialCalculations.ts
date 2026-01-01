import { MIN_TIME, MAX_TIME, GROWTH_RATE } from './timeUtils'

/**
 * Calcula el siguiente valor del temporizador aplicando crecimiento exponencial del 1%
 * @param currentSeconds - Tiempo actual en segundos
 * @returns Nuevo tiempo incrementado en 1%, capeado al máximo (57600s)
 *
 * @example
 * calculateNext(3600) // 3636
 * calculateNext(10000) // 10100
 * calculateNext(57600) // 57600 (ya en el máximo)
 */
export function calculateNext(currentSeconds: number): number {
  const nextValue = Math.round(currentSeconds * GROWTH_RATE)
  return Math.min(nextValue, MAX_TIME)
}

/**
 * Calcula el valor anterior del temporizador revirtiendo el crecimiento exponencial del 1%
 * @param currentSeconds - Tiempo actual en segundos
 * @returns Nuevo tiempo decrementado, mantenido al mínimo (3600s)
 *
 * @example
 * calculatePrevious(3636) // 3600
 * calculatePrevious(10100) // 10000
 * calculatePrevious(3600) // 3600 (ya en el mínimo)
 */
export function calculatePrevious(currentSeconds: number): number {
  const previousValue = Math.round(currentSeconds / GROWTH_RATE)
  return Math.max(previousValue, MIN_TIME)
}

/**
 * Calcula el número de sesiones necesarias para alcanzar un tiempo objetivo
 * Usa la fórmula logarítmica: n = ln(target/current) / ln(1.01)
 *
 * @param current - Tiempo actual en segundos
 * @param target - Tiempo objetivo en segundos
 * @returns Número de sesiones (positivo si falta, negativo si ya pasó, 0 si es igual)
 *
 * @example
 * calculateSessionsToTarget(3600, 7200) // ~70 (faltan 70 sesiones)
 * calculateSessionsToTarget(10000, 10000) // 0 (ya estás ahí)
 * calculateSessionsToTarget(10000, 5000) // ~-70 (lo alcanzaste hace 70 sesiones)
 */
export function calculateSessionsToTarget(current: number, target: number): number {
  // Caso especial: si son iguales, retornar 0
  if (current === target) {
    return 0
  }

  // Fórmula logarítmica: n = ln(target/current) / ln(growthRate)
  const ratio = target / current
  const sessions = Math.log(ratio) / Math.log(GROWTH_RATE)

  // Redondear:
  // - Positivos: hacia arriba (faltan X sesiones completas)
  // - Negativos: hacia abajo (hace X sesiones completas)
  if (sessions > 0) {
    return Math.ceil(sessions)
  } else {
    return Math.floor(sessions)
  }
}

/**
 * Genera la secuencia exponencial completa de valores discretos
 * desde MIN_TIME (3600s) hasta MAX_TIME (57600s).
 *
 * IMPORTANTE: Genera puntos DISCRETOS usando Math.round() en cada iteración,
 * NO una función exponencial continua. Esto garantiza sincronización exacta
 * con los valores que el temporizador producirá al hacer clic en "Siguiente".
 *
 * @returns Array de valores en segundos, representando cada sesión
 *
 * @example
 * const sequence = generateExponentialSequence()
 * sequence[0] // 3600
 * sequence[1] // 3636
 * sequence[sequence.length - 1] // 57600
 */
export function generateExponentialSequence(): number[] {
  const sequence: number[] = []
  let currentValue = MIN_TIME

  // Generar secuencia iterativa con redondeo en cada paso
  while (currentValue < MAX_TIME) {
    sequence.push(currentValue)
    currentValue = Math.round(currentValue * GROWTH_RATE)
  }

  // Agregar el valor máximo si no está ya incluido
  if (sequence[sequence.length - 1] !== MAX_TIME) {
    sequence.push(MAX_TIME)
  }

  return sequence
}
