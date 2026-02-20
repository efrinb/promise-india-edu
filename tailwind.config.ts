import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F5132',
          50: '#E8F5EE',
          100: '#D1EBDD',
          200: '#A3D7BB',
          300: '#75C399',
          400: '#47AF77',
          500: '#0F5132',
          600: '#0C4128',
          700: '#09311E',
          800: '#062014',
          900: '#03100A',
        },
        accent: {
          DEFAULT: '#B02A37',
          50: '#FCEBEC',
          100: '#F9D7D9',
          200: '#F3AFB3',
          300: '#ED878D',
          400: '#E75F67',
          500: '#B02A37',
          600: '#8D222C',
          700: '#6A1921',
          800: '#471116',
          900: '#24080B',
        },
        secondary: {
          DEFAULT: '#28A745',
          50: '#E9F7EC',
          100: '#D3EFD9',
          200: '#A7DFB3',
          300: '#7BCF8D',
          400: '#4FBF67',
          500: '#28A745',
          600: '#208637',
          700: '#186429',
          800: '#10431C',
          900: '#08210E',
        },
        background: {
          DEFAULT: '#F8F9FA',
          dark: '#1F2937',
        },
        text: {
          DEFAULT: '#1F2937',
          light: '#6B7280',
          lighter: '#9CA3AF',
        },
      },
    },
  },
  plugins: [],
};

export default config;