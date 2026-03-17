/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f5f0e8',
        linen: '#ede8df',
        'warm-tan': '#c8b89a',
        'sand-accent': '#a08060',
        'text-primary': '#2d2520',
        'text-secondary': '#7c6f5e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
