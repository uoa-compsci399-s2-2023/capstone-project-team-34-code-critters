/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'varela': ['Varela Round', 'sans-serif'],
      },
      colors: {
        'cust-grey': '#121212',
        'cust-grey-1': '#2e2e2e',
        'cust-grey-hover': '#222222',
        'cust-dark-text': '#e3e3e3',
      }
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4ade80",

          "secondary": "#38bdf8",

          "accent": "#e11d48",

          "neutral": "#111827",

          "base-100": "#ffffff",

          "info": "#06b6d4",

          "success": "#34d399",

          "warning": "#fbbf24",

          "error": "#f87171",
        },
      },
    ],
  },
  plugins: [function ({ addUtilities }) {
    const newUtilities = {
      '.shadow-red': {
        boxShadow: '0 4px 6px -1px rgba(255, 0, 0, 0.1), 0 2px 4px -1px rgba(255, 0, 0, 0.06)',
      },
      '.shadow-white': {
        boxShadow: '0 4px 6px 4px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
      },
      '.shadow-big-white': {
        boxShadow: '0 0 15px 5px rgba(255, 255, 255, 0.5)',
      },
    }
    addUtilities(newUtilities)
    },
    require("daisyui")],
}
