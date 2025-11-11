/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#bbf7d0',    // Light green
          DEFAULT: '#22c55e',  // Green
          dark: '#15803d',     // Dark green
        }
      }
    },
  },
  plugins: [],
}