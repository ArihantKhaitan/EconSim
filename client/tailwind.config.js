// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'gradient': 'gradient 3s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      colors: {
        slate: {
          850: '#1a2332',
          950: '#0f1419',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(16, 185, 129, 0.2)',
        'glow-md': '0 0 30px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 45px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
}