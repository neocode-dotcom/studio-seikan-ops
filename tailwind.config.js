/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#12202B',
        ink2: '#1B2B38',
        cream: '#ECE7DC',
        rust: '#A6362A',
        rustLight: '#C2534A',
        slate: '#93A0A8',
        green: '#3E6E5E',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
