/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./trakt-tools/*.html"],
  theme: {
    fontFamily: {
      'sans': ['Inter', 'sans-serif']
    },
    extend: {
      colors: {
        'enzo-sky': '#0080b7',
        'neutral-850': '#333333'
      },
      boxShadow: {
        'enzo-shadow-size': '0px 0px 50px -12px rgb(0 0 0 / 0.25)'
        //          offset-x | offset-y | blur-radius | spread-radius | color
      },
      screens: {
        'xs': '415px'
      }
    }
  },
  darkMode: 'class',
  plugins: [],
}

