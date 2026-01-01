import { useState, useMemo, useEffect, useCallback } from 'react'
import { secondsToHHMMSS, MIN_TIME, MAX_TIME, validateTimeRange } from '../utils/timeUtils'
import { calculateNext, calculatePrevious, generateExponentialSequence } from '../utils/exponentialCalculations'
import { loadTimerValue, saveTimerValue } from '../utils/storage'

/**
 * Interface del valor de retorno del hook useExponentialTimer
 */
export interface UseExponentialTimerReturn {
  /** Tiempo actual en segundos */
  currentSeconds: number
  /** Tiempo actual formateado como HH:MM:SS */
  currentFormatted: string
  /** Incrementa el tiempo en 1% */
  incrementNext: () => void
  /** Decrementa el tiempo en 1% */
  incrementPrevious: () => void
  /** Resetea el tiempo a MIN_TIME (3600s) */
  resetTimer: () => void
  /** Establece un tiempo personalizado */
  setCustomTime: (seconds: number) => void
  /** True si el tiempo está en el mínimo */
  isAtMin: boolean
  /** True si el tiempo está en el máximo */
  isAtMax: boolean
  /** Índice de la sesión actual en la secuencia */
  currentSessionIndex: number
  /** Número total de sesiones en la secuencia */
  totalSessions: number
  /** Secuencia exponencial completa de valores */
  exponentialSequence: number[]
}

/**
 * Custom Hook que centraliza toda la lógica del Temporizador Exponencial
 *
 * Implementa el patrón "Single Source of Truth":
 * - Toda la lógica del temporizador está en este hook
 * - Persistencia automática en localStorage
 * - Validación de límites en todos los modificadores
 *
 * @returns Objeto con el estado actual del temporizador y funciones modificadoras
 *
 * @example
 * const {
 *   currentSeconds,
 *   currentFormatted,
 *   incrementNext,
 *   incrementPrevious,
 *   resetTimer
 * } = useExponentialTimer()
 */
export function useExponentialTimer(): UseExponentialTimerReturn {
  // ---------------------------------------------------------
  // 1. ESTADO BASE
  // ---------------------------------------------------------
  const [currentSeconds, setCurrentSeconds] = useState<number>(() => loadTimerValue())

  // ---------------------------------------------------------
  // 2. VALORES COMPUTADOS (DERIVADOS)
  // ---------------------------------------------------------

  // Genera la secuencia completa solo una vez
  const exponentialSequence = useMemo(() => generateExponentialSequence(), [])

  // Formato legible HH:MM:SS
  const currentFormatted = useMemo(() => secondsToHHMMSS(currentSeconds), [currentSeconds])

  // Información de la sesión actual
  const totalSessions = exponentialSequence.length

  const currentSessionIndex = useMemo(() => {
    const index = exponentialSequence.findIndex(value => value === currentSeconds)
    return index >= 0 ? index : 0
  }, [currentSeconds, exponentialSequence])

  // Flags de límites (simples, no requieren memoización)
  const isAtMin = currentSeconds === MIN_TIME
  const isAtMax = currentSeconds === MAX_TIME

  // ---------------------------------------------------------
  // 3. EFECTOS (PERSISTENCIA)
  // ---------------------------------------------------------

  useEffect(() => {
    saveTimerValue(currentSeconds)
  }, [currentSeconds])

  // ---------------------------------------------------------
  // 4. ACCIONES (MANEJADORES)
  // ---------------------------------------------------------

  const incrementNext = useCallback(() => {
    setCurrentSeconds(current => calculateNext(current))
  }, [])

  const incrementPrevious = useCallback(() => {
    setCurrentSeconds(current => calculatePrevious(current))
  }, [])

  const resetTimer = useCallback(() => {
    setCurrentSeconds(MIN_TIME)
  }, [])

  const setCustomTime = useCallback((seconds: number) => {
    if (validateTimeRange(seconds)) {
      setCurrentSeconds(seconds)
    } else {
      console.warn(`Attempted to set invalid time: ${seconds}. Value not changed.`)
    }
  }, [])

  // ---------------------------------------------------------
  // 5. INTERFAZ PÚBLICA
  // ---------------------------------------------------------

  return {
    currentSeconds,
    currentFormatted,
    incrementNext,
    incrementPrevious,
    resetTimer,
    setCustomTime,
    isAtMin,
    isAtMax,
    currentSessionIndex,
    totalSessions,
    exponentialSequence,
  }
}
