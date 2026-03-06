/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black:     '#0B0B0B',
        'off-white': '#F5F0E8',
        sand:      '#C8B99A',
        'sand-dark': '#9E8E78',
        silver:    '#ADADAD',
        mid:       '#1A1A1A',
        surface:   '#111111',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':   'fadeIn 0.4s ease both',
        'slide-in-right': 'slideInRight 0.45s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
