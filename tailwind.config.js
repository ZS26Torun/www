/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './components/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF5F5', 100: '#FFEBEE', 200: '#FFCDD2', 300: '#EF9A9A',
          400: '#EF5350', 500: '#E53935', 600: '#C62828', 700: '#B71C1C',
          800: '#8B0000', 900: '#4A0000',
        },
        leaf: { 600: '#2B7333', 700: '#1E5C27' },
      },
      fontFamily: {
        sans: ['Lexend', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
