 module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // You can set it to 'media' or 'class' if needed
  theme: {
    extend: {
      colors: {
        'destructive': '#d4183d',
        'primary': '#a1a1a1',
        'myGreen': '#009c00',
        'myRed': '#ff0000'
      },
       keyframes: {
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        vibrate: 'vibrate 0.3s linear infinite',
      },
    },
  },
  plugins: [],
};