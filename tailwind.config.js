module.exports = {
  theme: {
    extend: {
      spacing: {
        'full': '100%',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
      },
      fontSize: {
        'xxxs': '.25rem',
        'xxs': '.5rem',
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        'icon': '3rem'
      },
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        terceary: 'var(--terceary)',
        light1: 'var(--light1)',
        light2: 'var(--light2)',
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    backgroundOpacity: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    backgroundClip: ['responsive', 'hover', 'focus', 'active']
  },
  plugins: []
}