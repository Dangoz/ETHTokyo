/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        background: '#0d1117',
        foreground: '#161b22',
        bgBlue: '#111827',
        bgGrey: '#374151',
        primary: '#2563eb',
        secondary: 'rgba(192, 132, 252, 0.5)',
      },
      boxShadow: {
        custom: "0 0 10px #29d, 0 0 5px #29d",
      },
      gradientColorStops: {
        gradientOne: '#FFB7C5',
        gradientTwo: '#0A3D62',
        gradientThree: '#FFC300',
      },
    },
  },
  
  plugins: [],
}
