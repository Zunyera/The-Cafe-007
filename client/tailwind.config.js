/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#f5c400",
        "brand-dark": "#d4a900",
        "brand-light": "#ffe98a",
        ink: "#171717",
        cream: "#fffaf0",
        chili: "#b91c1c",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};