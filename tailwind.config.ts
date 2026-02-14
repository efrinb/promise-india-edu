import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3C5D',
          50: '#E6EDF2',
          100: '#CCDBE5',
          200: '#99B7CB',
          300: '#6693B1',
          400: '#336F97',
          500: '#0B3C5D',
          600: '#09304A',
          700: '#072438',
          800: '#051825',
          900: '#020C13',
        },
        secondary: {
          DEFAULT: '#1CA7A6',
          50: '#E7F7F7',
          100: '#CFEFEF',
          200: '#9FDFDF',
          300: '#6FCFCF',
          400: '#3FBFBF',
          500: '#1CA7A6',
          600: '#168685',
          700: '#116564',
          800: '#0B4342',
          900: '#062221',
        },
        accent: {
          DEFAULT: '#D9A441',
          50: '#FBF6ED',
          100: '#F7EDDB',
          200: '#EFDBB7',
          300: '#E7C993',
          400: '#DFB76F',
          500: '#D9A441',
          600: '#AE8334',
          700: '#826227',
          800: '#57421A',
          900: '#2B210D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
