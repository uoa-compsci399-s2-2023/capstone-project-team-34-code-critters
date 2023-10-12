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
  plugins: [require("daisyui")],
}
