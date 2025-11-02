/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4',
        secondary: '#8B0A1A',
        accent: '#FFC67D',
        background: '#121212',
        surface: '#1A1A1A',
        textPrimary: '#FFFFFF',
        textSecondary: '#AAAAAA',
      },
    },
  },
  plugins: [],
}
