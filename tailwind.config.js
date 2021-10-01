module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary)',
        'secondary': 'var(--secondary)',
        'terceary': 'var(--terceary)',
        'light1': 'var(--light1)',
        'light2': 'var(--light2)',
        'modal-shadow': 'var(--modal-shadow)'
      },
      boxShadow: {
        'light': 'inset 0 -5px 10px var(--light-shadow), inset 0 5px 10px var(--light-shadow)',
        'secondary-darker': 'inset -5px -5px 10px var(--secondary-shadow), inset 5px 5px 10px var(--secondary-shadow)'
      },
      fontFamily: {
        muli: 'Muli'
      },
      padding: {
        '1/3': '33.33333%',
        '2/3': '66.66667%'
      },
      spacing: {
        '100': '25rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '144': '36rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ]
}
