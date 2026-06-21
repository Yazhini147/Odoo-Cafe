export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  '#fdf6ee',
          100: '#f7e8d3',
          200: '#eecba0',
          300: '#e3a96d',
          400: '#d98a46',
          500: '#c97a34',
          600: '#a8602a',
          700: '#7e4720',
          800: '#5a3218',
          900: '#3b2010',
          950: '#1f0f06',
        },
        cream: {
          50:  '#fffdf7',
          100: '#fdf5e4',
          200: '#fae8c0',
          300: '#f4d48e',
          400: '#ecbb58',
        },
        mocha: {
          DEFAULT: '#3b2010',
          light:   '#5a3218',
          dark:    '#1f0f06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'coffee-sm': '0 2px 8px 0 rgba(59,32,16,0.10)',
        'coffee-md': '0 4px 20px 0 rgba(59,32,16,0.15)',
        'coffee-lg': '0 8px 40px 0 rgba(59,32,16,0.22)',
      },
    },
  },
  plugins: [],
};
