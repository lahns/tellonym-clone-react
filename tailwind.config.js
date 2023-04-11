/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        'logo': ['Rowdies']
      },
      colors: {
        primary: {
          light: '#D1E7FF',
          bg: '#93c5fd',
          onBg: '#74B4FC',
          // onBg: '#769eca' //'#60a5fa'
        },
        secondary: {
          light: '#FFDEB9',
          bg: '#fdcb93',
          onBg: '#D69D5C'
        },
        error: {
          light: '#FFCACA',
          bg: '#fca5a5', //'#f87171'
          onBg: '#D46A6A'
        },
        gray: {
          bg: '#f3f4f6',
          outline: '#e5e7eb',
          onBg: '#9ca3af'
        },
        text: {
          header: '#0e1111',
          normal: '#232b2b',
          secondary: '#353839'
        }
      }
    },
  },
  plugins: [],
}
