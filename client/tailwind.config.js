/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A004E', 
        secondary: '#500073',
        tertiary: '#C62300', 
        accent: '#F14A00',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

