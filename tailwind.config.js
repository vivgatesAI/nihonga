/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bodoni Moda', 'Didot', 'Georgia', 'serif'],
        body: ['Alegreya', 'Georgia', 'serif'],
      },
      colors: {
        washi: '#f0ebe3',
        washiDark: '#0e0c0a',
        kozo: '#1e1b17',
        kozoLight: '#2a2420',
        sumi: '#f0ebe3',
        sumiDim: '#a09888',
        indigo: '#4a6080',
        indigoDeep: '#1a2035',
        vermillion: '#c23b22',
        vermillionDark: '#8b2515',
        gold: '#b8963e',
        goldDim: '#8a6e2e',
        goldMuted: 'rgba(184,150,62,0.08)',
        ink: '#f0ebe3',
        inkLight: '#a09888',
        inkFaint: '#5a5248',
      },
    },
  },
  plugins: [],
};