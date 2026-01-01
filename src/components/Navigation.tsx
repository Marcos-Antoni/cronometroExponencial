import { NavLink } from 'react-router-dom'

/**
 * Componente de navegación global con diseño Premium.
 * Mobile-first: Barra inferior fija en móvil, superior en desktop.
 */
export default function Navigation() {
  return (
    <>
      {/* Navegación Desktop: Top Bar */}
      <nav className="hidden md:block bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <h2 className="text-white font-black text-lg tracking-tight">
                EXPONENTIAL TIMER
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-[0_0_15px_rgba(0,0,128,0.5)]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`
                }
              >
                Timer
              </NavLink>

              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-[0_0_15px_rgba(0,0,128,0.5)]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`
                }
              >
                Progress
              </NavLink>

              <NavLink
                to="/calculator"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-accent text-white shadow-[0_0_15px_rgba(0,0,128,0.5)]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`
                }
              >
                Calculator
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Navegación Mobile: Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
        <div className="grid grid-cols-3 gap-2 px-4 py-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-white/40 active:bg-white/5'
              }`
            }
          >
            <span className="text-xl">⏱️</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Timer</span>
          </NavLink>

          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-white/40 active:bg-white/5'
              }`
            }
          >
            <span className="text-xl">📈</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Progress</span>
          </NavLink>

          <NavLink
            to="/calculator"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-white/40 active:bg-white/5'
              }`
            }
          >
            <span className="text-xl">🧮</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Calculator</span>
          </NavLink>
        </div>
      </nav>

      {/* Spacer para evitar que el contenido quede debajo de la barra móvil */}
      <div className="md:hidden h-20" />
    </>
  )
}
