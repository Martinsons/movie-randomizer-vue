/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#1e293b',
        background: '#0f172a',
        surface: '#1e293b',
        'text-primary': '#f8fafc',
        'text-secondary': '#94a3b8',
      }
    },
  },
  plugins: [],
}
