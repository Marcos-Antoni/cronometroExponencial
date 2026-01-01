import { useMemo, useRef, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { useExponentialTimer } from '../hooks/useExponentialTimer'
import usePageTitle from '../hooks/usePageTitle'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

/**
 * Página de visualización del progreso exponencial con diseño Premium.
 */
export default function Progress() {
  usePageTitle('Progreso')
  const {
    exponentialSequence,
    currentSeconds,
    currentSessionIndex,
    totalSessions,
  } = useExponentialTimer()

  const chartRef = useRef<ChartJS<'line'>>(null)
  const [gradient, setGradient] = useState<CanvasGradient | string>('#000080')

  // Efecto para crear el gradiente del chart
  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !chart.ctx) return

    const ctx = chart.ctx
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400)
    gradientFill.addColorStop(0, 'rgba(0, 0, 128, 0.4)')
    gradientFill.addColorStop(1, 'rgba(0, 0, 128, 0)')
    setGradient(gradientFill)
  }, [])

  // Calcular porcentaje de progreso
  const progressPercentage = useMemo(() => {
    return ((currentSessionIndex / (totalSessions - 1)) * 100).toFixed(1)
  }, [currentSessionIndex, totalSessions])

  // Configurar datos para Chart.js
  const chartData: ChartData<'line'> = useMemo(() => {
    return {
      labels: exponentialSequence.map((_, i) => `S${i + 1}`),
      datasets: [
        {
          label: 'Tiempo de sesión',
          data: exponentialSequence,
          fill: true,
          backgroundColor: gradient,
          borderColor: '#000080',
          borderWidth: 3,
          pointBackgroundColor: exponentialSequence.map((val) =>
            val === currentSeconds ? '#FF0000' : '#000080'
          ),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: exponentialSequence.map((val) =>
            val === currentSeconds ? 8 : 4
          ),
          pointHoverRadius: exponentialSequence.map((val) =>
            val === currentSeconds ? 10 : 7
          ),
          pointHoverBackgroundColor: '#FF0000',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          tension: 0.4, // Curva suave "Premium"
        },
      ],
    }
  }, [exponentialSequence, currentSeconds, gradient])

  // Opciones de configuración de la gráfica
  const chartOptions: ChartOptions<'line'> = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const seconds = context.parsed.y
              if (typeof seconds !== 'number') return ''
              const hours = Math.floor(seconds / 3600)
              const minutes = Math.floor((seconds % 3600) / 60)
              const secs = seconds % 60
              return `⏱️ ${hours}h ${minutes}m ${secs}s (${seconds}s)`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            font: { size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.5)',
            font: { size: 11 },
          },
        },
      },
    }
  }, [])

  return (
    <div className="min-h-screen bg-prime text-white p-6 font-sans selection:bg-accent/30">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header con estilo Premium */}
        <header className="text-center space-y-2 py-8">
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50 tracking-tighter">
            PROGRESO
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold">
            Visualización de Curva Exponencial
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Panel de Estadísticas (Glassmorphism) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 group">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider mb-6">Estado Actual</h3>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-4xl font-bold tracking-tight">{currentSessionIndex + 1}</span>
                    <span className="text-white/30 text-sm mb-1">/ {totalSessions} Sesiones</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,128,0.5)]"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Porcentaje de Completitud</p>
                  <p className="text-5xl font-black text-accent drop-shadow-sm">{progressPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Tarjeta de Información Adicional */}
            <div className="bg-gradient-to-br from-accent/20 to-transparent backdrop-blur-md border border-white/5 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/30 flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <h4 className="font-bold text-lg">Crecimiento</h4>
                  <p className="text-white/40 text-sm">Escala exponencial activa</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Cada sesión incrementa su duración siguiendo una progresión geométrica, optimizando la adaptación y resistencia.
              </p>
            </div>
          </div>

          {/* Panel de la Gráfica */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider">Análisis de Curva</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <span className="text-white/40 text-xs">Tendencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-alert animate-pulse"></div>
                  <span className="text-white/40 text-xs">Actual</span>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] w-full">
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </div>

        </div>

        {/* Footer info */}
        <footer className="pt-8 text-center text-white/20 text-xs tracking-widest border-t border-white/5">
          TEMPORIZADOR EXPONENCIAL V1.0 • DATA DRIVEN PERFORMANCE
        </footer>
      </div>
    </div>
  )
}
