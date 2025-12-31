/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prime: '#3A2525', // Dark Brownish (Background)
        accent: '#000080', // Navy Blue
        action: '#9E2A3A', // Muted Red
        alert: '#FF0000', // Red
      },
    },
  },
  plugins: [],
}
