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
        washi: '#faf8f2',
        kozo: '#ede8df',
        sumi: '#1a1714',
        sumiLight: '#3d3830',
        indigo: '#283149',
        indigoDeep: '#1a2035',
        vermillion: '#c23b22',
        vermillionLight: '#d95640',
        gold: '#b8963e',
        goldLight: '#d4b96a',
        ink: '#2d2926',
        inkLight: '#6b6158',
      },
    },
  },
  plugins: [],
};