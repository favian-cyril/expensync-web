/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      }
    },
  },
  daisyui: {
    themes: ['lofi', 'dark']
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
}

