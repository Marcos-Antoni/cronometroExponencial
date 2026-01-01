import { useExponentialTimer } from '../hooks/useExponentialTimer'
import usePageTitle from '../hooks/usePageTitle'

/**
 * Página principal del Temporizador Exponencial
 *
 * Muestra el tiempo actual en formato grande y legible,
 * con controles para incrementar, decrementar y resetear.
 *
 * Diseño: Premium, Moderno, Minimalista con micro-animaciones
 */
export default function Timer() {
  usePageTitle('Temporizador')
  const {
    currentFormatted,
    incrementNext,
    incrementPrevious,
    resetTimer,
    isAtMin,
    isAtMax,
    currentSessionIndex,
    totalSessions,
  } = useExponentialTimer()

  return (
    <div className="min-h-screen bg-prime flex flex-col items-center justify-center p-4">
      {/* Contenedor principal */}
      <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
        {/* Display del tiempo - Hero */}
        <div className="text-center">
          <h1 className="text-8xl md:text-9xl font-bold text-white tracking-wider mb-4 transition-all duration-300">
            {currentFormatted}
          </h1>

          {/* Indicador de sesión */}
          <p className="text-sm text-gray-400">
            Sesión {currentSessionIndex + 1} / {totalSessions}
          </p>
        </div>

        {/* Controles - Botones principales */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          {/* Botón Anterior */}
          <button
            onClick={incrementPrevious}
            disabled={isAtMin}
            className="flex-1 bg-action hover:bg-action/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform active:scale-95 transition-all duration-200 text-lg"
            aria-label="Anterior"
          >
            ← Anterior
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={incrementNext}
            disabled={isAtMax}
            className="flex-1 bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg shadow-lg transform active:scale-95 transition-all duration-200 text-lg"
            aria-label="Siguiente"
          >
            Siguiente →
          </button>
        </div>

        {/* Botón Reset - Secundario */}
        <button
          onClick={resetTimer}
          className="bg-alert hover:bg-alert/80 text-white font-medium py-3 px-6 rounded-lg shadow-md transform active:scale-95 transition-all duration-200"
          aria-label="Reset"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
