/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'etep-blue': '#1B2653',
        'etep-orange': '#F15A24',
        'etep-orange-dark': '#d94e1f',
      },
    },
  },
  plugins: [],
}