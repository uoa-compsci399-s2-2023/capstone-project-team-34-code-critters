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
      colors: {
        darkslategray: '#2F4F4F',
        mediumseagreen: '#3CB371',
        gray: '#808080',
        lightgray: '#D3D3D3',
        whitesmoke: '#F5F5F5',
        // ... other color definitions
      },
    },
  },
  plugins: [require("daisyui")],
}