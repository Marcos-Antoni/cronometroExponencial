# Documentación del Proyecto: Temporizador Exponencial

## 1. Descripción General
El proyecto consiste en una aplicación web moderna y progresiva (PWA capaz) que gestiona un "Temporizador Exponencial". El objetivo es permitir al usuario realizar un seguimiento de un tiempo que aumenta exponencialmente en un 1% con cada sesión ("Siguiente"), comenzando desde 1 hora hasta un límite máximo de 16 horas.

## 2. Tecnologías y Herramientas
El proyecto se construirá priorizando la simplicidad, el rendimiento y una experiencia de desarrollo ágil.

*   **Core Framework:** [React](https://react.dev/) (vía [Vite](https://vitejs.dev/)).
    *   *Razón:* Estándar de la industria, rápido, modular y fácil de desplegar.
*   **Lenguaje:** TypeScript (recomendado para mantenibilidad).
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/).
    *   *Razón:* Desarrollo rápido de UI responsiva y moderna sin salir del HTML/JSX.
*   **Enrutamiento:** `react-router-dom` (para la navegación entre páginas).
*   **Persistencia de Datos:** `localStorage` del navegador.
*   **Gráficos:** `chart.js` (para la visualización del progreso).
*   **Manejo de Fechas/Tiempo:** `Intl` API.
*   **Testing:** [vitest](https://vitest.dev/).

## 3. Diseño y UI/UX
El diseño debe ser **Premium, Moderno y Minimalista**. Debe impresionar al usuario ("WOW effect") mediante el uso de espacios, tipografía moderna (ej. Inter o Roboto) y la paleta de colores definida.

### 3.1 Paleta de Colores
Basada en [ColorHunt Palette](https://colorhunt.co/palette/000080ff00009e2a3a3a2525):
*   **Primario (Fondo/Base):** `#3A2525` (Dark Brownish) - Usar como fondo principal para dark mode.
*   **Acento Principal:** `#000080` (Navy Blue) - Para elementos de navegación o fondos secundarios.
*   **Acción/Resaltado:** `#9E2A3A` (Muted Red) - Para botones secundarios o gráficos.
*   **Alerta/High Contrast:** `#FF0000` (Red) - Usar con precaución, para notificaciones o puntos críticos en la gráfica.
*   *Texto:* Blanco o gris muy claro para contraste sobre los fondos oscuros.

### 3.2 Requerimientos de Diseño
*   **Responsive:** Diseño "Mobile-First". Debe verse perfecto en celulares, tablets y escritorio.
*   **Interacciones:** Micro-animaciones en botones (hover, click) y transiciones suaves entre páginas.
*   **Layout:** Navegación intuitiva (barra de navegación inferior en móvil, superior en escritorio).

## 4. Funcionalidades Detalladas

### 4.1 Lógica del Temporizador
*   **Valor Inicial:** 1 hora (01:00:00).
*   **Crecimiento:** +1% sobre el valor actual cada vez que se avanza.
*   **Límites:** Mínimo 1h, Máximo 16h.
*   **Persistencia:** El valor actual debe guardarse automáticamente en `localStorage` para no perder el progreso al cerrar la página.

### 4.2 Páginas de la Aplicación

#### A. Página Principal (Timer)
*   **Visualización:** El tiempo actual formato `HH:MM:SS` en el centro de la pantalla, con una tipografía grande y legible.
*   **Controles:**
    *   Botón **"Siguiente"**: Aumenta el tiempo actual en un 1%.
    *   Botón **"Anterior"**: Disminuye el tiempo (deshacer acción o reducir 1%).

#### B. Página de Gráfico (Progreso)
*   Un gráfico visual (línea) que muestre el progreso actual respecto a la meta (16h).
*   Debe indicar visualmente "dónde estás" en la curva exponencial.

#### C. Calculadora de Proyección
*   **Formulario:** Campo de entrada para tiempo (HH:MM:SS). Validación: Mínimo 1h, Máximo 16h.
*   **Cálculo:**
    *   Al ingresar un tiempo objetivo, el sistema calculará cuántos "clics" (días/sesiones) faltan para llegar a ese tiempo desde el valor *actual*.
    *   *Feedback:* "Te faltan X sesiones/días para llegar a [Tiempo Objetivo]".
    *   **Caso Pasado:** Si el tiempo objetivo es menor al actual, mostrar "Alcanzaste este tiempo hace X sesiones/días".

## 5. Estrategia de Despliegue (Deployment)
El proyecto será estático, lo que facilita su despliegue gratuito y rápido.

1.  **Plataforma:** [Vercel](https://vercel.com/) o [Netlify].
2.  **Proceso:**
    *   Subir código a GitHub.
    *   Conectar repositorio a Vercel/Netlify.
    *   Configuración automática de build (`npm run build`).
    *   Despliegue automático en cada push a `main`.

## 6. Pasos para Iniciar

1.  **Clonar el repositorio**
    ```bash
    git clone [URL_REPOSITORIO]
    cd temporizadorExponencial
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Ejecutar en modo desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`

4.  **Ejecutar tests**
    ```bash
    npm test
    ```

5.  **Ejecutar linter**
    ```bash
    npm run lint
    ```

6.  **Construir para producción**
    ```bash
    npm run build
    ```
    Los archivos compilados estarán en la carpeta `dist/`

7.  **Previsualizar build de producción**
    ```bash
    npm run preview
    ```

## 7. Estructura del Proyecto

```
temporizadorExponencial/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── pages/          # Páginas de la aplicación (Timer, Gráfico, Calculadora)
│   ├── hooks/          # Custom hooks (useTimer, useLocalStorage)
│   ├── utils/          # Funciones de utilidad (cálculos exponenciales, formateo)
│   ├── test/           # Configuración de testing
│   ├── App.tsx         # Componente principal con enrutamiento
│   ├── main.tsx        # Punto de entrada
│   └── index.css       # Estilos globales con Tailwind
├── public/             # Archivos estáticos
└── dist/               # Build de producción (generado)
```
