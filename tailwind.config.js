/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#5DF0F9', 
        madBlack: '#162B31',
        madBlackHover:"",
      //  providerGreen:'#4dff4d',
        providerGreen:'#78C1F3',
        providerBluePrimary:"#78C1F3",
        providerBlueSecondary:"#9BE8D8",
        customViolet:'#7952B3',
        darkBlue:'#06278a',
        customYellow:"#ffb400",
        adminSecondary:"#9B7EBD",
        customGrey:"#A59D84",
        newGreen:"#17C964"
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'dark-yellow': '0 4px 6px rgba(255, 215, 0, 0.5)', 
        'dark-yellow-lg': '0 10px 15px rgba(255, 215, 0, 0.7)', 
      },
      fontFamily: {
        atma: ['Atma', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    
  ],
}