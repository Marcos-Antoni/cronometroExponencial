import { validateTimeRange, MIN_TIME } from './timeUtils'

/**
 * Clave utilizada en localStorage para guardar el valor del temporizador
 */
const STORAGE_KEY = 'timer_value'

/**
 * Carga el valor del temporizador desde localStorage con validación y sanitización
 *
 * Flujo de sanitización:
 * 1. Lee localStorage
 * 2. Si null o no existe → retorna MIN_TIME (3600)
 * 3. Parsea a número
 * 4. Valida rango con validateTimeRange()
 * 5. Si inválido → retorna MIN_TIME (3600)
 * 6. Si válido → retorna valor
 *
 * @returns Valor del temporizador en segundos, siempre válido (entre 3600 y 57600)
 *
 * @example
 * loadTimerValue() // 3600 (si localStorage vacío)
 * loadTimerValue() // 10000 (si hay valor válido guardado)
 * loadTimerValue() // 3600 (si valor guardado es corrupto)
 */
export function loadTimerValue(): number {
  try {
    // 1. Leer localStorage
    const storedValue = localStorage.getItem(STORAGE_KEY)

    // 2. Si no existe, retornar default
    if (!storedValue) return MIN_TIME


    // 3. Parsear a número
    const parsedValue = Number(storedValue)

    // 4. Validar que sea un número válido (no NaN)
    if (isNaN(parsedValue)) return MIN_TIME

    // 5. Validar rango
    if (!validateTimeRange(parsedValue)) return MIN_TIME

    // 6. Retornar valor válido
    return parsedValue
  } catch (error) {
    // Manejo de cualquier error (ej: localStorage no disponible)
    console.error('Error loading timer value from localStorage:', error)
    return MIN_TIME
  }
}

/**
 * Guarda el valor del temporizador en localStorage
 *
 * Solo guarda si el valor está en el rango válido [3600, 57600].
 * Si el valor es inválido, NO lo guarda (mantiene el valor anterior).
 *
 * @param seconds - Valor a guardar en segundos
 *
 * @example
 * saveTimerValue(10000) // Guarda 10000
 * saveTimerValue(2000) // NO guarda (fuera de rango)
 * saveTimerValue(100000) // NO guarda (fuera de rango)
 */
export function saveTimerValue(seconds: number): void {
  try {
    // Validar antes de guardar
    if (!validateTimeRange(seconds)) {
      console.warn(`Attempted to save invalid timer value: ${seconds}. Value not saved.`)
      return
    }

    // Guardar como string
    localStorage.setItem(STORAGE_KEY, String(seconds))
  } catch (error) {
    console.error('Error saving timer value to localStorage:', error)
  }
}

/**
 * Elimina el valor del temporizador de localStorage
 *
 * Después de llamar esta función, loadTimerValue() retornará MIN_TIME (3600).
 *
 * @example
 * clearTimerValue()
 * loadTimerValue() // 3600 (valor por defecto)
 */
export function clearTimerValue(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing timer value from localStorage:', error)
  }
}
