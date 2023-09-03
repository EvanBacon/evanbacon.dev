/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,tsx,ts,jsx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        canhover: { raw: '(hover: hover)' },
      },
      animation: {
        kennyburns: 'kennyburns 1s ease 1s forwards',
      },
      keyframes: {
        kennyburns: {
          '0%': {
            opacity: 0,
            clipPath: 'inset(5%)',
            transform: 'scale(111.11%)',
          },
          '100%': { opacity: 1, clipPath: 'inset(0)', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-safe-area')],
};
