// tailwind.config.js
import scrollbarHide from 'tailwind-scrollbar-hide'

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    scrollbarHide
  ],
}