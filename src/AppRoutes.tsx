import { Routes, Route, Navigate } from 'react-router-dom'
import Timer from './pages/Timer'
import Progress from './pages/Progress'
import Calculator from './pages/Calculator'
import Navigation from './components/Navigation'

/**
 * Componente de rutas y layout de la aplicación.
 * Separado de App.tsx para facilitar testing con MemoryRouter.
 */
export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-prime">
      <Navigation />
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
