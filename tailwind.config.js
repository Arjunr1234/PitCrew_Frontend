/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#5DF0F9', // Add your custom color here
        madBlack: '#162B31'
      },
    },
  },
  plugins: [],
}