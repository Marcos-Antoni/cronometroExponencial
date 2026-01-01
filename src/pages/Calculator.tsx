import { useState, useMemo } from 'react'
import { useExponentialTimer } from '../hooks/useExponentialTimer'
import { validateTimeRange, secondsToHHMMSS } from '../utils/timeUtils'
import { calculateSessionsToTarget } from '../utils/exponentialCalculations'

/**
 * Página de calculadora para proyección de sesiones.
 * Rediseño Premium con inputs divididos para HH:MM:SS.
 */
export default function Calculator() {
  const { currentSeconds } = useExponentialTimer()

  // Estados para los 3 inputs
  const [hh, setHh] = useState('')
  const [mm, setMm] = useState('')
  const [ss, setSs] = useState('')

  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Tiempo total en segundos derivado de los inputs
  const targetSeconds = useMemo(() => {
    const h = parseInt(hh) || 0
    const m = parseInt(mm) || 0
    const s = parseInt(ss) || 0
    return h * 3600 + m * 60 + s
  }, [hh, mm, ss])

  const handleInputChange = (field: 'h' | 'm' | 's', value: string) => {
    // Solo permitir números
    const cleanValue = value.replace(/\D/g, '')

    if (field === 'h') {
      const val = parseInt(cleanValue) || 0
      if (val <= 23) setHh(cleanValue.slice(0, 2))
    } else if (field === 'm') {
      const val = parseInt(cleanValue) || 0
      if (val <= 59) setMm(cleanValue.slice(0, 2))
    } else {
      const val = parseInt(cleanValue) || 0
      if (val <= 59) setSs(cleanValue.slice(0, 2))
    }

    // Limpiar estados de resultado/error al editar
    if (error) setError(null)
    if (result !== null) setResult(null)
  }

  const handleCalculate = () => {
    if (!hh && !mm && !ss) {
      setError('Por favor, ingresa un tiempo objetivo')
      return
    }

    if (!validateTimeRange(targetSeconds)) {
      setError('El tiempo debe estar entre 01:00:00 y 16:00:00')
      setResult(null)
      return
    }

    const sessions = calculateSessionsToTarget(currentSeconds, targetSeconds)
    setResult(sessions)
    setError(null)
  }

  const formattedTarget = useMemo(() => {
    const h = (hh || '0').padStart(2, '0')
    const m = (mm || '0').padStart(2, '0')
    const s = (ss || '0').padStart(2, '0')
    return `${h}:${m}:${s}`
  }, [hh, mm, ss])

  return (
    <div className="min-h-screen bg-prime text-white p-6 font-sans selection:bg-accent/30">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Premium */}
        <header className="text-center space-y-2 py-8">
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50 tracking-tighter">
            CALCULADORA
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">
            Simulador de Proyección Temporal
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Panel Estado Actual */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-8">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider mb-6">Punto de Partida</h3>
              <div className="space-y-1">
                <div className="text-5xl font-black tracking-tight text-accent">
                  {secondsToHHMMSS(currentSeconds)}
                </div>
                <p className="text-white/20 text-xs uppercase tracking-widest font-bold">Tiempo Actual Guardado</p>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-white/40">
                  <span className="text-2xl">📈</span>
                  <p className="text-xs leading-relaxed">
                    Calcula cuántas sesiones del 1% necesitas para alcanzar tu próximo hito de productividad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Formulario */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider mb-8 text-center">Configurar Meta de Tiempo</h3>

              <div className="flex flex-col items-center space-y-8">
                {/* Visualizador de Inputs Divididos */}
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="text"
                      value={hh}
                      onChange={(e) => handleInputChange('h', e.target.value)}
                      placeholder="00"
                      className="w-20 md:w-28 h-20 md:h-28 bg-white/5 border-2 border-white/10 rounded-2xl text-center text-4xl md:text-5xl font-black focus:border-accent focus:bg-accent/10 outline-none transition-all duration-300 placeholder:text-white/10"
                      aria-label="Horas"
                    />
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Horas</span>
                  </div>

                  <span className="text-4xl md:text-5xl font-black text-white/20 mb-6">:</span>

                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="text"
                      value={mm}
                      onChange={(e) => handleInputChange('m', e.target.value)}
                      placeholder="00"
                      className="w-20 md:w-28 h-20 md:h-28 bg-white/5 border-2 border-white/10 rounded-2xl text-center text-4xl md:text-5xl font-black focus:border-accent focus:bg-accent/10 outline-none transition-all duration-300 placeholder:text-white/10"
                      aria-label="Minutos"
                    />
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Minutos</span>
                  </div>

                  <span className="text-4xl md:text-5xl font-black text-white/20 mb-6">:</span>

                  <div className="flex flex-col items-center gap-2">
                    <input
                      type="text"
                      value={ss}
                      onChange={(e) => handleInputChange('s', e.target.value)}
                      placeholder="00"
                      className="w-20 md:w-28 h-20 md:h-28 bg-white/5 border-2 border-white/10 rounded-2xl text-center text-4xl md:text-5xl font-black focus:border-accent focus:bg-accent/10 outline-none transition-all duration-300 placeholder:text-white/10"
                      aria-label="Segundos"
                    />
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Segundos</span>
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={!hh && !mm && !ss}
                  className="w-full max-w-md bg-accent hover:bg-accent/80 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,128,0.3)] hover:shadow-accent/50 transform active:scale-95 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Proyectar Sesiones
                </button>
              </div>
            </div>

            {/* Panel Resultados (Condicional) */}
            {(result !== null || error) && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {error && (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-4xl">⚠️</span>
                    <p className="text-alert font-bold uppercase tracking-widest text-xs">{error}</p>
                  </div>
                )}

                {result !== null && !error && (
                  <div className="text-center space-y-6">
                    <h4 className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">Resultado de Simulación</h4>

                    {result > 0 && (
                      <div className="space-y-4">
                        <div className="text-7xl font-black text-white drop-shadow-lg">
                          {result}
                        </div>
                        <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
                          Necesitas completar <span className="text-white font-bold">{result}</span> sesiones adicionales para alcanzar la meta de <span className="text-accent font-bold">{formattedTarget}</span>.
                        </p>
                      </div>
                    )}

                    {result === 0 && (
                      <div className="space-y-4">
                        <div className="text-7xl font-black text-accent opacity-50">✓</div>
                        <p className="text-white/60 text-lg font-bold">Ya te encuentras en este nivel de tiempo.</p>
                      </div>
                    )}

                    {result < 0 && (
                      <div className="space-y-4">
                        <div className="text-7xl font-black text-alert">
                          {Math.abs(result)}
                        </div>
                        <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
                          Superaste este objetivo hace aproximadamente <span className="text-alert font-bold">{Math.abs(result)}</span> sesiones.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <footer className="pt-8 text-center text-white/20 text-[10px] tracking-[0.4em] border-t border-white/5">
          ENGINEERED FOR PROGRESS • V1.0 • CALCULATOR MODULE
        </footer>
      </div>
    </div>
  )
}
