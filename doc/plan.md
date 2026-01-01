# Plan de Implementación Detallado - Temporizador Exponencial

## Introducción

Este plan implementa una PWA de Temporizador Exponencial usando **metodología TDD (Test-Driven Development)**. El desarrollo se divide en **8 fases independientes** que construyen progresivamente la funcionalidad completa.

### Principios Fundamentales
- **TDD estricto:** Tests PRIMERO, código DESPUÉS
- **Single Source of Truth:** Custom Hook `useExponentialTimer` centraliza lógica
- **Persistencia Transparente:** Auto-guardado en localStorage sin acción manual
- **Validación de Límites:** 3600s ≤ t ≤ 57600s en toda la lógica de negocio

### Stack Tecnológico (YA CONFIGURADO)
- React 19 + TypeScript + Vite
- Tailwind CSS (colores: `prime`, `accent`, `action`, `alert`)
- react-router-dom 7.11.0
- chart.js 4.5.1 + react-chartjs-2
- vitest 4.0.16 + @testing-library/react

---

## FASE 1: Fundamentos - Utilidades y Formateo

### Objetivo
Crear funciones de utilidad puras para conversiones de tiempo y formateo. Son la base de todas las demás fases.

### Tests a Escribir (TDD)
**Archivo:** `src/utils/timeUtils.test.ts`

```typescript
describe('secondsToHHMMSS', () => {
  test('convierte 3600s a "01:00:00"')
  test('convierte 7200s a "02:00:00"')
  test('convierte 57600s a "16:00:00"')
  test('convierte 5430s a "01:30:30"')
  test('maneja 0 segundos como "00:00:00"')
})

describe('hhmmssToSeconds', () => {
  test('convierte "01:00:00" a 3600')
  test('convierte "02:30:45" a 9045')
  test('convierte "16:00:00" a 57600')
  test('retorna null para formato inválido "25:00:00"')
  test('retorna null para string vacío')
})

describe('validateTimeRange', () => {
  test('retorna true para 3600 (mínimo válido)')
  test('retorna true para 57600 (máximo válido)')
  test('retorna true para 10000 (rango medio)')
  test('retorna false para 3599 (bajo mínimo)')
  test('retorna false para 57601 (sobre máximo)')
  test('retorna false para números negativos')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/utils/timeUtils.ts`

```typescript
// Constantes
export const MIN_TIME = 3600;  // 1h
export const MAX_TIME = 57600; // 16h
export const GROWTH_RATE = 1.01;

// Funciones (implementar DESPUÉS de tests)
export function secondsToHHMMSS(seconds: number): string
export function hhmmssToSeconds(hhmmss: string): number | null
export function validateTimeRange(seconds: number): boolean
```

### Criterios de Aceptación
- ✅ Todos los tests pasan
- ✅ Funciones puras sin efectos secundarios
- ✅ Manejo de casos borde (0, negativos, formato inválido)
- ✅ TypeScript sin errores de tipo

### Dependencias
Ninguna (fase inicial)

---

## FASE 2: Lógica de Negocio - Cálculos Exponenciales

### Objetivo
Implementar algoritmos matemáticos críticos del temporizador exponencial.

### Tests a Escribir (TDD)
**Archivo:** `src/utils/exponentialCalculations.test.ts`

```typescript
describe('calculateNext', () => {
  test('3600 * 1.01 = 3636')
  test('10000 * 1.01 = 10100')
  test('redondea 3600.5 a 3601')
  test('aplica cap: 57000 * 1.01 = 57600 (no 57570)')
  test('mantiene máximo: 57600 * 1.01 = 57600')
})

describe('calculatePrevious', () => {
  test('3636 / 1.01 = 3600')
  test('10100 / 1.01 = 10000')
  test('aplica floor: 3700 / 1.01 = 3600 (no 3663)')
  test('mantiene mínimo: 3600 / 1.01 = 3600')
})

describe('calculateSessionsToTarget', () => {
  test('de 3600 a 7200 retorna número positivo')
  test('de 10000 a 10000 retorna 0')
  test('de 10000 a 5000 retorna número negativo')
  test('de 3600 a 57600 calcula sesiones totales')
  test('redondea hacia arriba (Math.ceil)')
})

describe('generateExponentialSequence', () => {
  test('primer elemento es 3600')
  test('último elemento es <= 57600')
  test('cada elemento cumple: arr[i] = round(arr[i-1] * 1.01)')
  test('genera aproximadamente 460 elementos')
  test('no contiene duplicados consecutivos')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/utils/exponentialCalculations.ts`

```typescript
// Implementar DESPUÉS de tests
export function calculateNext(currentSeconds: number): number
export function calculatePrevious(currentSeconds: number): number
export function calculateSessionsToTarget(current: number, target: number): number
export function generateExponentialSequence(): number[]
```

**Algoritmos Exactos (del doc/especificaciones.md):**
- **Siguiente:** `Math.min(Math.round(t * 1.01), 57600)`
- **Anterior:** `Math.max(Math.round(t / 1.01), 3600)`
- **Proyección:** `Math.ceil(Math.log(target / current) / Math.log(1.01))`
- **Secuencia:** Loop iterativo con `Math.round()` NO función continua

### Criterios de Aceptación
- ✅ Todos los tests pasan
- ✅ Algoritmos coinciden con especificaciones.md
- ✅ Validación de límites en cada función
- ✅ Funciones puras (sin estado)

### Dependencias
- Fase 1 (constantes `MIN_TIME`, `MAX_TIME`, `GROWTH_RATE`)

---

## FASE 3: Persistencia - LocalStorage Wrapper

### Objetivo
Crear capa de persistencia type-safe con validación automática.

### Tests a Escribir (TDD)
**Archivo:** `src/utils/storage.test.ts`

```typescript
describe('loadTimerValue', () => {
  test('retorna 3600 si localStorage está vacío')
  test('retorna valor guardado si es válido (10000)')
  test('sanitiza valor corrupto menor a 3600 → 3600')
  test('sanitiza valor corrupto mayor a 57600 → 3600')
  test('maneja JSON inválido → 3600')
  test('convierte string "5000" a número 5000')
})

describe('saveTimerValue', () => {
  test('guarda valor válido en localStorage')
  test('el valor guardado es recuperable')
  test('rechaza valores fuera de rango (no guarda)')
  test('actualiza valor existente')
})

describe('clearTimerValue', () => {
  test('elimina clave timer_value de localStorage')
  test('después de clear, loadTimerValue retorna default')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/utils/storage.ts`

```typescript
const STORAGE_KEY = 'timer_value';

export function loadTimerValue(): number
export function saveTimerValue(seconds: number): void
export function clearTimerValue(): void
```

**Lógica de Sanitización:**
1. Leer `localStorage.getItem(STORAGE_KEY)`
2. Si null → return 3600
3. Parsear a número
4. Validar con `validateTimeRange()`
5. Si inválido → return 3600
6. Si válido → return valor

### Criterios de Aceptación
- ✅ Todos los tests pasan
- ✅ Tests usan `beforeEach(() => localStorage.clear())`
- ✅ Manejo robusto de corrupción de datos
- ✅ Type-safe (TypeScript)

### Dependencias
- Fase 1 (`validateTimeRange`, `MIN_TIME`)

---

## FASE 4: Custom Hook - useExponentialTimer (Single Source of Truth)

### Objetivo
Centralizar toda la lógica del temporizador en un Custom Hook con auto-persistencia.

### Tests a Escribir (TDD)
**Archivo:** `src/hooks/useExponentialTimer.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react'

describe('useExponentialTimer', () => {
  beforeEach(() => localStorage.clear())

  test('inicializa con valor de localStorage si existe')
  test('inicializa con 3600 si localStorage vacío')
  test('incrementNext() aumenta tiempo en 1%')
  test('incrementPrevious() disminuye tiempo en 1%')
  test('resetTimer() vuelve a 3600')
  test('setCustomTime() acepta valor válido')
  test('setCustomTime() rechaza valor inválido')
  test('auto-guarda en localStorage después de incrementNext()')
  test('auto-guarda en localStorage después de incrementPrevious()')
  test('currentSessionIndex calcula posición en secuencia')
  test('totalSessions retorna longitud de secuencia')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/hooks/useExponentialTimer.ts`

```typescript
interface UseExponentialTimerReturn {
  currentSeconds: number;
  currentFormatted: string; // HH:MM:SS
  incrementNext: () => void;
  incrementPrevious: () => void;
  resetTimer: () => void;
  setCustomTime: (seconds: number) => void;
  isAtMin: boolean;
  isAtMax: boolean;
  currentSessionIndex: number; // posición en secuencia
  totalSessions: number; // longitud secuencia
  exponentialSequence: number[]; // para gráfica
}

export function useExponentialTimer(): UseExponentialTimerReturn
```

**Arquitectura Interna:**
1. `useState` para tiempo actual
2. `useMemo` para secuencia exponencial (generada UNA vez)
3. `useMemo` para formato HH:MM:SS
4. `useEffect` para auto-guardado en localStorage
5. Callbacks para modificadores

### Criterios de Aceptación
- ✅ Todos los tests pasan
- ✅ Hook sigue reglas de React Hooks
- ✅ Auto-persistencia funciona sin intervención manual
- ✅ Validación de límites en todos los modificadores
- ✅ Cálculo correcto de posición en secuencia

### Dependencias
- Fase 1 (formateo)
- Fase 2 (cálculos exponenciales)
- Fase 3 (storage)

---

## FASE 5: Componente Timer - Página Principal

### Objetivo
Crear UI principal del temporizador con diseño premium y controles.

### Tests a Escribir (TDD - Lógica UI, NO diseño)
**Archivo:** `src/pages/Timer.test.tsx`

```typescript
describe('Timer Page', () => {
  test('renderiza tiempo formateado HH:MM:SS')
  test('botón Siguiente incrementa tiempo')
  test('botón Anterior decrementa tiempo')
  test('botón Anterior deshabilitado en mínimo (3600s)')
  test('botón Siguiente deshabilitado en máximo (57600s)')
  test('botón Reset vuelve a 01:00:00')
  test('muestra indicador de sesión actual (ej: "Sesión 45/460")')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/pages/Timer.tsx`

```typescript
export default function Timer() {
  const {
    currentFormatted,
    incrementNext,
    incrementPrevious,
    resetTimer,
    isAtMin,
    isAtMax,
    currentSessionIndex,
    totalSessions
  } = useExponentialTimer()

  return (
    // JSX con diseño Tailwind
  )
}
```

**Diseño Tailwind (Premium, Moderno, Minimalista):**
- **Layout:** Centrado vertical/horizontal, Mobile-First
- **Display Tiempo:**
  - Tipografía: `text-8xl md:text-9xl font-bold`
  - Color: `text-white`
  - Fondo gradiente sutil con `bg-prime`
- **Botones:**
  - Siguiente: `bg-accent hover:bg-accent/80 transition-all`
  - Anterior: `bg-action hover:bg-action/80 transition-all`
  - Reset: `bg-alert hover:bg-alert/80 transition-all`
  - Deshabilitado: `disabled:opacity-50 disabled:cursor-not-allowed`
  - Micro-animación: `transform active:scale-95 transition-transform`
- **Indicador Sesión:** `text-sm text-gray-400`

### Criterios de Aceptación
- ✅ Tests de lógica pasan (NO tests de diseño)
- ✅ Diseño responsivo (Mobile-First)
- ✅ Micro-animaciones en interacciones
- ✅ Botones deshabilitados correctamente
- ✅ Usa hook `useExponentialTimer` como única fuente

### Dependencias
- Fase 4 (useExponentialTimer)

---

## FASE 6: Componente Progress - Gráfica Exponencial

### Objetivo
Visualizar progreso en gráfica de línea con sincronización exacta.

### Tests a Escribir (TDD - Lógica, NO diseño)
**Archivo:** `src/pages/Progress.test.tsx`

```typescript
describe('Progress Page', () => {
  test('renderiza canvas de Chart.js')
  test('datos de gráfica coinciden con exponentialSequence')
  test('marca posición actual del usuario en gráfica')
  test('muestra texto de progreso (ej: "45 de 460 sesiones")')
  test('muestra porcentaje de progreso (ej: "9.78%")')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/pages/Progress.tsx`

```typescript
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Registrar componentes Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Progress() {
  const {
    exponentialSequence,
    currentSeconds,
    currentSessionIndex,
    totalSessions
  } = useExponentialTimer()

  // Configurar datos para Chart.js
  const chartData = {
    labels: exponentialSequence.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Tiempo (segundos)',
        data: exponentialSequence,
        borderColor: '#000080', // accent
        backgroundColor: 'rgba(0, 0, 128, 0.1)',
        pointBackgroundColor: exponentialSequence.map((val, i) =>
          val === currentSeconds ? '#FF0000' : '#000080' // alert para actual
        ),
        pointRadius: exponentialSequence.map((val) =>
          val === currentSeconds ? 8 : 2 // punto grande para actual
        )
      }
    ]
  }

  return (
    // JSX con Line chart
  )
}
```

**Diseño Tailwind:**
- Contenedor: `bg-prime min-h-screen p-4`
- Gráfica: Width 100%, max-width `max-w-4xl mx-auto`
- Texto progreso: `text-white text-center text-xl`
- Porcentaje: `text-accent font-bold text-3xl`

**CRÍTICO (del doc/especificaciones.md):**
- Usar `exponentialSequence` del hook (puntos DISCRETOS)
- NO generar función continua
- Sincronización exacta con valores del temporizador

### Criterios de Aceptación
- ✅ Tests de lógica pasan
- ✅ Gráfica muestra puntos discretos (NO continua)
- ✅ Punto actual destacado visualmente
- ✅ Sincronización exacta con hook
- ✅ Diseño responsivo

### Dependencias
- Fase 4 (useExponentialTimer)
- chart.js + react-chartjs-2 (YA INSTALADO)

---

## FASE 7: Componente Calculator - Proyección de Sesiones

### Objetivo
Calcular sesiones faltantes/pasadas hacia tiempo objetivo.

### Tests a Escribir (TDD)
**Archivo:** `src/pages/Calculator.test.tsx`

```typescript
describe('Calculator Page', () => {
  test('input acepta formato HH:MM:SS')
  test('calcula sesiones faltantes para objetivo futuro')
  test('calcula sesiones pasadas para objetivo pasado')
  test('muestra "Ya estás en esta meta" si objetivo = actual')
  test('muestra error si objetivo < 01:00:00')
  test('muestra error si objetivo > 16:00:00')
  test('valida formato inválido (ej: "25:00:00")')
  test('botón calcular deshabilitado si input vacío')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/pages/Calculator.tsx`

```typescript
export default function Calculator() {
  const { currentSeconds } = useExponentialTimer()
  const [targetInput, setTargetInput] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = () => {
    const targetSeconds = hhmmssToSeconds(targetInput)

    if (!targetSeconds) {
      setError('Formato inválido. Usa HH:MM:SS')
      return
    }

    if (!validateTimeRange(targetSeconds)) {
      setError('Tiempo debe estar entre 01:00:00 y 16:00:00')
      return
    }

    const sessions = calculateSessionsToTarget(currentSeconds, targetSeconds)
    setResult(sessions)
    setError(null)
  }

  return (
    // JSX con formulario
  )
}
```

**Diseño Tailwind:**
- Input: `bg-prime border-accent text-white placeholder-gray-500`
- Botón Calcular: `bg-accent hover:bg-accent/80 disabled:opacity-50`
- Resultado Positivo: `text-action text-2xl` (faltan X)
- Resultado Negativo: `text-alert text-2xl` (hace X)
- Resultado Cero: `text-white text-2xl` (meta actual)
- Error: `text-alert text-sm`

**Feedback al Usuario:**
- `sessions > 0`: "Te faltan {sessions} sesiones para llegar a {target}"
- `sessions = 0`: "Ya estás en esta meta"
- `sessions < 0`: "Alcanzaste este tiempo hace {abs(sessions)} sesiones"

### Criterios de Aceptación
- ✅ Todos los tests pasan
- ✅ Validación de formato HH:MM:SS
- ✅ Validación de rango [01:00:00, 16:00:00]
- ✅ Feedback claro (futuro/presente/pasado)
- ✅ Manejo de errores amigable

### Dependencias
- Fase 1 (hhmmssToSeconds, validateTimeRange)
- Fase 2 (calculateSessionsToTarget)
- Fase 4 (useExponentialTimer para currentSeconds)

---

## FASE 8 (FINAL): Routing y Navegación

### Objetivo
Conectar las 3 páginas con react-router-dom y navegación global.

### Tests a Escribir (TDD)
**Archivo:** `src/App.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

describe('App Routing', () => {
  test('ruta "/" renderiza Timer')
  test('ruta "/progress" renderiza Progress')
  test('ruta "/calculator" renderiza Calculator')
  test('navegación entre rutas funciona')
  test('ruta inválida redirige a "/"')
})
```

### Componentes/Funciones a Implementar
**Archivo:** `src/App.tsx` (reemplazar contenido existente)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Timer from './pages/Timer'
import Progress from './pages/Progress'
import Calculator from './pages/Calculator'
import Navigation from './components/Navigation'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-prime">
        <Navigation />
        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
```

**Archivo:** `src/components/Navigation.tsx`

```typescript
import { NavLink } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="bg-accent p-4">
      <div className="max-w-4xl mx-auto flex justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-white font-bold' : 'text-gray-400'
          }
        >
          Timer
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            isActive ? 'text-white font-bold' : 'text-gray-400'
          }
        >
          Progress
        </NavLink>
        <NavLink
          to="/calculator"
          className={({ isActive }) =>
            isActive ? 'text-white font-bold' : 'text-gray-400'
          }
        >
          Calculator
        </NavLink>
      </div>
    </nav>
  )
}
```

**Diseño Navegación:**
- **Mobile:** Barra inferior fija (`fixed bottom-0`)
- **Desktop:** Barra superior (`relative top-0`)
- **Transición:** `transition-colors duration-200`
- **Activa:** Resaltado con `text-white font-bold`

### Criterios de Aceptación
- ✅ Tests de routing pasan
- ✅ Navegación funcional en todas las páginas
- ✅ Ruta inválida redirige a "/"
- ✅ NavLink con estado activo visual
- ✅ Responsive (barra inferior móvil, superior escritorio)

### Dependencias
- Fases 5, 6, 7 (páginas Timer, Progress, Calculator)
- react-router-dom (YA INSTALADO)

---

## Estructura Final del Proyecto

```
src/
├── components/
│   ├── Navigation.tsx
│   └── Navigation.test.tsx (opcional, tests básicos)
├── hooks/
│   ├── useExponentialTimer.ts
│   └── useExponentialTimer.test.ts
├── pages/
│   ├── Timer.tsx
│   ├── Timer.test.tsx
│   ├── Progress.tsx
│   ├── Progress.test.tsx
│   ├── Calculator.tsx
│   └── Calculator.test.tsx
├── utils/
│   ├── timeUtils.ts
│   ├── timeUtils.test.ts
│   ├── exponentialCalculations.ts
│   ├── exponentialCalculations.test.ts
│   ├── storage.ts
│   └── storage.test.ts
├── test/
│   └── setup.ts (YA EXISTE)
├── App.tsx
├── App.test.tsx
├── main.tsx
└── index.css
```

---

## Resumen de Dependencias entre Fases

```
Fase 1 (Utils)
  ↓
Fase 2 (Cálculos) ← depende de Fase 1
  ↓
Fase 3 (Storage) ← depende de Fase 1
  ↓
Fase 4 (Hook) ← depende de Fases 1, 2, 3
  ↓
Fase 5 (Timer) ← depende de Fase 4
  ↓
Fase 6 (Progress) ← depende de Fase 4
  ↓
Fase 7 (Calculator) ← depende de Fases 1, 2, 4
  ↓
Fase 8 (Routing) ← depende de Fases 5, 6, 7
```

---

## Comandos de Verificación

Después de cada fase:

```bash
# Ejecutar tests de la fase
npm test -- nombre-archivo.test.ts

# Ejecutar todos los tests
npm test

# Verificar cobertura
npm test -- --coverage

# Verificar lint
npm run lint

# Verificar build
npm run build
```

---

## Notas Finales

1. **TDD ESTRICTO:** Escribir tests ANTES de implementar cada función
2. **Cobertura:** Priorizar lógica de negocio (Fases 1-4), no diseño UI
3. **Algoritmos:** Seguir EXACTAMENTE las fórmulas de `doc/especificaciones.md`
4. **Diseño:** Usar colores Tailwind configurados (`prime`, `accent`, `action`, `alert`)
5. **Validación:** Toda función que modifique tiempo DEBE validar límites
6. **Persistencia:** Auto-guardado transparente, sin botón "Guardar"
7. **Ciclo TDD:** RED (test falla) → GREEN (test pasa) → REFACTOR (optimizar)
