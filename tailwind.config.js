/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        msblue: {
          DEFAULT: '#0078D4',
          hover: '#106EBE',
          light: '#EBF3FC',
        },
        msoffice: {
          DEFAULT: '#107C41',
          hover: '#0E6B37',
        },
        darkbg: '#0A0E17',
        darkcard: '#111827',
        darkcardelevated: '#1E293B',
        darkborder: '#273549',
      },
      fontFamily: {
        sans: ['Segoe UI Variable', 'Segoe UI', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['Cascadia Code', 'Consolas', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
