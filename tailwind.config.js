/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        default: {
          css: {
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.gray[100]'),
            },
            h3: {
              color: theme('colors.gray[200]'),
            },
            h4: {
              color: theme('colors.gray[300]'),
            },
            code: {
              color: theme('colors.blue[300]'),
              'font-weight': '900'
            },
            table: {
              'border-collapse': 'collapse',
              border: '1px solid ' + theme('colors.purple[300]'),
            },
            th: {
              color: theme('colors.white'),
              'font-weight': '900',
              border: '1px solid ' + theme('colors.purple[300]'),
              background: theme('colors.purple[500]'),
            },
            'li::marker': {
              color: theme('colors.blue[300]'),
            },
            td: {
              border: '1px solid ' + theme('colors.purple[300]'),
            },
            'th:first-child': {
              'padding-left': '0.5rem',
            },
            'td:first-child': {
              'padding-left': '0.5rem',
            },
            strong: {
              color: 'inherit'
            },
            pre: {
              'max-width': '65ch'
            }
          }
        },
        ckeditor: {
          css: {
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            strong: {
              color: 'inherit'
            },
            blockquote: {
              color: theme('colors.red[400]'),
            },
            'ol > li': {
              color: 'inherit'
            },
            'li::marker': {
              color: theme('colors.blue[300]'),
            },
          }
        }
      }),
      width: {
        '128': '32rem',
        '156': '40rem',
      },
      height: {
        '128': '32rem'
      },
      maxHeight: {
        '128': '32rem'
      },
      minHeight: {
        '40': '10rem'
      },
      maxWidth: {
        'xxs': '15rem'
      },
      screens: {
        'xs': '460px',
        'xxs': '300px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
