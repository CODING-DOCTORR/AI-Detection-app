/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0D0B14',
          elevated: '#13111C',
          card: '#1A1826',
          card2: '#1E1B2E',
          border: '#2A2740',
          accent: '#4F46E5',
          accentSoft: '#818cf8',
          light: '#FFFFFF',
          muted: '#9CA3AF',
          danger: '#f87171',
          success: '#22c55e',
        },
      },
    },
  },
  plugins: [],
};