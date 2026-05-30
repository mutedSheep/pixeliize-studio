/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./guest/**/*.html",
    "./shared/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        navy: '#111827',
        cream: '#F5F5DC',
        pageBg: '#F6F9FC',
        brand: {
          cyan: '#5BB8D4',
          blue: '#4A7CC7',
          purple: '#8B5CF6',
          pink: '#C45FA0',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

