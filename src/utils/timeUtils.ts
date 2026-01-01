/**
 * Constantes del Temporizador Exponencial
 */
export const MIN_TIME = 3600;  // 1 hora en segundos
export const MAX_TIME = 57600; // 16 horas en segundos
export const GROWTH_RATE = 1.01; // Factor de crecimiento 1%

/**
 * Convierte segundos a formato HH:MM:SS
 * @param seconds - Número de segundos a convertir
 * @returns String en formato HH:MM:SS
 *
 * @example
 * secondsToHHMMSS(3600) // "01:00:00"
 * secondsToHHMMSS(5430) // "01:30:30"
 */
export function secondsToHHMMSS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

/**
 * Convierte formato HH:MM:SS a segundos
 * @param hhmmss - String en formato HH:MM:SS
 * @returns Número de segundos o null si el formato es inválido
 *
 * @example
 * hhmmssToSeconds("01:00:00") // 3600
 * hhmmssToSeconds("02:30:45") // 9045
 * hhmmssToSeconds("invalid") // null
 */
export function hhmmssToSeconds(hhmmss: string): number | null {
  // Regex: HH (00-23), MM (00-59), SS (00-59)
  const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  const match = hhmmss?.match(regex);

  if (!match) return null;

  // match[1]=HH, match[2]=MM, match[3]=SS
  const [h, m, s] = match.slice(1).map(Number);
  return h * 3600 + m * 60 + s;
}

/**
 * Valida si un tiempo en segundos está dentro del rango permitido
 * @param seconds - Número de segundos a validar
 * @returns true si está en el rango [MIN_TIME, MAX_TIME], false en caso contrario
 *
 * @example
 * validateTimeRange(3600) // true (mínimo válido)
 * validateTimeRange(10000) // true (en rango)
 * validateTimeRange(57600) // true (máximo válido)
 * validateTimeRange(3599) // false (bajo mínimo)
 * validateTimeRange(57601) // false (sobre máximo)
 */
export function validateTimeRange(seconds: number): boolean {
  return seconds >= MIN_TIME && seconds <= MAX_TIME;
}
