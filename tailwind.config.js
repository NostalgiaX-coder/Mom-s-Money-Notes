/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F3ECDE',
        },
        sage: {
          50: '#F1F6EF',
          100: '#DCEAD7',
          400: '#7FA37A',
          500: '#5E8C58',
          600: '#4A7444',
        },
        clay: {
          50: '#FDF1EC',
          100: '#F9DED2',
          400: '#E0805B',
          500: '#D06744',
          600: '#B05435',
        },
        gold: {
          400: '#D4A857',
          500: '#C29440',
        },
        ink: {
          700: '#3A3733',
          800: '#2B2926',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '1.125rem',
      },
      borderRadius: {
        xl2: '1.25rem',
      }
    },
  },
  plugins: [],
}
