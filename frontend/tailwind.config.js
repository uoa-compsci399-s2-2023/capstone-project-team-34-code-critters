/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'varela': ['Varela Round', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4ade80",
                  
          "secondary": "#38bdf8",
                  
          "accent": "#e11d48",

          //blue, purple
          // "primary": "#5695FF",
                  
          // "secondary": "#C020FF",
                  
          // "accent": "#21D3FF",

          //blue, green
          // "primary": "#1AE1B0",
                  
          // "secondary": "#03B3EA",
                  
          // "accent": "#26F897",
                  
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
