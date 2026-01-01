import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

/**
 * Componente principal de la aplicación.
 * Envuelve AppRoutes con BrowserRouter para producción.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
