/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e63946',
          dark: '#c1121f',
          light: '#ff6b6b',
        },
        secondary: {
          DEFAULT: '#1d3557',
          light: '#457b9d',
        },
        accent: '#a8dadc',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(10deg)' },
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.15)',
        'xl-custom': '0 20px 60px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '30px',
      },
    },
  },
  plugins: [],
  // Important to prevent Tailwind from conflicting with MUI
  corePlugins: {
    preflight: false,
  },
}

